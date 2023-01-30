//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

import jwtDecode from 'jwt-decode'
import axios from './axios'
import {
  SSO_BASE_URL,
  SSO_LOGIN_REDIRECT_URI,
  SSO_CLIENT_ID,
  GET_TOKEN_FROM_SSO,
  REFRESH_TOKEN_FROM_SSO,
  SITEMINDER_LOGOUT_ENDPOINT,
  API_BASE_URL, SSO_LOGOUT_ENDPOINT
} from '../constants/api'
import {saveDataInLocalStorage, getDataFromLocalStorage, deleteDataFromLocalStorage} from './localStorage'
import { stringifyQuery } from './index'
import { LOCAL_STORAGE_KEY, isBundled } from '../constants/variables'

export const getAuthHeaderConfig = () => {
  const { authData } = getAuthAndUserFromLocal()

  if (authData) {
    return {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        'content-type': 'application/json'
      }
    }
  }
  return {}
}

/**
 * this method is called immediately at the very beginning in authReducer
 * to initialize the auth and user objects in Router.js
 * @returns {object} the object that contains authData and user
 */
export const getAuthAndUserFromLocal = () => {
  const user = getDataFromLocalStorage(LOCAL_STORAGE_KEY.USER)
  const authData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH)
  return { authData, user }
}

/**
 *
 * @param {object} response the network response
 * the response looks like this
  {
    access_token: "characters"
    expires_in: 1800
    not-before-policy: 0
    refresh_expires_in: 3600
    refresh_token: "characters"
    session_state: "characters-characters-characters"
    token_type: "bearer"
  }
 */
export const saveAuthDataInLocal = response => {
  const data = { ...response.data }
  data.jwtData = jwtDecode(data.access_token)

  saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH, data)

  return data
}

/**
 *
 * @param {object} newUser the new user object
 */
export const saveUserProfileInLocal = newUser => {
  saveDataInLocalStorage(LOCAL_STORAGE_KEY.USER, newUser)
}

/**
 *
 * @param {string} code the code received from Single Sign On
 */
export const getTokenFromSSO = code => {
  const storedCodes = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE);
  if (!storedCodes || !storedCodes.codeVerifier) {
    console.error('Cannot proceed without PKCE challenge code. Restart authentication');
  }

  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
    code_verifier: storedCodes.codeVerifier
  }

  // no longer required
  deleteDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE);

  // make an application/x-www-form-urlencoded request with axios
  return axios({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: GET_TOKEN_FROM_SSO,
    data: stringifyQuery(data)
  })
}

/**
 *
 * @param {string} refreshToken the refreshToken saved in localStorage
 */
export const refreshAccessToken = refreshToken => {
  const data = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID
  }

  // make an application/x-www-form-urlencoded request with axios
  // pass isRetry in config so that it only tries to refresh once.
  return axios({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: REFRESH_TOKEN_FROM_SSO,
    data: stringifyQuery(data),
    isRetry: true
  })
}

/**
 * @returns {string} the refresh token
 */
const getRefreshTokenFromLocal = () => {
  const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH)
  return data && data.refresh_token
}

/**
 * @returns {object} the parsed data from Json Web Token
 */
const getJWTDataFromLocal = () => {
  const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH)
  return data && data.jwtData
}

/**
 *
 * @returns {boolean}
 */
export const isTokenExpired = () => {
  const jstData = getJWTDataFromLocal()

  if (jstData) {
    return new Date() / 1000 > jstData.exp
  }
  return false
}

/**
 *
 * @param {object} config Axios's config
 * @returns {boolean}
 */
const isRangeAPI = config => {
  if (config && config.baseURL) {
    return config.baseURL === API_BASE_URL
  }

  return false
}

export const signOutFromSSOAndSiteMinder = () => {
  window.open(SSO_LOGOUT_ENDPOINT, '_self');
}

/**
 *
 * @param {object} config Axios's config
 * @param {object} response network response from refreshing access token
 * @returns {object}
 */
const createConfigReplacingHeaderWithNewToken = (config, response) => {
  const data = response && response.data
  const { token_type: type, access_token: token } = data
  const c = { ...config }
  c.headers.Authorization = type && token && `${type} ${token}`

  return c
}

/* eslint-disable no-console */

/**
 * set a timer to request users to re-authenticate
 * after the access token expires + interval
 *
 * @param {function} reauthenticate the action to re-authenticate
 */
export const setTimeoutForReAuth = reauthenticate => {
  if (!isBundled) console.log('set timeout for re-authentication')

  const jstData = getJWTDataFromLocal()

  if (!jstData) return undefined

  const validPeriod = jstData.exp - new Date() / 1000
  const intervalToRefreshToken = 0 // give some time to refresh the access token

  return setTimeout(() => {
    reauthenticate()
  }, (validPeriod + intervalToRefreshToken) * 1000)
}

/**
 *
 * register an interceptor to refresh the access token when expired
 * case 1: access token is expired
 *  -> get new access token using the refresh token and try making the network again
 * case 2: both access and refresh tokens are expired
 *  -> request users to re signin by popping up SignInModal
 *
 * @param {function} resetTimeoutForReAuth the action to reset a timeout for reauthentication
 * @param {function} reauthenticate the action to re-authenticate
 * @param {function} storeAuthData the action to store the user in Redux
 * @returns {object} the network response config
 */
export const registerAxiosInterceptors = (
  resetTimeoutForReAuth,
  reauthenticate,
  storeAuthData
) => {
  axios.interceptors.request.use(config => {
    const isFirstTimeTry = !config.isRetry

    if (isTokenExpired() && isFirstTimeTry && isRangeAPI(config)) {
      if (!isBundled)
        console.log('Access token is expired. Trying to refresh it')

      const refreshToken = getRefreshTokenFromLocal()

      return refreshAccessToken(refreshToken).then(
        response => {
          if (!isBundled) console.log('Access token has been refreshed!')

          const authData = saveAuthDataInLocal(response)
          storeAuthData(authData)
          resetTimeoutForReAuth(reauthenticate)

          const c = createConfigReplacingHeaderWithNewToken(config, response)
          c.isRetry = true

          return c
        },
        err => {
          if (!isBundled) {
            console.log(
              'Refresh token is also expired. Request to re-authenticate.'
            )
            console.error(err)
          }
          reauthenticate()

          return config
        }
      )
    }

    return config
  })
}
