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

export const signOut = () => (
  {
    type: actionTypes.SIGN_OUT,
  }
);
