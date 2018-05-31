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
  SUCCESS,
  REQUEST,
  SUCCESS_PAGINATED,
  ERROR,
  DATA_CHANGED,
} from '../constants/actionTypes';

export const success = (reducer, data) => (
  {
    name: reducer,
    type: SUCCESS,
    data,
  }
);

export const request = reducer => (
  {
    name: reducer,
    type: REQUEST,
  }
);

export const successPaginated = (reducer, data, currentPage, totalPages) => (
  {
    name: reducer,
    type: SUCCESS_PAGINATED,
    data,
    currentPage,
    totalPages,
  }
);

export const error = (reducer, error) => (
  {
    name: reducer,
    type: ERROR,
    error,
  }
);

export const dataChanged = (reducer, data) => (
  {
    name: reducer,
    type: DATA_CHANGED,
    data,
  }
);