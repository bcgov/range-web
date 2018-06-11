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

import { combineReducers } from 'redux';
import { LOGOUT_SUCCESS } from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes';
import { getReferencesFromLocal } from '../handlers';
import auth from './authReducer';
import toast from './toastReducer';
import genericReducer from './genericReducer';

const createReducer = (reducerFunction, reducerName, initialState) => {
  const genericInitialState = {
    isLoading: false,
    data: null,
    length: -1,
    success: false,
    errorMessage: '',
  };

  return (state = { ...genericInitialState, ...initialState }, action) => {
    const { name } = action;
    const isInitializationCall = state === undefined;
    if (name !== reducerName && !isInitializationCall) return state;
    return reducerFunction(state, action);
  };
};

const appReducer = combineReducers({
  auth,
  toast,
  agreements: createReducer(genericReducer, ReducerTypes.AGREEMENTS, { data: [], totalPages: 1, currentPage: 1 }),
  rangeUsePlan: createReducer(genericReducer, ReducerTypes.RANGE_USE_PLAN, { data: {} }),
  references: createReducer(genericReducer, ReducerTypes.GET_REFERENCES, { data: getReferencesFromLocal() }),
  updateRupStatus: createReducer(genericReducer, ReducerTypes.UPDATE_RUP_STATUS, { data: {} }),
  createRupSchedule: createReducer(genericReducer, ReducerTypes.CREATE_RUP_SCHEDULE, { data: {} }),
  updateRupSchedule: createReducer(genericReducer, ReducerTypes.UPDATE_RUP_SCHEDULE, { data: {} }),
  updateRupZone: createReducer(genericReducer, ReducerTypes.UPDATE_RUP_ZONE, { data: {} }),
  zones: createReducer(genericReducer, ReducerTypes.GET_ZONES, { data: [] }),
  pdf: createReducer(genericReducer, ReducerTypes.GET_PDF, { }),
  users: createReducer(genericReducer, ReducerTypes.GET_USERS, { data: [] }),
  assignStaffToZone: createReducer(genericReducer, ReducerTypes.ASSIGN_STAFF_TO_ZONE, { }),
  userProfile: createReducer(genericReducer, ReducerTypes.GET_USER_PROFILE, { data: {} }),
  deleteRupSchedule: createReducer(genericReducer, ReducerTypes.DELETE_SCHEUDLE, { data: {} }),
  deleteRupScheduleEntry: createReducer(genericReducer, ReducerTypes.DELETE_SCHEUDLE_ENTRY, { data: {} }),
  clients: createReducer(genericReducer, ReducerTypes.GET_CLIENTS, { data: [] }),
});

const rootReducer = (state, action) => {
  // reset the state of a Redux store when users sign out
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
