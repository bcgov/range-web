//
// MyRA
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

import jwtDecode from 'jwt-decode';
import axios from './axios';
import {
  SSO_BASE_URL,
  SSO_LOGIN_REDIRECT_URI,
  SSO_CLIENT_ID,
  GET_TOKEN_FROM_SSO,
  REFRESH_TOKEN_FROM_SSO,
} from '../constants/API';
import { saveDataInLocalStorage, getDataFromLocalStorage } from './localStorage';
import { stringifyQuery } from './queryString';
import { LOCAL_STORAGE_KEY } from '../constants/variables';

/**
 * this method is called immediately at the very beginning in the auth reducer
 * to initialize 'user' object in App.jsx. It checks whether
 * the user signs in previously by looking at localStorage and
 * it returns either null or an object retrieved from localStorage
 */
export const getAuthAndUserFromLocal = () => {
  const user = getDataFromLocalStorage(LOCAL_STORAGE_KEY.USER);
  const authData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);
  return { authData, user };
};

export const saveAuthDataInLocal = (response) => {
  const data = { ...response.data };
  data.jwtData = jwtDecode(data.access_token);

  saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH, data);
};

export const saveUserProfileInLocal = (newUser) => {
  saveDataInLocalStorage(LOCAL_STORAGE_KEY.USER, newUser);
};

export const getTokenFromSSO = (code) => {
  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };
  // make an application/x-www-form-urlencoded request with axios
  return axios({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: GET_TOKEN_FROM_SSO,
    data: stringifyQuery(data),
  });
};

export const refreshAccessToken = (refreshToken, isRetry) => {
  const data = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };

  // make an application/x-www-form-urlencoded request with axios
  // pass isRetry in config so that it only tries to refresh once.
  return axios({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: REFRESH_TOKEN_FROM_SSO,
    data: stringifyQuery(data),
    isRetry,
  });
};

// const getRefreshTokenFromLocal = () => {
//   const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);
//   return data && data.refresh_token;
// };

// const getJWTDataFromLocal = () => {
//   const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);
//   return data && data.jwtData;
// };

// const isTokenExpired = () => {
//   const jstData = getJWTDataFromLocal();
//   if (jstData) {
//     return (new Date() / 1000) > jstData.exp;
//   }
//   return false;
// };

// const setAxiosAuthHeader = (data) => {
//   const tokenType = data && data.token_type;
//   const accessToken = data && data.access_token;
//   axios.defaults.headers.common.Authorization = tokenType && accessToken && `${tokenType} ${accessToken}`;
// };

/**
 *
 * @param {object} response
 * set auth header in Axios and store auth data in localstorage
 * after succesfully authenticate
 */
// export const onAuthenticated = (response) => {
//   if (response && response.data) {
//     const { data } = response;
    // data.jwtData = jwtDecode(data.access_token);

//     saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH, data);
//     setAxiosAuthHeader(data);
//   }
// };


// const isRangeAPIs = (config) => {
//   if (config && config.baseURL) {
//     return config.baseURL !== SSO_BASE_URL;
//   }
//   return true;
// };

/**
 *
 * register an interceptor to refresh the access token when expired
 * case 1: access token is expired
 *  -> get new access token using the refresh token and try making the network again
 * case 2: both access and refresh tokens are expired
 *  -> sign out the user
 * @param {function} logout the logout action
 *
 */
// export const registerAxiosInterceptors = (logout) => {
//   axios.interceptors.request.use((c) => {
//     const config = { ...c };
//     const makeRequest = async () => {
//       try {
//         if (isTokenExpired() && !config.isRetry && isRangeAPIs()) {
//           if (process.env.NODE_ENV !== 'production') console.log('Access token is expired. Trying to refresh it');
//           config.isRetry = true;
//           const refreshToken = getRefreshTokenFromLocal();
//           const response = await refreshAccessToken(refreshToken, config.isRetry);
//           onAuthenticated(response);

//           const data = response && response.data;
//           const tokenType = data && data.token_type;
//           const accessToken = data && data.access_token;
//           config.headers.Authorization = tokenType && accessToken && `${tokenType} ${accessToken}`;
//         }
//         return config;
//       } catch (err) {
//         logout();
//         if (process.env.NODE_ENV !== 'production') console.log('Refresh token is also expired. Signing out.');
//         throw err;
//       }
//     };
//     // return config;
//     return makeRequest();
//   });
// };
