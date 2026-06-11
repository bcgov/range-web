import * as actionTypes from '../constants/actionTypes';

export const storeAuthData = (data: unknown) => ({
  type: actionTypes.STORE_SSO_AUTH_DATA,
  data,
});

export const storeUser = (user: unknown) => ({
  type: actionTypes.STORE_USER,
  user,
});

export const removeAuthDataAndUser = () => ({
  type: actionTypes.SIGN_OUT,
});

export const reauthenticate = () => ({
  type: actionTypes.REAUTHENTICATE,
});

export const setTimeoutForAuthentication = (timeoutIds: Record<string, ReturnType<typeof setTimeout>>) => ({
  type: actionTypes.SET_TIMEOUT_FOR_REAUTHENTICATION,
  timeoutIds,
});
