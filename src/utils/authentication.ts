//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwtDecode: (token: string) => any = require('jwt-decode');
import axios from './axios';
import {
  SSO_BASE_URL,
  SSO_LOGIN_REDIRECT_URI,
  SSO_CLIENT_ID,
  GET_TOKEN_FROM_SSO,
  REFRESH_TOKEN_FROM_SSO,
  API_BASE_URL,
  SITEMINDER_LOGOUT_ENDPOINT,
} from '../constants/api';
import { saveDataInLocalStorage, getDataFromLocalStorage } from './localStorage';
import { stringifyQuery } from './index';
import {
  LOCAL_STORAGE_KEY,
  SESSION_EXPIRY_WARNING_DURATION,
  SESSION_EXPIRY_WARNING_TOAST_ID,
  isBundled,
} from '../constants/variables';
import { removeToast } from '../actions';
import { toastSessionExpiry } from '../actionCreators';

interface AuthData {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  session_state: string;
  token_type: string;
  jwtData?: any;
  [key: string]: any;
}

interface JWTData {
  exp: number;
  [key: string]: any;
}

interface AxiosConfig {
  baseURL?: string;
  headers?: { Authorization?: string; [key: string]: any };
  isRetry?: boolean;
  skipAuthorizationHeader?: boolean;
  [key: string]: any;
}

export const getAuthHeaderConfig = (): { headers?: { Authorization: string; 'content-type': string } } => {
  const { authData } = getAuthAndUserFromLocal();

  if (authData) {
    return {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
        'content-type': 'application/json',
      },
    };
  }
  return {};
};

/**
 * this method is called immediately at the very beginning in authReducer
 * to initialize the auth and user objects in Router.js
 * @returns the object that contains authData and user
 */
export const getAuthAndUserFromLocal = (): { authData: AuthData | null; user: any } => {
  const user = getDataFromLocalStorage(LOCAL_STORAGE_KEY.USER) as any;
  const authData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH) as AuthData | null;
  return { authData, user };
};

/**
 *
 * @param response the network response
 * the response looks like this
 {
    access_token: "characters"
    expires_in: 1800
    not-before-policy: 0
    refresh_expires_in: 3600
    refresh_token: "characters"
    session_state: "characters-characters-characters"
    token_type: "bearer"
  }
 */
export const saveAuthDataInLocal = (response: any): AuthData => {
  const data = { ...response.data };
  data.jwtData = jwtDecode(data.access_token);

  saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH, data);

  return data;
};

/**
 *
 * @param newUser the new user object
 */
export const saveUserProfileInLocal = (newUser: any): void => {
  saveDataInLocalStorage(LOCAL_STORAGE_KEY.USER, newUser);
};

/**
 *
 * @param code the code received from Single Sign On
 */
export const getTokenFromSSO = (code: string): Promise<any> => {
  const storedCodes = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE) as any;
  if (!storedCodes || !storedCodes.codeVerifier) {
    console.error('Cannot proceed without PKCE challenge code. Restart authentication');
  }

  const data = {
    code,
    grant_type: 'authorization_code',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
    code_verifier: storedCodes.codeVerifier,
  };

  // make an application/x-www-form-urlencoded request with axios
  return (axios as any)({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: GET_TOKEN_FROM_SSO,
    data: stringifyQuery(data),
  });
};

/**
 *
 * @param refreshToken the refreshToken saved in localStorage
 */
export const refreshAccessToken = (refreshToken: string): Promise<any> => {
  const data = {
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: SSO_LOGIN_REDIRECT_URI,
    client_id: SSO_CLIENT_ID,
  };

  // make an application/x-www-form-urlencoded request with axios
  // pass isRetry in config so that it only tries to refresh once.
  return (axios as any)({
    method: 'post',
    baseURL: SSO_BASE_URL,
    url: REFRESH_TOKEN_FROM_SSO,
    data: stringifyQuery(data),
    isRetry: true,
  });
};

/**
 * @returns the refresh token
 */
const getRefreshTokenFromLocal = (): string | null => {
  const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH) as any;
  return data && data.refresh_token;
};

/**
 * @returns the parsed data from Json Web Token
 */
const getJWTDataFromLocal = (): JWTData | null => {
  const data = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH) as any;
  return data && data.jwtData;
};

/**
 *
 * @returns whether the token is expired
 */
export const isTokenExpired = (): boolean => {
  const GRACE = 90 * 1000;

  const jstData = getJWTDataFromLocal();

  if (jstData) {
    return new Date().getTime() / 1000 > jstData.exp - GRACE;
  }
  return false;
};

/**
 *
 * @param config Axios's config
 * @returns whether the request is to the Range API
 */
const isRangeAPI = (config: AxiosConfig): boolean => {
  if (config && config.baseURL) {
    return config.baseURL === API_BASE_URL;
  }

  return false;
};

export const signOutFromSSOAndSiteMinder = async (): Promise<void> => {
  window.open(SITEMINDER_LOGOUT_ENDPOINT, '_self');
};

/**
 *
 * @param config Axios's config
 * @param response network response from refreshing access token
 * @returns the updated config with the new token
 */
const createConfigReplacingHeaderWithNewToken = (config: AxiosConfig, response: any): AxiosConfig => {
  const data = response && response.data;
  const { token_type: type, access_token: token } = data;
  const c = { ...config };
  if (c.headers) {
    c.headers.Authorization = type && token && `${type} ${token}`;
  }

  return c;
};

/* eslint-disable no-console */

/**
 * set a timer to request users to re-authenticate
 * after the access token expires + interval
 *
 * @param reauthenticate the action to re-authenticate
 * @param dispatch the Redux dispatch function
 */
export const setTimeoutForReAuth = (
  reauthenticate: () => void,
  dispatch: any,
):
  | { authTimeoutId: ReturnType<typeof setTimeout>; warningTimeoutId: ReturnType<typeof setTimeout> | null }
  | undefined => {
  if (!isBundled) console.log('set timeout for re-authentication');

  const jstData = getJWTDataFromLocal();

  if (!jstData) return undefined;

  const refreshTokenData = getRefreshTokenFromLocal();
  let refreshTokenValidPeriod = 0;

  const GRACE = 10 * 1000;

  try {
    const payload = (refreshTokenData as string).split('.')[1];

    const parsedRefreshToken = JSON.parse(atob(payload));
    refreshTokenValidPeriod = parsedRefreshToken.exp - (new Date() as any) / 1000;
  } catch {
    if (!isBundled) console.log('Error parsing refresh token, ignoring it.');
  }

  const accessTokenValidPeriod = jstData.exp - (new Date() as any) / 1000;
  const latestTime = Math.max(accessTokenValidPeriod, refreshTokenValidPeriod) * 1000;
  const waitTime = Math.max(latestTime - GRACE, 0);
  const warningTime = Math.max(waitTime - SESSION_EXPIRY_WARNING_DURATION * 1000, 0);
  let warningTimeoutId: ReturnType<typeof setTimeout> | null = null;
  dispatch(removeToast({ toastId: SESSION_EXPIRY_WARNING_TOAST_ID }));
  if (waitTime > 0) {
    warningTimeoutId = setTimeout(() => {
      dispatch(toastSessionExpiry());
    }, warningTime);
  }

  const authTimeoutId = setTimeout(() => {
    reauthenticate();
  }, waitTime);

  return {
    authTimeoutId,
    warningTimeoutId,
  };
};

/**
 *
 * register an interceptor to refresh the access token when expired
 * case 1: access token is expired
 *  -> get new access token using the refresh token and try making the network again
 * case 2: both access and refresh tokens are expired
 *  -> request users to re signin by popping up SignInModal
 *
 * @param resetTimeoutForReAuthFn the action to reset a timeout for reauthentication
 * @param reauthenticate the action to re-authenticate
 * @param storeAuthDataFn the action to store the user in Redux
 */
export const registerAxiosInterceptors = (
  resetTimeoutForReAuthFn: (reauthenticate: () => void) => void,
  reauthenticate: () => void,
  storeAuthDataFn: (authData: AuthData) => void,
): void => {
  (axios as any).interceptors.request.use((config: AxiosConfig) => {
    const isFirstTimeTry = !config.isRetry;
    const notExplicitlySkipped = !config.skipAuthorizationHeader;

    if (isTokenExpired() && isFirstTimeTry && isRangeAPI(config) && notExplicitlySkipped) {
      if (!isBundled) console.debug('Access token is expired. Trying to refresh it');

      const refreshToken = getRefreshTokenFromLocal();

      return refreshAccessToken(refreshToken as string).then(
        (response: any) => {
          if (!isBundled) console.debug('Access token has been refreshed!');

          const authData = saveAuthDataInLocal(response);
          storeAuthDataFn(authData);
          resetTimeoutForReAuthFn(reauthenticate);

          const c = createConfigReplacingHeaderWithNewToken(config, response);
          (c as any).isRetry = true;

          return c;
        },
        (err: any) => {
          if (!isBundled) {
            console.log('Refresh token is also expired. Request to re-authenticate.');
            console.error(err);
          }
          reauthenticate();

          return config;
        },
      );
    }
    return config;
  });
};
