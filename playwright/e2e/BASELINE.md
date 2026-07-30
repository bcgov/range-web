# Initial RUP Playwright Baseline

This document defines the architecture and no-behavior-change baseline for the refactored Initial RUP Playwright workflow suite.

## Module architecture

```
playwright/e2e/
  plan-approval-workflow.spec.ts   — 6 scenario tests (ScenarioContext DSL)
  support/
    authRuntime.ts                 — auth/session helpers (login, role switch)
    dbRuntime.ts                   — DB seed, cleanup, role/status helpers
    actionRuntime.ts               — workflow action/fallback helpers
    scenarioRuntime.ts             — ScenarioContext class (DSL orchestrator)
  BASELINE.md                      — this file
```

### ScenarioContext (`scenarioRuntime.ts`)

Each scenario constructs a `ScenarioContext` via the static factory `ScenarioContext.create(...)`, then chains methods:

```ts
const ctx = await ScenarioContext.create({ page, apiContext, getApiBaseUrl, logE2E, isSingleUserMode, switchRoleAndRelogin, createPlanSeedByDb, testCase });
await ctx.submitToAh();             // SD → C (submit to AH)
await ctx.waitForStatus('C');       // poll until status reached
await ctx.as('AH');                 // switch role + open plan
await ctx.submitFinalDecision();    // C → SFD (or with type='feedback')
await ctx.runAction(actionId, toStatus);
await ctx.expectActions(statusCode);
await ctx.takeSnapshot();           // capture plan snapshot
await ctx.assertTransitions([...]); // verify transition history
ctx.assertActors([...]);            // verify actor roles
await ctx.assertHistoryVisible();   // verify UI history section
```

The factory seeds the plan via `createPlanSeedByDb` and logs in as SA, returning a fully initialised context.

### Layer responsibilities

| Layer                | Responsibility                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| `authRuntime.ts`     | Login, role switching, single-user-mode support                                |
| `dbRuntime.ts`       | PostgreSQL seed data creation, status updates, cleanup                         |
| `actionRuntime.ts`   | Plan actions (submit, approve, request changes, etc.) via UI and API           |
| `scenarioRuntime.ts` | Context-managed DSL that wraps the above into fluent scenario steps            |
| spec file            | Declares 6 scenario definitions and hooks (`beforeAll`/`afterEach`/`afterAll`) |

### Spec wrapper pattern

Spec wrappers bridge runtime functions to test-local context (env vars, logging). They remain in the spec file for:

- `switchRoleAndRelogin` — passes spec-local `roleByCode`, `loginPageAs`, `cachedSingleUserRecord`
- `createPlanSeedByDb` — passes spec-local DB pool and env settings
- `updatePlanStatusViaDb` — used inline by the NA scenario for DB-only transitions

## Baseline scenarios

The workflow suite validates these status paths end to end:

- SD -> C -> SFD -> RR -> A (happy path)
- SD -> C -> SFD -> R -> SFD (SA change request loop)
- SD -> C -> SFD -> RNR -> NF (not ready, not approved for further work)
- SD -> C -> SR -> RFS -> SFD -> RR -> A (AH feedback request, then happy)
- SD -> C -> SR -> RFS -> SFD -> R -> SFD (AH feedback request, change loop)
- SD -> C -> SFD -> RR -> NA (not approved via DB)

## Baseline verification commands

Run from repository root:

```bash
npm run typecheck
npm run test:e2e:run -- playwright/e2e/plan-approval-workflow.spec.ts --workers=1 --retries=0
```

Optional targeted branch checks:

```bash
npm run test:e2e:run -- playwright/e2e/plan-approval-workflow.spec.ts --workers=1 --retries=0 --grep "covers SD -> C -> SR -> RFS -> SFD -> RR -> A"
npm run test:e2e:run -- playwright/e2e/plan-approval-workflow.spec.ts --workers=1 --retries=0 --grep "covers SD -> C -> SFD -> RR -> NA"
```

## Behavior guardrails

- Use single-user E2E env contract (`PLAYWRIGHT_E2E_*`) and switch roles in DB before each login hop.
- Preserve role-switch + relogin checkpoints for SA, AH, and DM transitions.
- Keep per-scenario seeded data creation and cleanup behavior intact.
- Keep transition-history assertions on persisted plan status history.
- Keep fallback behavior for missing/disabled UI actions consistent with current suite.

## Failure artifacts

On failures, retain and inspect:

- Playwright trace/video/screenshot outputs.
- Last plan snapshot JSON in `playwright/artifacts/`.
- Structured E2E log lines that indicate role switch, action, and transition wait events.
