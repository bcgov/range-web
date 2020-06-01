describe('Login', () => {
  const app_base_url = Cypress.env('app_base_url')
  beforeEach(() => {
    cy.svcClientLogout()
    cy.svcClientLogin().as('tokens')
    cy.get('@tokens').then(cy.svcClientSetCookie)
  })


  it('Signs in, and shows privacy message on first login', () => {
    cy.visit(app_base_url + '/home')
    cy.get('div.ui.small.modal.transition.visible.active').invoke('show')
    .contains('Continue to').click()
    cy.url().should('not.include', 'login')
	  
  })

  /*

  it('Can sign in and not show the privacy message', () => {
    cy.visit(app_base_url + '/home').contains('Privacy Information').should('not.exist')
    })
    */
})
