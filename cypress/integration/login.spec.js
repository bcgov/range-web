describe('Login', () => {
  beforeEach(() => {
    cy.logout()
    cy.login()
  })

  it('Signs in', () => {
    cy.visit('/home')
    cy.url().should('not.include', 'login')
  })
})
