//
// MyRA
//
// Copyright © 2018 Province of British Columbia
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
import { USER_NOT_ACTIVE, USER_NOT_REGISTERED } from '../constants/strings';
import CustomError from '../models/CustomError';

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

export const loginError = error => (
  {
    name: AUTH,
    type: LOGIN_ERROR,
    error,
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
          throw new CustomError(USER_NOT_ACTIVE);
        }
      } else {
        throw new CustomError(USER_NOT_REGISTERED);
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
