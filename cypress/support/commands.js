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
  'login',
  (user = 'range_officer') => {
    const authBaseUrl = Cypress.env('auth_base_url')
    const realm = Cypress.env('auth_realm')
    const client_id = Cypress.env('auth_client_id')
    const url = `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token/`

    const username = Cypress.env(`${user}_username`)
    const password = Cypress.env(`${user}_password`)

    if (!username)
      throw new Error(
        `Username was not provided for user '${user}'. Please set the CYPRESS_${user}_username environment variable`
      )
    if (!password)
      throw new Error(
        `Password was not provided for user '${user}' Please set the CYPRESS_${user}_password environment variable`
      )

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
      .then(tokens => {
        tokens.jwtData = jwtDecode(tokens.access_token)
        window.localStorage.setItem('range-web-auth', JSON.stringify(tokens))
      })
  },
  { log: false }
)

Cypress.Commands.add('logout', () => {
  Cypress.log({ name: 'KeyClock Logout' })
  const authBaseUrl = Cypress.env('auth_base_url')
  const realm = Cypress.env('auth_realm')

  window.localStorage.removeItem('range-web-auth')
  window.localStorage.removeItem('range-web-user')

  return cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`
  })
})
