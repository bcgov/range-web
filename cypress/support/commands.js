/* global Cypress, cy, expect */

const LOCAL_STORAGE_AUTH_KEY = 'range-web-auth';
const LOCAL_STORAGE_USER_KEY = 'range-web-user';
const E2E_PREFIX = 'E2E-AUTO';

const roleByCode = {
  DM: 2,
  SA: 3,
  AH: 4,
};

const roleEnvAlias = {
  SA: 'STAFF',
  DM: 'STAFF',
  AH: 'AH',
};

const getRequiredEnv = (key) => {
  const value = Cypress.env(key);

  if (!value) {
    throw new Error(`Missing required Cypress env var: ${key}`);
  }

  return value;
};

const getApiBaseUrl = () => Cypress.env('API_BASE_URL') || `${Cypress.config('baseUrl')}/api`;

const getTokenEndpoint = () => {
  const base = getRequiredEnv('SSO_BASE_URL');
  const realm = getRequiredEnv('SSO_REALM_NAME');
  return `${base}/auth/realms/${realm}/protocol/openid-connect/token`;
};

const createE2ENote = (testCase, fromCode, toCode) => `E2E:${testCase}:${fromCode}->${toCode}`;

Cypress.Commands.add('setRoleInDb', ({ username, roleId }) => {
  return cy.task('setUserRole', { username, roleId });
});

Cypress.Commands.add('loginAs', (roleCode) => {
  if (!roleByCode[roleCode]) {
    throw new Error(`Unsupported role code for loginAs: ${roleCode}`);
  }

  const roleEnv = roleEnvAlias[roleCode] || roleCode;
  const username = getRequiredEnv(`${roleEnv}_USERNAME`);
  const password = getRequiredEnv(`${roleEnv}_PASSWORD`);

  const payload = {
    grant_type: 'password',
    client_id: getRequiredEnv('SSO_CLIENT_ID'),
    username,
    password,
  };

  const clientSecret = Cypress.env('SSO_CLIENT_SECRET');
  if (clientSecret) {
    payload.client_secret = clientSecret;
  }

  return cy
    .request({
      method: 'POST',
      url: getTokenEndpoint(),
      form: true,
      body: payload,
      failOnStatusCode: true,
    })
    .then((tokenResponse) => {
      const authData = tokenResponse.body;
      return cy
        .request({
          method: 'GET',
          url: `${getApiBaseUrl()}/v1/user/me`,
          headers: {
            Authorization: `Bearer ${authData.access_token}`,
          },
          failOnStatusCode: true,
        })
        .then((userResponse) => {
          Cypress.env('ACCESS_TOKEN', authData.access_token);
          cy.visit('/');
          cy.window().then((win) => {
            win.localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authData));
            win.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userResponse.body));
          });
        });
    });
});

Cypress.Commands.add('logoutAndClearSession', () => {
  cy.visit('/');
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.clearCookies();
  cy.clearAllSessionStorage();
});

Cypress.Commands.add('switchStaffRoleAndRelogin', (roleCode) => {
  if (roleCode === 'AH') {
    cy.logoutAndClearSession();
    cy.loginAs('AH');
    cy.visit('/select-range-use-plan');
    return;
  }

  const roleId = roleByCode[roleCode];
  if (!roleId || (roleCode !== 'SA' && roleCode !== 'DM')) {
    throw new Error(`switchStaffRoleAndRelogin only supports SA or DM, got: ${roleCode}`);
  }

  const staffUsername = getRequiredEnv('STAFF_USERNAME');
  cy.setRoleInDb({ username: staffUsername, roleId });
  cy.logoutAndClearSession();
  cy.loginAs('SA');
  cy.visit('/select-range-use-plan');
});

Cypress.Commands.add('createPlanClone', ({ testCase }) => {
  const templatePlanId = getRequiredEnv('TEMPLATE_PLAN_ID');
  const destinationAgreementId = getRequiredEnv('DESTINATION_AGREEMENT_ID');
  const timestamp = Date.now();

  return cy
    .request({
      method: 'POST',
      url: getTokenEndpoint(),
      form: true,
      body: {
        grant_type: 'password',
        client_id: getRequiredEnv('SSO_CLIENT_ID'),
        username: getRequiredEnv('STAFF_USERNAME'),
        password: getRequiredEnv('STAFF_PASSWORD'),
        ...(Cypress.env('SSO_CLIENT_SECRET') ? { client_secret: Cypress.env('SSO_CLIENT_SECRET') } : {}),
      },
      failOnStatusCode: true,
    })
    .then((tokenResponse) => {
      const token = tokenResponse.body.access_token;
      return cy
        .request({
          method: 'PUT',
          url: `${getApiBaseUrl()}/v1/plan/${templatePlanId}/copy`,
          headers: { Authorization: `Bearer ${token}` },
          body: {
            agreementId: destinationAgreementId,
          },
          failOnStatusCode: true,
        })
        .then((copyResponse) => {
          const planId = copyResponse.body.planId;
          const rangeName = `${E2E_PREFIX}-${testCase}-${timestamp}`;

          return cy
            .request({
              method: 'GET',
              url: `${getApiBaseUrl()}/v1/reference`,
              headers: { Authorization: `Bearer ${token}` },
              failOnStatusCode: true,
            })
            .then((referenceResponse) => {
              const statuses = referenceResponse.body.PLAN_STATUS || [];
              const staffDraftStatus = statuses.find((status) => status.code === 'SD');

              return cy
                .request({
                  method: 'GET',
                  url: `${getApiBaseUrl()}/v1/plan/${planId}`,
                  headers: { Authorization: `Bearer ${token}` },
                  failOnStatusCode: true,
                })
                .then((planResponse) => {
                  const currentStatusCode = planResponse.body && planResponse.body.status && planResponse.body.status.code;

                  const setDraftRequest =
                    currentStatusCode === 'SD' || !staffDraftStatus
                      ? cy.wrap(null)
                      : cy.request({
                          method: 'PUT',
                          url: `${getApiBaseUrl()}/v1/plan/${planId}/status`,
                          headers: { Authorization: `Bearer ${token}` },
                          body: {
                            statusId: staffDraftStatus.id,
                            note: createE2ENote(testCase, currentStatusCode || 'UNKNOWN', 'SD'),
                          },
                          failOnStatusCode: true,
                        });

                  return setDraftRequest.then(() =>
                    cy
                      .request({
                        method: 'PUT',
                        url: `${getApiBaseUrl()}/v1/plan/${planId}`,
                        headers: { Authorization: `Bearer ${token}` },
                        body: { rangeName },
                        failOnStatusCode: true,
                      })
                      .then(() => ({ planId, rangeName })),
                  );
                });
            });
        });
    });
});

Cypress.Commands.add('openPlan', (planId) => {
  cy.intercept('GET', `**/v1/plan/${planId}`).as(`plan-${planId}`);
  cy.visit(`/range-use-plan/${planId}`);
  cy.wait(`@plan-${planId}`).then((interception) => {
    Cypress.env('LAST_PLAN_SNAPSHOT', interception.response && interception.response.body);
  });
});

Cypress.Commands.add('waitForPlanSnapshot', (planId) => {
  return cy.wait(`@plan-${planId}`).then((interception) => {
    const planBody = interception.response && interception.response.body;
    Cypress.env('LAST_PLAN_SNAPSHOT', planBody);
    return planBody;
  });
});

Cypress.Commands.add('submitPlanForFinalDecision', ({ planId }) => {
  cy.get('[data-testid="rup-submit-button"]').click();
  cy.get('[data-testid="submission-description-input"]').type('Automated E2E workflow submission note.');
  cy.get('[data-testid="submission-description-next"]').click();
  cy.get('[data-testid="submission-type-final-decision"]').click();
  cy.get('[data-testid="submission-type-next"]').click();
  cy.get('#submission-final-decision-agree').click({ force: true });
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="submission-final-decision-submit"]').length > 0) {
      cy.get('[data-testid="submission-final-decision-submit"]').click();
      return;
    }

    cy.get('[data-testid="submission-final-decision-next"]').click();
    cy.get('[data-testid="submission-request-esignatures-submit"]').click();
  });
  cy.waitForPlanSnapshot(planId);
});

Cypress.Commands.add('submitPlanForFeedback', ({ planId }) => {
  cy.get('[data-testid="rup-submit-button"]').click();
  cy.get('[data-testid="submission-description-input"]').type('Automated E2E workflow submission note.');
  cy.get('[data-testid="submission-description-next"]').click();
  cy.get('[data-testid="submission-type-feedback"]').click();
  cy.get('[data-testid="submission-type-next"]').click();
  cy.get('[data-testid="submission-feedback-submit"]').should('be.visible').click();
  cy.waitForPlanSnapshot(planId);
});

Cypress.Commands.add('submitStaffPlanToAh', ({ planId, note }) => {
  cy.get('[data-testid="rup-submit-button"]').click();
  cy.get('[data-testid="update-status-note-input"]').type(note);
  cy.get('[data-testid="update-status-confirm"]').click();
  cy.waitForPlanSnapshot(planId);
});

Cypress.Commands.add('buildE2ENote', (testCase, fromCode, toCode) => createE2ENote(testCase, fromCode, toCode));

Cypress.Commands.add('openPlanActions', () => {
  cy.get('[data-testid="rup-options-button"]').click();
  cy.contains('Plan Actions').should('exist');
});

Cypress.Commands.add('expectRoleActions', (roleCode, statusCode) => {
  cy.openPlanActions();

  if (roleCode === 'SA' && statusCode === 'SFD') {
    cy.get('[data-testid="plan-action-recommend-ready"]').should('exist');
    cy.get('[data-testid="plan-action-recommend-not-ready"]').should('exist');
    cy.get('[data-testid="plan-action-request-changes"]').should('exist');
  }

  if (roleCode === 'DM' && (statusCode === 'RR' || statusCode === 'RNR')) {
    cy.get('[data-testid="plan-action-approved"]').should('exist');
    cy.get('[data-testid="plan-action-not-approved-further-work"]').should('exist');
  }
});

Cypress.Commands.add('runPlanAction', ({ planId, actionTestId, note }) => {
  cy.openPlanActions();
  cy.get(`[data-testid="${actionTestId}"]`).click();

  if (note) {
    cy.get('body').then(($body) => {
      const noteInput = $body.find('[data-testid="update-status-note-input"]');

      if (noteInput.length > 0) {
        cy.wrap(noteInput).type(note);
      }
    });
  }

  cy.get('[data-testid="update-status-confirm"]').click();
  cy.waitForPlanSnapshot(planId);
});

Cypress.Commands.add('assertTransitionSequence', ({ planSnapshot, expectedStatusCodes }) => {
  expect(planSnapshot).to.have.property('planStatusHistory');
  const history = planSnapshot.planStatusHistory || [];
  expect(history.length).to.be.at.least(expectedStatusCodes.length - 1);

  const token = Cypress.env('ACCESS_TOKEN');
  if (!token) {
    throw new Error('Missing ACCESS_TOKEN in Cypress env for assertTransitionSequence');
  }

  return cy
    .request({
      method: 'GET',
      url: `${getApiBaseUrl()}/v1/reference`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: true,
    })
    .then((response) => {
      const planStatuses = response.body && response.body.PLAN_STATUS ? response.body.PLAN_STATUS : [];
      const statusById = planStatuses.reduce((acc, status) => {
        acc[status.id] = status.code;
        return acc;
      }, {});

      const transitions = history.map((record) => ({
        from: record.fromPlanStatusId ? statusById[record.fromPlanStatusId] : null,
        to: statusById[record.toPlanStatusId],
      }));

      const expectedTransitions = [];
      for (let i = 1; i < expectedStatusCodes.length; i += 1) {
        expectedTransitions.push({ from: expectedStatusCodes[i - 1], to: expectedStatusCodes[i] });
      }

      const tailTransitions = transitions.slice(-expectedTransitions.length);
      expect(tailTransitions).to.deep.equal(expectedTransitions);
    });
});

Cypress.Commands.add('assertTransitionActors', ({ planSnapshot, expectedRoleCodes }) => {
  const history = planSnapshot.planStatusHistory || [];
  expect(history.length).to.be.at.least(expectedRoleCodes.length);

  const tailHistory = history.slice(-expectedRoleCodes.length);
  const actualRoleCodes = tailHistory.map((record) => {
    const roleId = record.user && record.user.roleId;
    if (roleId === 2) return 'DM';
    if (roleId === 3) return 'SA';
    if (roleId === 4) return 'AH';
    return `UNKNOWN_${roleId}`;
  });

  expect(actualRoleCodes).to.deep.equal(expectedRoleCodes);
});

Cypress.Commands.add('assertHistoryVisible', () => {
  cy.get('.rup__history').should('be.visible');
  cy.get('.rup__history__record').should('have.length.greaterThan', 0);
});

Cypress.Commands.add('assertLastActorRole', ({ planSnapshot, expectedRoleCode }) => {
  const history = planSnapshot.planStatusHistory || [];
  const lastRecord = history[history.length - 1];

  expect(lastRecord, 'last history record').to.exist;
  expect(lastRecord.user, 'history record user').to.exist;
  expect(lastRecord.user.roleId, 'history record user roleId').to.equal(roleByCode[expectedRoleCode]);
});

Cypress.Commands.add('persistFailureDebugBundle', (testTitle) => {
  const snapshot = Cypress.env('LAST_PLAN_SNAPSHOT');
  if (!snapshot) {
    return;
  }

  const safeTitle = testTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const path = `cypress/artifacts/${safeTitle}-last-plan-snapshot.json`;
  cy.writeFile(path, snapshot);
});
