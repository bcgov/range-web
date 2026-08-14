# E2E Test Plan: Plan Extension Process (Issue #1379)

## Goal

Validate the end-to-end plan extension workflow across Agreement Holder (AH), Staff, and Decision Maker (DM) roles, including approval and rejection outcomes.

## Scope

This test plan covers:

- Eligibility to enter the extension workflow (plan expiring within 1 year)
- Background job setup behavior
- AH voting flow across all client-linked holders
- Staff forwarding for DM decision
- DM extension approval with default end date behavior
- Rejection outcomes by AH, Staff, and DM
- Replacement plan option visibility after rejection

## Business Rules to Validate

1. Plan extension process starts only for plans expiring within 1 year.
2. Background job creates extension request entries for each client on the agreement.
3. Background job sets extension status to `Awaiting Votes`.
4. AH associated with each client can vote Yes or No.
5. Staff can forward for DM decision only after all AH votes are Yes.
6. DM can extend by selecting a new plan end date.
7. Default new end date is `current plan end date + 5 years`.
8. AH rejection results in `Agreement Holder Rejected` for all roles; plan cannot be extended; replacement plan option is visible.
9. Staff rejection results in `Staff Rejected` for all roles; plan cannot be extended; replacement plan option is visible.
10. DM rejection results in `District Manager Rejected` for all roles; plan cannot be extended; replacement plan option is visible.

## Preconditions and Test Data

- Agreement with at least two clients (to verify multi-AH voting)
- Staff owner assigned to agreement/plan
- DM user available
- Plan A: end date within next 365 days (eligible)
- Plan B: end date beyond next 365 days (ineligible)
- Background job can be triggered (or equivalent seeded data is available)

## Scenarios

### PE-001: Extension process initializes only for eligible plans

Given a plan expiring within 1 year
When the background job runs
Then extension request records are created for each agreement client
And plan extension status is `Awaiting Votes`

Given a plan expiring beyond 1 year
When the background job runs
Then no extension process is initialized for that plan

### PE-002: AH unanimous approval enables staff forward

Given a plan in `Awaiting Votes`
When each AH associated to the agreement votes Yes
Then received votes equals required votes
And Staff owner sees `Forward Extension For Decision`

### PE-003: Staff forwards extension to DM

Given all AH votes are Yes
When Staff owner clicks `Forward Extension For Decision`
Then extension status changes to `Awaiting Extension`
And DM sees extension decision actions

### PE-004: DM approves extension using date dialog

Given a plan in `Awaiting Extension`
When DM clicks `Approve Extension`
Then date picker dialog opens
And default date equals `current plan end date + 5 years`
And minimum selectable date is current plan end date
When DM confirms extension
Then plan is extended and extension date is displayed

### PE-005: AH rejection path

Given a plan in `Awaiting Votes`
When any AH votes No
Then AH, Staff, and DM all see `Agreement Holder Rejected`
And extension cannot proceed
And replacement plan creation option is visible to applicable non-AH roles

### PE-006: Staff rejection path

Given a plan in extension workflow
When Staff rejects extension
Then AH, Staff, and DM all see `Staff Rejected`
And extension cannot proceed
And replacement plan creation option is visible to applicable non-AH roles

### PE-007: DM rejection path

Given a plan in `Awaiting Extension`
When DM rejects extension
Then AH, Staff, and DM all see `District Manager Rejected`
And extension cannot proceed
And replacement plan creation option is visible to applicable non-AH roles

## Cross-Role Assertion Matrix

| Workflow Stage / Outcome | AH View                            | Staff View                      | DM View                         |
| ------------------------ | ---------------------------------- | ------------------------------- | ------------------------------- |
| Awaiting Votes           | Vote controls (if pending request) | Vote progress and reject option | Vote progress and reject option |
| All AH Yes               | Request completed state            | Forward action (owner only)     | Waiting state                   |
| Awaiting Extension       | Awaiting Extension                 | Awaiting Extension              | Approve/Reject actions          |
| AH Rejected              | Agreement Holder Rejected          | Agreement Holder Rejected       | Agreement Holder Rejected       |
| Staff Rejected           | Staff Rejected                     | Staff Rejected                  | Staff Rejected                  |
| DM Rejected              | District Manager Rejected          | District Manager Rejected       | District Manager Rejected       |

## Automation Notes

- Use role-based fixtures/sessions: `ahUser1`, `ahUser2`, `staffOwner`, `dmUser`.
- Prefer deterministic API seeding for extension status, requests, and dates.
- Assert status text transitions explicitly; avoid time-based assumptions.
- For default extension date assertion, compute expected value from current plan end date in test utility.

## Implementation Sub-Tasks (for Issue #1379)

- [ ] **ST-001 Test Harness Setup**: Confirm e2e framework, folder structure, role login helpers, and environment variables are available in CI and local runs.
- [ ] **ST-002 Seed/Data Utility**: Implement deterministic data setup utility for extension scenarios (eligible plan, ineligible plan, clients, AH users, staff owner, DM user).
- [ ] **ST-003 Background Job Trigger/Simulation**: Add helper to trigger background job or seed equivalent extension artifacts (`planExtensionRequests`, `Awaiting Votes`).
- [ ] **ST-004 Shared Assertions Library**: Create reusable assertions for extension status labels and action visibility by role.
- [ ] **ST-005 Scenario Test PE-001**: Implement eligible/ineligible initialization test (within 1 year vs beyond 1 year).
- [ ] **ST-006 Scenario Test PE-002**: Implement AH unanimous Yes flow and verify Staff owner forward action visibility.
- [ ] **ST-007 Scenario Test PE-003**: Implement Staff forward action and verify transition to `Awaiting Extension` with DM actions visible.
- [ ] **ST-008 Scenario Test PE-004**: Implement DM approve flow with date dialog validation (default `+5 years`, min date guard), then assert extended result.
- [ ] **ST-009 Scenario Test PE-005**: Implement AH rejection flow and assert cross-role `Agreement Holder Rejected` status plus replacement plan option visibility.
- [ ] **ST-010 Scenario Test PE-006**: Implement Staff rejection flow and assert cross-role `Staff Rejected` status plus replacement plan option visibility.
- [ ] **ST-011 Scenario Test PE-007**: Implement DM rejection flow and assert cross-role `District Manager Rejected` status plus replacement plan option visibility.
- [ ] **ST-012 Cross-Role Matrix Pass**: Add one matrix-driven validation pass to verify role-specific visibility for key workflow stages.
- [ ] **ST-013 Flakiness Hardening**: Replace brittle waits with explicit network/UI conditions; retry strategy only where justified.
- [ ] **ST-014 CI Integration**: Wire tests into CI job(s), including seed prerequisites and artifact capture (screenshots/video/logs) on failure.
- [ ] **ST-015 Documentation and Traceability**: Map each test file/test case ID to PE-001..PE-007 and link execution notes back to issue #1379.

## Exit Criteria

- Scenarios `PE-001` through `PE-007` pass in CI.
- Rejection outcomes are consistent across all roles.
- Replacement plan option visibility is correct for all rejection outcomes.
