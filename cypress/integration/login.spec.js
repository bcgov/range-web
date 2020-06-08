describe('Login', () => {
  beforeEach(() => {
    cy.login()
    cy.logout()
  })

  it('Signs in', () => {
    cy.visit('/home')
    cy.url().should('not.include', 'login')
  })
})
