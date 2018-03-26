import { combineReducers } from 'redux';

import {
  LOGOUT_SUCCESS
} from '../constants/actionTypes';
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
  }
};

const appReducer = combineReducers({
  auth,
  toast,
  tenureAgreements: createReducer(genericReducer, ReducerTypes.TENURE_AGREEMENTS, { data: [] }),
  rangeUsePlan: createReducer(genericReducer, ReducerTypes.RANGE_USE_PLAN, { data: {} }),
  references: createReducer(genericReducer, ReducerTypes.GET_REFERENCES, { data: getReferencesFromLocal() }),
  updateRupStatus: createReducer(genericReducer, ReducerTypes.UPDATE_RUP_STATUS, { data: {} }),
  updateRupZone: createReducer(genericReducer, ReducerTypes.UPDATE_RUP_ZONE, { data: {} }),
  zones: createReducer(genericReducer, ReducerTypes.GET_ZONES, { data: [] }),
});

const rootReducer = (state, action) => {
  // reset the state of a Redux store when users sign out
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined
  }

  return appReducer(state, action)
};

export default rootReducer;