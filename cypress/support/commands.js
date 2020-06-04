import jwtDecode from 'jwt-decode'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// Cypress.Commands.add("guiLogin", (user: string) => {
//
//
//
import '@testing-library/cypress/add-commands'

Cypress.Commands.add(
  'svcClientLogin',
  (username, password) => {
    //Cypress.log({ name: 'KeyClock Login' })
    const authBaseUrl = Cypress.env('auth_base_url')
    const realm = Cypress.env('auth_realm')
    const client_id = Cypress.env('auth_client_id')
    const url = `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token/`
    const app_base_url = Cypress.env('app_base_url')

    //changed grant_type to idir from password
    return cy
      .request({
        method: 'POST',
        url,
        followRedirect: false,
        form: true,
        body: {
          grant_type: 'password',
          client_id,
          scope: 'openid',
          username,
          password
        }
      })
      .its('body')
  },
  { log: false }
)

Cypress.Commands.add('svcClientLogout', () => {
  Cypress.log({ name: 'KeyClock Logout' })
  const authBaseUrl = Cypress.env('auth_base_url')
  const realm = Cypress.env('auth_realm')

  window.localStorage.removeItem('range-web-auth')
  window.localStorage.removeItem('range-web-user')
  cy.clearLocalStorage()

  return cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`
  })
})

Cypress.Commands.add('svcClientSetCookie', tokens => {
  Cypress.log({ name: 'Set Application Cookie' })

  tokens.jwtData = jwtDecode(tokens.access_token)
  window.localStorage.setItem('range-web-auth', JSON.stringify(tokens))
})

Cypress.Commands.add('getCreds', role => {
  const staff_range_officer_username = Cypress.env(
    'staff_range_officer_username'
  )
  const staff_range_officer_password = Cypress.env(
    'staff_range_officer_password'
  )

  const agreement_holder_primary_username = Cypress.env(
    'agreement_holder_primary_username'
  )
  const agreement_holder_primary_password = Cypress.env(
    'agreement_holder_primary_password'
  )

  const agreement_holder_secondary_1_username = Cypress.env(
    'agreement_holder_secondary_1_username'
  )
  const agreement_holder_secondary_1_password = Cypress.env(
    'agreement_holder_secondary_1_password'
  )

  switch (role) {
    case 'range officer':
      return [staff_range_officer_username, staff_range_officer_password]
      break
    case 'agreement holder primary':
      return [
        agreement_holder_primary_username,
        agreement_holder_primary_password
      ]
    default:
      break
  }
})
