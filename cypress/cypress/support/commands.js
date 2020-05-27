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
Cypress.Commands.add('svcClientLogin', () => {
  Cypress.log({ name: 'KeyClock Login' })
  const authBaseUrl = Cypress.env('auth_base_url')
  const realm = Cypress.env('auth_realm')
  const client_id = Cypress.env('auth_client_id')
  const username = Cypress.env('username')
  const password = Cypress.env('password')
  const url = `${authBaseUrl}/realms/${realm}/protocol/openid-connect/token/`

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
})

Cypress.Commands.add('svcClientLogout', () => {
  Cypress.log({ name: 'KeyClock Logout' })
  const authBaseUrl = Cypress.env('auth_base_url')
  const realm = Cypress.env('auth_realm')

  return cy.request({
    url: `${authBaseUrl}/realms/${realm}/protocol/openid-connect/logout`
  })
})

Cypress.Commands.add('svcClientSetCookie', tokens => {
  Cypress.log({ name: 'Set Application Cookie' })

  tokens.jwtData = jwtDecode(tokens.access_token)
  window.localStorage.setItem('range-web-auth', JSON.stringify(tokens))
})
