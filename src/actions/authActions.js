import { toastErrorMessage } from './toastActions';
import { AUTH } from '../constants/reducerTypes';
import {
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  USER_PROFILE_CHANGE,
} from '../constants/actionTypes';
import {
  getTokenFromRemote,
  onAuthenticated,
  onSignedOut,
  onUserProfileChanged,
  getUserProfileFromRemote,
} from '../handlers/authentication';

export const loginSuccess = data => (
  {
    name: AUTH,
    type: LOGIN_SUCCESS,
    data,
    user: data,
  }
);

export const loginRequest = () => (
  {
    name: AUTH,
    type: LOGIN_REQUEST,
  }
);

export const loginError = errorMessage => (
  {
    name: AUTH,
    type: LOGIN_ERROR,
    errorMessage,
  }
);

export const logoutSuccess = () => (
  {
    name: AUTH,
    type: LOGOUT_SUCCESS,
  }
);

export const userProfileChange = user => (
  {
    name: AUTH,
    type: USER_PROFILE_CHANGE,
    user,
  }
);

export const login = code => (dispatch) => {
  dispatch(loginRequest());
  const makeRequest = async () => {
    try {
      const response1 = await getTokenFromRemote(code);

      // save tokens in local storage and set header for axios
      onAuthenticated(response1);

      const response2 = await getUserProfileFromRemote();
      const user = response2.data;
      if (user && user.id) {
        if (user.active) {
          onUserProfileChanged(user);
          dispatch(loginSuccess(user));
        } else {
          throw new Error('The user is not active');
        }
      } else {
        throw new Error('The user doesn\'t exist in the server');
      }
    } catch (err) {
      dispatch(loginError(err));
      dispatch(toastErrorMessage(err));
    }
  };
  makeRequest();
};

export const logout = () => (dispatch) => {
  onSignedOut();
  dispatch(logoutSuccess());
};
