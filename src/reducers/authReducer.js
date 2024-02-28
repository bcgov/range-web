import {
  STORE_SSO_AUTH_DATA,
  STORE_USER,
  SIGN_OUT,
  REAUTHENTICATE,
  SET_TIMEOUT_FOR_REAUTHENTICATION,
} from '../constants/actionTypes';
import { getAuthAndUserFromLocal } from '../utils';

const { user, authData } = getAuthAndUserFromLocal
  ? getAuthAndUserFromLocal()
  : {};
const initialState = {
  authData,
  user,
  reAuthRequired: false,
  timeoutId: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_SSO_AUTH_DATA:
      return {
        ...state,
        authData: action.data,
        reAuthRequired: false,
      };
    case STORE_USER:
      return {
        ...state,
        user: action.user,
        reAuthRequired: false,
      };
    case SIGN_OUT:
      return {
        authData: undefined,
        user: undefined,
        reAuthRequired: false,
        timeoutId: null,
        unauthorizedErrorResponses: [],
      };
    case REAUTHENTICATE:
      return {
        ...state,
        reAuthRequired: true,
        authData: undefined,
      };
    case SET_TIMEOUT_FOR_REAUTHENTICATION:
      return {
        ...state,
        timeoutId: action.timeoutId,
      };
    default:
      return state;
  }
};

// Private selectors being name exported
export const getAuthData = (state) => state.authData;
export const getToken = (state) =>
  state.authData && state.authData.access_token;
export const getUser = (state) => state.user;
export const getReAuthRequired = (state) => state.reAuthRequired;
export const getAuthTimeout = (state) => state.timeout;

export default authReducer;
