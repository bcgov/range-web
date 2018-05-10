import querystring from 'querystring';
import jwtDecode from 'jwt-decode';
import axios from '../handlers/axios';

import {
  SSO_BASE_URL,
  SSO_LOGIN_REDIRECT_URI,
  SSO_CLIENT_ID,
  GET_TOKEN,
  REFRESH_TOKEN,
  USER,
  ME,
} from '../constants/api';
import { saveDataInLocal, getDataFromLocal } from '../handlers';
import { AUTH_KEY, USER_KEY } from '../constants/variables';

const getRefreshTokenFromLocal = () => {
  const data = getDataFromLocal(AUTH_KEY);
  return data && data.refresh_token;
};

const getJWTDataFromLocal = () => {
  const data = getDataFromLocal(AUTH_KEY);
  return data && data.jwtData;
};

const isTokenExpired = () => {
  const jstData = getJWTDataFromLocal();
  if (jstData) {
    return (new Date() / 1000) > jstData.exp;
  }
  return false;
};

const refreshAccessToken = (refreshToken, isRetry) => {
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
    url: REFRESH_TOKEN,
    data: querystring.stringify(data),
    isRetry,
  });
};

export const getTokenFromRemote = (code) => {
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
    url: GET_TOKEN,
    data: querystring.stringify(data),
  });
};

const setAxiosAuthHeader = (data) => {
  const tokenType = data && data.token_type;
  const accessToken = data && data.access_token;
  axios.defaults.headers.common.Authorization = tokenType && accessToken && `${tokenType} ${accessToken}`;
};

/**
 * this method is called immediately at the very beginning in the auth reducer
 * to initialize 'user' object in App.jsx. It checks whether
 * the user signs in previously by looking at localStorage and
 * it returns either null or an object retrieved from localStorage
 */
export const initializeUser = () => {
  let user = null;

  const userData = getDataFromLocal(USER_KEY);
  if (userData) {
    user = { ...userData };
  }
  const authData = getDataFromLocal(AUTH_KEY);
  if (authData) {
    setAxiosAuthHeader(authData);
  }
  return user;
};

/**
 *
 * @param {object} response
 * set auth header in Axios and store auth data in localstorage
 * after succesfully authenticate
 */
export const onAuthenticated = (response) => {
  if (response && response.data) {
    const { data } = response;
    data.jwtData = jwtDecode(data.access_token);

    saveDataInLocal(AUTH_KEY, data);
    setAxiosAuthHeader(data);
  }
};

/**
 * delete auth header in axios and clear localStorage after signing out
 */
export const onSignedOut = () => {
  delete axios.defaults.headers.common.Authorization;
  localStorage.clear();
};

export const getUserProfileFromRemote = () => (
  axios.get(`${USER}${ME}`)
);

/**
 *
 * @param {object} newUserData
 * update the new user data in localStorage
 * after succesfully update user profile
 */
export const onUserProfileChanged = (newUserData) => {
  saveDataInLocal(USER_KEY, newUserData);
};

const isRangeAPIs = (config) => {
  if (config && config.baseURL) {
    return config.baseURL !== SSO_BASE_URL;
  }
  return true;
};

/**
 *
 * @param {function} logout
 * register an interceptor to refresh the access token when expired
 * case 1: access token is expired
 *  - get new access token using the refresh token and try it again
 * case 2: both tokens are expired
 *  - sign out the user
 */
export const registerAxiosInterceptors = (logout) => {
  axios.interceptors.request.use((c) => {
    const config = { ...c };
    const makeRequest = async () => {
      try {
        if (isTokenExpired() && !config.isRetry && isRangeAPIs()) {
          console.log('Access token is expired. Trying to refresh the token');
          config.isRetry = true;
          const refreshToken = getRefreshTokenFromLocal();
          const response = await refreshAccessToken(refreshToken, config.isRetry);
          onAuthenticated(response);

          const data = response && response.data;
          const tokenType = data && data.token_type;
          const accessToken = data && data.access_token;
          config.headers.Authorization = tokenType && accessToken && `${tokenType} ${accessToken}`;
        }
        return config;
      } catch (err) {
        logout();
        throw err;
      }
    };
    // return config;
    return makeRequest();
  });
};
