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
import {
  LOGOUT_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  USER_PROFILE_CHANGE,
} from '../constants/actionTypes';

import { initializeUser } from '../handlers/authentication';

const authReducer = (state = {
  isLoading: false,
  user: initializeUser(),
  success: false,
}, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        success: false,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        data: action.data,
        user: action.user,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        success: false,
        error: action.error,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        user: null,
      };
    case USER_PROFILE_CHANGE:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default authReducer;
