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
  REQUEST,
  SUCCESS,
  SUCCESS_PAGINATED,
  ERROR,
  DATA_CHANGED,
} from '../constants/actionTypes';

const genericRequest = (state, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        isLoading: true,
        success: false,
      };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        data: action.data,
      };
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isLoading: false,
        success: true,
        data: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
      };
    case DATA_CHANGED:
      return {
        ...state,
        data: action.data,
      };
    case ERROR:
      return {
        ...state,
        isLoading: false,
        success: false,
        error: action.error,
      };
    default: return state;
  }
};

export default genericRequest;
