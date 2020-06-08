describe('Login', () => {
  beforeEach(() => {
    cy.login('range_officer')
  })

  it('Signs in, and shows privacy message on first login', () => {
    cy.visit('/home')

    cy.get('[class=privacy-info]').should('contain', 'Privacy') //contains('Continue to').click()
    cy.url().should('not.include', 'login')
  })
})
