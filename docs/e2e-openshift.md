# E2E on OpenShift

The Playwright suite in `playwright/e2e/` runs as a one-shot Kubernetes Job in the **dev** namespace (`3187b2-dev`), pointed at the already-deployed web/api/database. Nothing extra is deployed to run it.

Dev topology (verify with `oc get all -n 3187b2-dev`):

- **Web**: `deployment/range-web-caddy` (1 pod), service `myra-web` on port 2015
- **API**: `deployment/range-api`, service `myra-api` on port 8080
- **Routes**: `web` → `https://myrangebc-dev.apps.silver.devops.gov.bc.ca` and `api` (`/api` path) → `myra-api`
- **Database**: Patroni cluster `range-pg17-dev`, accessed via service `range-pg17-dev-primary:5432`, database `myra`
- **Deployment**: the web deployment follows the latest tools `range-web-caddy:latest` image

## Architecture

```
GitHub Actions (e2e.yml)                OpenShift
├─ workflow_dispatch  ───────────────▶  ├─ 3187b2-tools
│  (or push to dev + dev deploy ready)  │   └─ range-web-e2e ImageStream (Playwright image)
│                                      └─ 3187b2-dev
│                                         └─ Job range-web-e2e
│                                            ├─ e2e container  — runs `npx playwright test --workers=1`
│                                            └─ artifact-sync  — `sleep infinity`, holds report/traces
└─ polls job → copies artifacts → cleans up job
```

## One-time setup

### 1. Build the e2e image (tools)

```bash
oc process -f openshift/e2e.bc.yaml -p SOURCE_REPOSITORY_URL=https://github.com/bcgov/range-web -p SOURCE_REPOSITORY_REF=dev | oc apply -f - -n 3187b2-tools
oc start-build range-web-e2e -n 3187b2-tools
```

The base image (`mcr.microsoft.com/playwright:v1.62.0-noble`) is pinned to the repo's `@playwright/test` version. If `@playwright/test` is bumped, bump the base image tag in `Dockerfile.e2e` too, or the browser executables won't match.

### 2. Create the credentials secret (test)

```bash
grep -E '^(PLAYWRIGHT_E2E_USERNAME|PLAYWRIGHT_E2E_PASSWORD|PLAYWRIGHT_E2E_SSO_ID|PLAYWRIGHT_E2E_LOGIN_MODE|PLAYWRIGHT_SSO_CLIENT_SECRET)=' .env.playwright.local \
  | sed -E 's/^PLAYWRIGHT_E2E_//; s/^PLAYWRIGHT_SSO_CLIENT_SECRET=/SSO_CLIENT_SECRET=/' \
  > /tmp/e2e-credentials.env
oc create secret generic e2e-credentials --from-env-file=/tmp/e2e-credentials.env -n 3187b2-dev
rm /tmp/e2e-credentials.env
```

Required keys: `USERNAME`, `PASSWORD`, `SSO_ID`, `LOGIN_MODE`. `SSO_CLIENT_SECRET` is optional. DB credentials come from the existing `range-pg17-dev-pguser-app-prod-myra` secret (keys `user`/`password`) at runtime — override with `-p POSTGRES_SECRET=<name>` if you create a dedicated e2e DB user. Never commit credentials.

### 3. Grant the Actions ServiceAccount (RBAC)

```bash
oc apply -f openshift/rbac/e2e.yaml
```

The roles bind the `github-cicd` ServiceAccount in `3187b2-tools`, which backs `OPENSHIFT_TOKEN`. They grant Job/Pod management in `3187b2-dev` and build/ImageStream access in `3187b2-tools`.

### 4. Repo secrets (GitHub)

Set `OPENSHIFT_SERVER` and `OPENSHIFT_TOKEN` on the repo. `OPENSHIFT_TOKEN` is the ServiceAccount token from step 3:

```bash
secret=$(oc get sa github-cicd -n 3187b2-tools -o jsonpath='{.secrets[*].name}' | tr ' ' '\n' | grep -v dockercfg | head -1)
oc get secret "$secret" -n 3187b2-tools -o jsonpath='{.data.token}' | base64 -d
```

## Manual run (oc)

```bash
oc process -f openshift/deployments/e2e.yaml -n 3187b2-dev \
  -p PLAYWRIGHT_BASE_URL="https://myrangebc-dev.apps.silver.devops.gov.bc.ca" \
  -p PLAYWRIGHT_API_BASE_URL="https://myrangebc-dev.apps.silver.devops.gov.bc.ca/api" \
  -p PLAYWRIGHT_TEST_SPEC="playwright/e2e/plan-extension-workflow.spec.ts" \
  | oc create -f - -n 3187b2-dev
```

Watch the suite, then read the result:

```bash
oc logs -c e2e job/range-web-e2e -n 3187b2-dev -f
pod=$(oc get pods -l job-name=range-web-e2e -n 3187b2-dev -o jsonpath='{.items[0].metadata.name}')
oc get pod "$pod" -n 3187b2-dev -o jsonpath='{.status.containerStatuses[?(@.name=="e2e")].state.terminated.exitCode}'
oc cp "$pod:/e2e/results/report/." ./playwright-report -c artifact-sync -n 3187b2-dev
oc cp "$pod:/e2e/results/artifacts/." ./playwright-artifacts -c artifact-sync -n 3187b2-dev
oc delete job range-web-e2e -n 3187b2-dev
```

The main container's exit code is the suite result (0 = green). The `artifact-sync` sidecar keeps the shared volume alive so report/traces can be copied out, then you delete the Job.

## GitHub Actions

`.github/workflows/e2e.yml`:

- **`workflow_dispatch`** — run immediately against whatever is currently deployed in dev. Pass `base_url`/`api_base_url` to override the defaults. Optional `test_spec` runs a specific Playwright spec path (for example `playwright/e2e/plan-extension-workflow.spec.ts`).
- **`push` to `dev`** — immediately builds `range-web-e2e:latest` from the pushed revision. In parallel, the workflow waits for the tools build and then for the dev `range-web-caddy` deployment to update to that latest image and roll out. It runs the suite only after the dev deployment is ready.
- **e2e image build** — every push-triggered run creates a binary OpenShift build from the pushed revision. Manual runs reuse `range-web-e2e:latest` and fail fast if it does not exist.

The suite's exit code decides the workflow result. Logs, the HTML report, and traces are uploaded as the `e2e-report` artifact.

## Troubleshooting

- **Chromium sandbox error** — the Job sets `PLAYWRIGHT_NO_SANDBOX=1`; verify the image/config picked it up (`oc get istag range-web-e2e:latest`).
- **DB connection refused / SSL error** — the Job targets `range-pg17-dev-primary:5432` with `PLAYWRIGHT_DB_SSL=true`. If the Patroni server does not enforce TLS, run the Job with `-p DB_SSL=false`.
- **Login fails** — confirm the e2e user exists in the target DB and the SSO client has the test web origin registered as a redirect URI.
- **API calls fail** — the API base URL must match what the deployed web uses (`${origin}/api` in the bundled app). Confirm with `oc get routes -n 3187b2-dev`.
- **Job stuck** — the suite timeouts are generous; if it never exits, delete the Job and inspect the logs.
- **Concurrency** — the suite seeds/cleans `E2E-AUTO` agreements in the shared test DB. Don't run the Job while another e2e run is in progress.
