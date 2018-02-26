import axios from 'axios';
import querystring from 'querystring';
import jwtDecode from 'jwt-decode';

// import { toastErrorMessage } from './toastActions.jsx';

import { AUTH } from '../constants/reducerTypes';
import {
  SSO_BASE_URL, 
  SSO_REDIRECT_URI,
  SSO_CLIENT_ID,
  GET_TOKEN,
  REFRESH_TOKEN,
} from '../constants/api';
import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  USER_PROFILE_CHANGE
} from '../constants/actionTypes';

import Auth from '../handlers/auth';
// import Handlers from '../handlers';

export const loginSuccess = (data, user) => {
  return {
    name: AUTH,
    type: LOGIN_SUCCESS,
    data,
    user
  }
}

export const loginRequest = () => {
  return {
    name: AUTH,
    type: LOGIN_REQUEST,
  }
}

export const loginError = (errorMessage) => {
  return {
    name: AUTH,
    type: LOGIN_ERROR,
    errorMessage
  }
}

export const logoutSuccess = () => {
  return {
    name: AUTH,
    type: LOGOUT_SUCCESS
  }
}

export const userProfileChange = (user) => {
  return {
    name: AUTH,
    type: USER_PROFILE_CHANGE,
    user
  }
}

const getToken = (code) => {
  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: SSO_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };
  // make an application/x-www-form-urlencoded request with axios
  return axios.post(SSO_BASE_URL + GET_TOKEN, querystring.stringify(data));
}

const refreshToken = (refresh_token) => {
  const data = {
    refresh_token,
    grant_type: 'refresh_token',
    redirect_uri: SSO_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };

  // make an application/x-www-form-urlencoded request with axios
  return axios.post(SSO_BASE_URL + REFRESH_TOKEN, querystring.stringify(data));
}

export const login = (code) => (dispatch) => {
  dispatch(loginRequest());

  getToken(code)
  .then(response => {
    console.log(response)
    response.data.user_data = jwtDecode(response.data.access_token);
    
    // save tokens in local storage and set header for axios 
    Auth.onSignedIn(response);

    // TODO: make a request to get user data
    dispatch(loginSuccess(response.data, response.data.user_data));
  }).catch(err => {
    dispatch(loginError(err));
    // dispatch(toastErrorMessage(err));
    console.log(err);
  });
}

export const logout = () => (dispatch) => {
  Auth.onSignedOut();
  dispatch(logoutSuccess());
}
