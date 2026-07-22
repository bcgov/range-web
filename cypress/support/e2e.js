/* global Cypress, cy, afterEach */

import './commands';

afterEach(function onAfterEach() {
  const staffUsername = Cypress.env('STAFF_USERNAME');

  if (!staffUsername) {
    return;
  }

  cy.task('setUserRole', { username: staffUsername, roleId: 3 });

  if (this.currentTest && this.currentTest.state === 'failed') {
    cy.persistFailureDebugBundle(this.currentTest.fullTitle());
  }
});
