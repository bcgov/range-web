describe('Login', () => {
  const app_base_url = Cypress.env('app_base_url')
  beforeEach(() => {
    cy.svcClientLogout()
    cy.svcClientLogin().as('tokens')
    cy.get('@tokens').then(cy.svcClientSetCookie)
  })

  it('Signs in', () => {
    cy.visit(app_base_url + '/home')
    cy.url().should('not.include', 'login')
  })
})
