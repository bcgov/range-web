import { combineReducers } from 'redux';

import {
  LOGOUT_SUCCESS
} from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes';

import auth from './authReducer';
import toast from './toastReducer';
import genericReducer from './genericReducer';

const createReducer = (reducerFunction, reducerName) => {
  return (state, action) => {
    const { name } = action;
    const isInitializationCall = state === undefined;
    if (name !== reducerName && !isInitializationCall) return state;
    return reducerFunction(state, action);
  }
}

const appReducer = combineReducers({
  auth,
  toast,
  tenureAgreements: createReducer(genericReducer, ReducerTypes.TENURE_AGREEMENT),
});

const rootReducer = (state, action) => {
  // reset the state of a Redux store when users sign out
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;