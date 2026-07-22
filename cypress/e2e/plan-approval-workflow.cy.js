/* global cy, describe, before, it */

const TEST_CASES = {
  HAPPY_PATH: 'happy-path',
  CHANGE_LOOP: 'change-loop',
  NOT_READY: 'not-ready',
};

const buildNote = (testCase, fromCode, toCode) => `E2E:${testCase}:${fromCode}->${toCode}`;

const runSharedSetupToSfd = (testCase) => {
  cy.switchStaffRoleAndRelogin('SA');
  return cy.createPlanClone({ testCase }).then(({ planId }) => {
    cy.openPlan(planId);
    cy.submitStaffPlanToAh({
      planId,
      note: buildNote(testCase, 'SD', 'C'),
    });
    cy.switchStaffRoleAndRelogin('AH');
    cy.openPlan(planId);
    cy.submitPlanForFinalDecision({ planId });
    cy.switchStaffRoleAndRelogin('SA');
    cy.openPlan(planId);
    cy.expectRoleActions('SA', 'SFD');

    return cy.waitForPlanSnapshot(planId).then((planSnapshot) => ({ planId, planSnapshot }));
  });
};

describe('Initial RUP approval workflow', () => {
  before(() => {
    cy.loginAs('SA');
  });

  it('covers SD -> C -> SFD -> RR -> A', () => {
    runSharedSetupToSfd(TEST_CASES.HAPPY_PATH).then(({ planId }) => {
      cy.runPlanAction({
        planId,
        actionTestId: 'plan-action-recommend-ready',
        note: buildNote(TEST_CASES.HAPPY_PATH, 'SFD', 'RR'),
      });

      cy.switchStaffRoleAndRelogin('DM');
      cy.openPlan(planId);
      cy.expectRoleActions('DM', 'RR');

      cy.runPlanAction({
        planId,
        actionTestId: 'plan-action-approved',
        note: buildNote(TEST_CASES.HAPPY_PATH, 'RR', 'A'),
      });

      cy.waitForPlanSnapshot(planId).then((planSnapshot) => {
        cy.assertTransitionSequence({
          planSnapshot,
          expectedStatusCodes: ['SD', 'C', 'SFD', 'RR', 'A'],
        });
        cy.assertTransitionActors({
          planSnapshot,
          expectedRoleCodes: ['SA', 'AH', 'SA', 'DM'],
        });
      });

      cy.assertHistoryVisible();
    });
  });

  it('covers SD -> C -> SFD -> R -> SFD', () => {
    runSharedSetupToSfd(TEST_CASES.CHANGE_LOOP).then(({ planId }) => {
      cy.runPlanAction({
        planId,
        actionTestId: 'plan-action-request-changes',
        note: buildNote(TEST_CASES.CHANGE_LOOP, 'SFD', 'R'),
      });

      cy.switchStaffRoleAndRelogin('AH');
      cy.openPlan(planId);
      cy.submitPlanForFinalDecision({ planId });

      cy.waitForPlanSnapshot(planId).then((planSnapshot) => {
        cy.assertTransitionSequence({
          planSnapshot,
          expectedStatusCodes: ['SD', 'C', 'SFD', 'R', 'SFD'],
        });
        cy.assertTransitionActors({
          planSnapshot,
          expectedRoleCodes: ['SA', 'AH', 'SA', 'AH'],
        });
      });

      cy.assertHistoryVisible();
    });
  });

  it('covers SD -> C -> SFD -> RNR -> NF', () => {
    runSharedSetupToSfd(TEST_CASES.NOT_READY).then(({ planId }) => {
      cy.runPlanAction({
        planId,
        actionTestId: 'plan-action-recommend-not-ready',
        note: buildNote(TEST_CASES.NOT_READY, 'SFD', 'RNR'),
      });

      cy.switchStaffRoleAndRelogin('DM');
      cy.openPlan(planId);
      cy.expectRoleActions('DM', 'RNR');

      cy.runPlanAction({
        planId,
        actionTestId: 'plan-action-not-approved-further-work',
        note: buildNote(TEST_CASES.NOT_READY, 'RNR', 'NF'),
      });

      cy.waitForPlanSnapshot(planId).then((planSnapshot) => {
        cy.assertTransitionSequence({
          planSnapshot,
          expectedStatusCodes: ['SD', 'C', 'SFD', 'RNR', 'NF'],
        });
        cy.assertTransitionActors({
          planSnapshot,
          expectedRoleCodes: ['SA', 'AH', 'SA', 'DM'],
        });
      });

      cy.assertHistoryVisible();
    });
  });
});
