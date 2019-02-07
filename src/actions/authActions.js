import * as actionTypes from '../constants/actionTypes';

export const storeAuthData = data => (
  {
    type: actionTypes.STORE_SSO_AUTH_DATA,
    data,
  }
);

export const storeUser = user => (
  {
    type: actionTypes.STORE_USER,
    user,
  }
);

export const removeAuthDataAndUser = () => (
  {
    type: actionTypes.SIGN_OUT,
  }
);

export const reauthenticate = () => (
  {
    type: actionTypes.REAUTHENTICATE,
  }
);

export const setTimeoutForAuthentication = timeoutId => (
  {
    type: actionTypes.SET_TIMEOUT_FOR_REAUTHENTICATION,
    timeoutId,
  }
);
