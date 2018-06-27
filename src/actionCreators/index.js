// import axios from 'axios';
import { normalize } from 'normalizr';
import { axios, saveUserProfileInLocal, createRequestHeader } from '../utils';
import * as schema from './schema';
import * as api from '../api';
import {
  request, success, successPagenated, error,
  storeAgreement, storePlan, storeUser, removeAuthDataAndUser,
  storeZone, storeReference,
} from '../actions';
import { getAgreementsIsFetching, getToken } from '../reducers/rootReducer';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';

export const fetchReferences = () => (dispatch, getState) => {
  const token = getToken(getState());
  return axios.get(API.GET_REFERENCES_ENDPOINT, createRequestHeader(token)).then(
    (response) => {
      const references = response.data;
      dispatch(storeReference(references));
    },
    (err) => {
      throw err;
    },
  );
};

export const fetchZones = districtId => (dispatch, getState) => {
  const token = getToken(getState());
  const config = {
    ...createRequestHeader(token),
  };

  if (districtId) {
    config.params = {
      districtId,
    };
  }

  return axios.get(API.GET_ZONES_ENTPOINT, config).then(
    (response) => {
      const zones = response.data;
      dispatch(storeZone(normalize(zones, schema.arrayOfZones)));
    },
    (err) => {
      throw err;
    },
  );
};

export const signOut = () => (dispatch) => {
  // clear the local storage in the browser
  localStorage.clear();
  dispatch(removeAuthDataAndUser());
};

export const fetchUser = () => (dispatch, getState) => {
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

export const searchAgreements = ({ term = '', page = 1, limit = 10 }) => (dispatch, getState) => {
  if (getAgreementsIsFetching(getState())) {
    return Promise.resolve();
  }

  dispatch(request(reducerTypes.SEARCH_AGREEMENTS));
  const token = getToken(getState());
  const config = {
    ...createRequestHeader(token),
    params: {
      term,
      page,
      limit,
    },
  };
  return axios.get(API.SEARCH_AGREEMENTS_ENDPOINT, config).then(
    (response) => {
      dispatch(successPagenated(reducerTypes.SEARCH_AGREEMENTS, response.data));
      dispatch(storeAgreement(normalize(response.data.agreements, schema.arrayOfAgreements)));
    },
    (err) => {
      dispatch(error(reducerTypes.SEARCH_AGREEMENTS, err.message));
    },
  );
};

export const fetchPlan = () => (dispatch) => {
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
