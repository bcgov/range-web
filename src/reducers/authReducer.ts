import {
  STORE_SSO_AUTH_DATA,
  STORE_USER,
  SIGN_OUT,
  REAUTHENTICATE,
  SET_TIMEOUT_FOR_REAUTHENTICATION,
} from '../constants/actionTypes';
import { getAuthAndUserFromLocal } from '../utils';
import { User } from '../types';

export interface AuthData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  [key: string]: unknown;
}

export interface AuthState {
  authData: AuthData | undefined;
  user: User | undefined;
  reAuthRequired: boolean;
  timeoutIds: Record<string, ReturnType<typeof setTimeout>>;
}

interface AuthAction {
  type: string;
  data?: AuthData;
  user?: User;
  timeoutIds?: Record<string, ReturnType<typeof setTimeout>>;
}

const { user, authData } = (getAuthAndUserFromLocal ? getAuthAndUserFromLocal() : {}) as { user?: User; authData?: AuthData };
const initialState: AuthState = {
  authData,
  user,
  reAuthRequired: false,
  timeoutIds: {},
};

const authReducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
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
        timeoutIds: {},
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
        timeoutIds: action.timeoutIds ?? {},
      };
    default:
      return state;
  }
};

// Private selectors
export const getAuthData = (state: AuthState): AuthData | undefined => state.authData;
export const getToken = (state: AuthState): string | undefined =>
  state.authData?.access_token;
export const getUser = (state: AuthState): User | undefined => state.user;
export const getReAuthRequired = (state: AuthState): boolean => state.reAuthRequired;
export const getAuthTimeout = (state: AuthState): Record<string, ReturnType<typeof setTimeout>> =>
  state.timeoutIds;

export default authReducer;
