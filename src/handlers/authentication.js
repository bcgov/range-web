import axios from '../handlers/axios';
import querystring from 'querystring';
import jwtDecode from 'jwt-decode';

import {
  SSO_BASE_URL, 
  REFRESH_TOKEN,
  SSO_REDIRECT_URI,
  SSO_CLIENT_ID,
  GET_TOKEN,
} from '../constants/api';

import {
  AUTH_KEY,
} from '../constants/strings';

const getRefreshTokenFromLocal = () => {
  const data = getDataFromLocal();
  return data.refresh_token;
};

const refreshAccessToken = (refresh_token, _retry) => {
  const data = {
    refresh_token,
    grant_type: 'refresh_token',
    redirect_uri: SSO_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };

  // make an application/x-www-form-urlencoded request with axios
  // pass _retry in config so that it only tries to refresh once.
  return axios({
    method: 'post',
    url: SSO_BASE_URL + REFRESH_TOKEN,
    data: querystring.stringify(data),
    _retry,
  });
};

const getDataFromLocal = () => {
  return JSON.parse(localStorage.getItem(AUTH_KEY));
};

const saveDataInLocal = (data) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

const getAuthDataFromLocal = () => {
  const data = getDataFromLocal();
  return data.auth_data;
};

const setAxiosAuthHeader = (data) => {
  axios.defaults.headers.common['Authorization'] = `${data.token_type} ${data.access_token}`;
};

const isTokenExpired = () => {
  const authData = getAuthDataFromLocal();
  return (new Date() / 1000) > authData.exp;
};

const isRefreshTokenExpired = () => {
  const data = getDataFromLocal();
  const authData = getAuthDataFromLocal();
  return (new Date() / 1000) > authData.auth_time + data.refresh_expires_in;
};

export const getTokenFromRemote = (code) => {
  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: SSO_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };
  // make an application/x-www-form-urlencoded request with axios
  return axios.post(SSO_BASE_URL + GET_TOKEN, querystring.stringify(data));
};

/**
 * this method is called immediately at the very beginning in the auth reducer
 * to initialize 'user' object in App.jsx. It checks whether
 * the user signs in previously by looking at localStorage and 
 * it returns either null or an object retrieved from localStorage 
 */
export const initializeUser = () => {
  let user = null;
  
  const data = getDataFromLocal();
  if(data) {
    setAxiosAuthHeader(data);
    user = {...data.auth_data};
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
  if(response && response.data) {
    const data = response.data;
    data.auth_data = jwtDecode(response.data.access_token);

    saveDataInLocal(data);
    setAxiosAuthHeader(data);
  }
};

/**
 * delete auth header in axios and clear localStorage after signing out
 */
export const onSignedOut = () => {
  delete axios.defaults.headers.common['Authorization']
  localStorage.clear();
};

/**
 * 
 * @param {object} newUserData 
 * update the new user data in localStorage 
 * after succesfully update user profile 
 */
// export const onUserProfileChanged = (newUserData) => {
//   const data = getDataFromLocal();
//   if(data) {
//     data.auth_data = { ...newUserData };
//     saveDataInLocal(data);
//   }
// };

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
  axios.interceptors.request.use(config => {
    if(isRefreshTokenExpired()) {
      logout();
      return config;
    }

    if(isTokenExpired() && !config._retry) {
      config._retry = true;
      const token = getRefreshTokenFromLocal();
      const makeRequest = async () => {
        try {
          const response = await refreshAccessToken(token, config._retry);
          onAuthenticated(response);
          config.headers.Authorization = `${response.token_type} ${response.access_token}`;
          
          return config;
        } catch (err) {
          // the refresh token is also expired therefore sign out the user
          logout();
          return err;
        }
      }
      makeRequest();
    }

    return config;
  });
};