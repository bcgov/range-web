import { STORE_SSO_AUTH_DATA, STORE_USER, SIGN_OUT } from '../constants/actionTypes';
import { getAuthAndUserFromLocal } from '../utils';

const { user, authData } = getAuthAndUserFromLocal ? getAuthAndUserFromLocal() : {};
const initialState = {
  authData,
  user,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_SSO_AUTH_DATA:
      return {
        ...state,
        authData: action.data,
      };
    case STORE_USER:
      return {
        ...state,
        user: action.user,
      };
    case SIGN_OUT:
      return {
        ...state,
        authData: undefined,
        user: undefined,
      };
    default:
      return state;
  }
};

// Private selectors being name exported
export const getAuthData = state => state.authData;
export const getToken = state => state.authData && state.authData.access_token;
export const getUser = state => state.user;
export default authReducer;
