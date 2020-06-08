describe('/add', () => {
  beforeEach(() => {
    cy.logout()
    cy.login()
  })

  it('Search for the agreement', () => {
    cy.visit('/home')
    cy.findByText('RAN099915').should('not.exist')
    cy.findByPlaceholderText(/Enter RAN/g).type('RAN099915{enter}')
    cy.findByText('RAN099915').should('exist')
  })
})
