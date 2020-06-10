describe('Login', () => {
  beforeEach(() => {
    cy.login('range_officer')
  })

  it('starts a range use plan and saves + submits it', () => {
    cy.login('range_officer')
    cy.visit('/home')
    cy.url().should('not.include', 'login')

    cy.findByPlaceholderText(/Enter RAN/g).type('RAN099931{enter}')

    // Create new plan
    cy.findByText('New plan').click()
    cy.url().should('not.include', 'home')

    cy.findAllByText('Staff Draft').should('have.length', 2)

    // Fill out RUP
    cy.findByLabelText('Range Name').type('Initial RUP test')

    cy.findByLabelText('Plan Start Date')
      .parent()
      .click()

    cy.get('.ui.popup').within(() => {
      cy.contains('.suicr-content-item', '6').click({ force: true })
    })

    cy.findByLabelText('Plan End Date')
      .parent()
      .click()

    cy.get('.ui.popup').within(() => {
      cy.contains('.suicr-content-item', '24').click({ force: true })
    })

    cy.findByText('Add Pasture').click()

    cy.get('.ui.modals').within(() => {
      cy.findByPlaceholderText('Pasture name').type('My pasture')
      cy.findByText('Submit').click()
    })

    cy.findByText('Pasture: My pasture').click()

    cy.findByLabelText(/Allowable AUMs/g).type('23')
    cy.findByLabelText(/Private Land Deduction/g).type('{backspace}12')
    cy.findByLabelText(/Pasture Notes/g).type(
      'Here are my pasture notes{enter}A new line of notes.'
    )

    cy.findByText('Add Plant Community').click()
    cy.findByText('Cattail').click()

    cy.findAllByText('Cattail')
      .eq(1)
      .click()

    cy.findByLabelText(/Aspect/g).type('SW')
    cy.findByLabelText(/Elevation/g)
      .click()
      .contains('700-899')
      .click()
    cy.findByLabelText(/Approved by minister/g).click({ force: true })
    cy.findByLabelText(/Plant Community Description/g).type(
      'Description for my plant community'
    )
    cy.findByLabelText(/Community URL/g).type('https://www.google.com')
    cy.findByLabelText(/Purpose of Action/g)
      .click()
      .contains(/Maintain/g)
      .click()

    // Save
    cy.findByText('Save Draft').click()

    cy.get('.sui-error-message').should('not.exist')
    cy.findByText('Successfully saved draft').should('exist')

    // Submit
    cy.findByText('Submit').click()

    cy.get('.ui.modals').within(() => {
      cy.findByPlaceholderText('Add notes here').type('Submission notes here')
      cy.findByRole('button', { name: 'Confirm' }).click()
    })

    cy.findByText('Submitted to AH for Input').should('exist')

    cy.findByText(/successfully updated the status/g).should('exist')
  })


  it.skip('submits back to staff to sign', () => {
    cy.login('agreement_holder_1')
    cy.visit('/home')
    cy.url().should('not.include', 'login')
  })

})
