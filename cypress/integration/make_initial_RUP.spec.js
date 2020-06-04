describe('Login', () => {
  function killSessionAndLogin(role) {
    cy.svcClientLogout()
    cy.getCreds(role, { log: false })
      .then(creds => cy.svcClientLogin(...creds, { log: false }))
      .as('tokens')
    cy.get('@tokens').then(cy.svcClientSetCookie)
  }

  beforeEach(() => {})

  it('starts a range use plan and saves + submits it', () => {
    killSessionAndLogin('range officer')

    cy.server()
    cy.route('/home').as('home')

    cy.log('go to select range use plan page')
    cy.visit('@home')
    cy.url().should('not.include', 'login')


    cy.log('find the agreement')
    cy.get('form').within(() => {
      cy.get('input').type('RAN099931{enter}') // Only yield inputs within form
    })

    cy.log('start a RUP')
    cy.findAllByText('New plan').click()
    cy.url().should('not.include', 'home')

    cy.log('enter a range name')
    cy.findAllByLabelText('Range Name', { timeout: 15000 }).type(
      'Initial RUP test'
    )

    cy.log('enter a start date')
    cy.findAllByLabelText('Plan Start Date', {timeout: 2000}).type('2020-07-23')

    cy.log('enter an end date')
    cy.findAllByLabelText('Plan End Date', {timeout: 2000}).type('2024-06-01')

    cy.log('save it')
    cy.findAllByText('Save Draft').click()

    cy.log('make sure there are no errors')
    cy.findAllByText('Error').should('not.exist')
  })

})
