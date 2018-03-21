import { toastErrorMessage } from './toastActions';
import { AUTH } from '../constants/reducerTypes';
import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  USER_PROFILE_CHANGE
} from '../constants/actionTypes';
import {
  getTokenFromRemote,
  onAuthenticated,
  onSignedOut
} from '../handlers/authentication';

export const loginSuccess = (data) => {
  return {
    name: AUTH,
    type: LOGIN_SUCCESS,
    data,
    user: data.auth_data
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

export const login = (code) => (dispatch) => {
  dispatch(loginRequest());
  const makeRequest = async () => {
    try {
      const response = await getTokenFromRemote(code);
      
      // save tokens in local storage and set header for axios 
      onAuthenticated(response);
      console.log(response)

      // TODO: make a request to get user data
      dispatch(loginSuccess(response.data));  
    } catch (err) {
      dispatch(loginError(err));
      dispatch(toastErrorMessage(err));
    }
  }
  makeRequest();
}

export const logout = () => (dispatch) => {
  onSignedOut();
  dispatch(logoutSuccess());
}
