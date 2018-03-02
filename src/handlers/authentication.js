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

const label = 'auth-range-web';

const getRefreshTokenFromLocal = () => {
  const data = getDataFromLocal();
  return data.refresh_token;
};

const refreshAccessToken = (refresh_token) => {
  const data = {
    refresh_token,
    grant_type: 'refresh_token',
    redirect_uri: SSO_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };

  // make an application/x-www-form-urlencoded request with axios
  return axios.post(SSO_BASE_URL + REFRESH_TOKEN, querystring.stringify(data));
};

const getDataFromLocal = () => {
  return JSON.parse(localStorage.getItem(label));
};

const saveDataInLocal = (data) => {
  localStorage.setItem(label, JSON.stringify(data));
};

const getUserData = () => {
  const data = getDataFromLocal();
  return data.user_data;
};

const setAxiosAuthHeader = (data) => {
  axios.defaults.headers.common['Authorization'] = `${data.token_type} ${data.access_token}`;
};

const isTokenExpired = () => {
  const userData = getUserData();
  return (new Date() / 1000) > userData.exp;
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
    user = {...data.user_data};
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
    data.user_data = jwtDecode(response.data.access_token);

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
export const onUserProfileChanged = (newUserData) => {
  const data = getDataFromLocal();
  if(data) {
    data.user_data = { ...newUserData };
    saveDataInLocal(data);
  }
};

/**
 * 
 * @param {function} logout
 * register an interceptor to catch 401 unauthorized response 
 * case 1: access token is expired
 *  - get new access token using the refresh token and try it again
 * case 2: both tokens are expired
 *  - sign out the user
 */
export const registerAxiosInterceptors = (logout) => {
  axios.interceptors.request.use(config => {
    if(isTokenExpired()) {
      const token = getRefreshTokenFromLocal();
      return refreshAccessToken(token)
        .then(response => {
          onAuthenticated(response);
          config.headers.Authorization = `${response.token_type} ${response.access_token}`;
          return Promise.resolve(config);
        }).catch( err => {
          return Promise.reject(err);
        });
    }

    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    }, (error) => {
      const { response } = error;
      // Plan B for refreshing token
      // const originalRequest = error.config;
      // if (response && response.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;
      //   const token = getRefreshTokenFromLocal();

      //   return refreshAccessToken(token)
      //     .then(response => {
      //       // successfully get a new access token
      //       onAuthenticated(response);
      //       originalRequest.headers['Authorization'] = `${response.token_type} ${response.access_token}`;
      //       return axios(originalRequest);
      //     })
      //     .catch(err => {
      //       // refresh token is also expired
      //       logout();
      //       return Promise.reject(error.response)
      //     });
      // }
      if (response && response.status === 401) {
        logout();
      }
      return Promise.reject(response);
    }
  );
};