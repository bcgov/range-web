describe('Login', () => {
  const app_base_url = Cypress.env('app_base_url')
  beforeEach(() => {
    cy.svcClientLogout()
    cy.svcClientLogin().as('tokens')
    cy.get('@tokens').then(cy.svcClientSetCookie)
  })

  it('Signs in, and shows privacy message on first login', () => {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/v1/user/me'
    }).as('me')

    cy.route('/home').as('home')

    cy.visit('@home')
      .wait('@me', { responseTimeout: 15000 })
      .then(console.log)

    cy.get('[class=privacy-info]').should('contain', 'Privacy') //contains('Continue to').click()
    cy.url().should('not.include', 'login')
  })
})
