// import axios from 'axios';
import { normalize } from 'normalizr';
import { axios, saveUserProfileInLocal, createRequestHeader } from '../utils';
import * as schema from './schema';
import * as api from '../api';
import {
  request, success, successPagenated, error,
  storeAgreement, storePlan, storeUser, removeAuthDataAndUser,
} from '../actions';
import { getAgreementsIsFetching, getToken } from '../reducers/rootReducer';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';

export const signOut = () => (dispatch) => {
  // clear the local storage in the browser
  localStorage.clear();
  dispatch(removeAuthDataAndUser());
};

export const getUserProfile = () => (dispatch, getState) => {
  const token = getToken(getState());
  return axios.get(API.GET_USER_PROFILE_ENDPOINT, createRequestHeader(token)).then(
    (response) => {
      const user = response.data;
      dispatch(storeUser(user));
      saveUserProfileInLocal(user);
    },
    (err) => {
      throw err;
    },
  );
};

export const searchAgreements = filter => (dispatch, getState) => {
  if (getAgreementsIsFetching(getState(), filter)) {
    return Promise.resolve();
  }
  dispatch(request(reducerTypes.SEARCH_AGREEMENTS));

  return api.fetchAgreements(filter).then(
    (response) => {
      dispatch(successPagenated(reducerTypes.SEARCH_AGREEMENTS, response));
      dispatch(storeAgreement(normalize(response.agreements, schema.arrayOfAgreements)));
    },
    (err) => {
      dispatch(error(reducerTypes.SEARCH_AGREEMENTS, err.message));
    },
  );
};

export const getPlan = () => (dispatch) => {
  dispatch(request(reducerTypes.GET_PLAN));

  return api.fetchPlan().then(
    (response) => {
      dispatch(success(reducerTypes.GET_PLAN), response);
      dispatch(storePlan(normalize(response.plan, schema.plan)));
    },
    (err) => {
      dispatch(error(reducerTypes.GET_PLAN, err.message));
    },
  );
};
