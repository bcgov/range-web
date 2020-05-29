describe('/add', () => {
  beforeEach(() => {
    cy.svcClientLogout()
    cy.svcClientLogin().as('tokens')
    cy.get('@tokens').then(cy.svcClientSetCookie)
  })

  it('Signs in', () => {
    cy.visit('https://web-range-myra-test.pathfinder.gov.bc.ca/home')
    cy.url().should('not.include', 'login')
  })
})
