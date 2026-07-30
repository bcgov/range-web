# Initial RUP Playwright Baseline

This document defines the no-behavior-change baseline for refactoring the Initial RUP Playwright workflow suite.

## Baseline scenarios

The workflow suite currently validates these status paths end to end:

- SD -> C -> SFD -> RR -> A
- SD -> C -> SFD -> R -> SFD
- SD -> C -> SFD -> RNR -> NF
- SD -> C -> SR -> RFS -> SFD -> RR -> A
- SD -> C -> SR -> RFS -> SFD -> R -> SFD
- SD -> C -> SFD -> RR -> NA

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
