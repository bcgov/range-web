/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  require('cypress-log-to-output').install(on)
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // modify config values
  config.defaultCommandTimeout = 10000
  //const app_base_url = Cypress.env('app_base_url')
  //config.baseUrl = app_base_url + '/home'
  config.baseUrl = 'http://localhost:3000/home'

  // modify env var value
  config.env.ENVIRONMENT = 'dev'

  // return config
  return config
}
