describe('Login', () => {
  function killSessionAndLogin(role) {
    cy.svcClientLogout()
    cy.getCreds(role, { log: false })
      .then(creds => cy.svcClientLogin(...creds, { log: false }))
      .as('tokens')
    cy.get('@tokens').then(cy.svcClientSetCookie)
  }

  beforeEach(() => {})

  it('signs in', () => {
    killSessionAndLogin('range officer')

    cy.server()
    cy.route('/home').as('home')

    cy.visit('@home')

    cy.url().should('not.include', 'login')
  })

  it('searches for the agreement', () => {
    killSessionAndLogin('range officer')

    cy.get('form').within(() => {
      cy.get('input').type('RAN099931{enter}') // Only yield inputs within form
    })
  })

  it('starts a range use plan', () => {
    killSessionAndLogin('range officer')

    cy.findAllByText('New plan').click()
    cy.url().should('not.include', 'home')
  })

  it('enters a range name', () => {
    killSessionAndLogin('range officer')

    cy.findAllByLabelText('Range Name', { timeout: 15000 }).type(
      'Initial RUP test'
    )
    cy.findAllByText('Save Draft').click()
  })
})
