import { combineReducers } from 'redux';

import {
  LOGOUT_SUCCESS
} from '../constants/actionTypes';
// import * as ReducerTypes from '../constants/reducerTypes';

import authReducer from './authReducer';
import toastReducer from './toastReducer';
import rangeUsePlanReducer from './rangeUsePlanRedcuer';
// import genericReducer from './genericReducer';

// const createReducer = (reducerFunction, reducerName) => {
//   return (state, action) => {
//     const { name } = action;
//     const isInitializationCall = state === undefined;
//     if (name !== reducerName && !isInitializationCall) return state;
//     return reducerFunction(state, action);
//   }
// }

const appReducer = combineReducers({
  authReducer,
  toastReducer,
  rangeUsePlanReducer,
  // [ReducerTypes.FAQS]: createReducer(genericReducer, ReducerTypes.FAQS),
});

const rootReducer = (state, action) => {
  // reset the state of a Redux store when users sign out
  if (action.type === LOGOUT_SUCCESS) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer;