// import axios from 'axios';
import { normalize } from 'normalizr';
import { axios, saveUserProfileInLocal, createRequestHeader } from '../utils';
import * as schema from './schema';
import * as api from '../api';
import {
  request, success, successPagenated, error,
  storeAgreements, storePlan, storeUser, removeAuthDataAndUser,
  storeZones, storeReferences, storeUsers,
} from '../actions';
import { getAgreementsIsFetching, getToken } from '../reducers/rootReducer';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';

export const updateUserIDOfZone = (zoneId, userId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_USER_ID_OF_ZONE));
  const token = getToken(getState());
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_USER_ID_OF_ZONE(zoneId),
        { userId },
        createRequestHeader(token),
      );
      dispatch(success(reducerTypes.UPDATE_USER_ID_OF_ZONE));
      // dispatch(toastSuccessMessage(ASSIGN_STAFF_TO_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_USER_ID_OF_ZONE, err));
      // dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

export const fetchUsers = () => (dispatch, getState) => {
  const token = getToken(getState());
  return axios.get(API.GET_USERS, createRequestHeader(token)).then(
    (response) => {
      const users = response.data;
      dispatch(storeUsers(normalize(users, schema.arrayOfUsers)));
    },
    (err) => {
      throw err;
    },
  );
};

export const fetchReferences = () => (dispatch, getState) => {
  const token = getToken(getState());
  return axios.get(API.GET_REFERENCES, createRequestHeader(token)).then(
    (response) => {
      const references = response.data;
      dispatch(storeReferences(references));
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

  return axios.get(API.GET_ZONES, config).then(
    (response) => {
      const zones = response.data;
      dispatch(storeZones(normalize(zones, schema.arrayOfZones)));
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
  return axios.get(API.GET_USER_PROFILE, createRequestHeader(token)).then(
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
  return axios.get(API.SEARCH_AGREEMENTS, config).then(
    (response) => {
      dispatch(successPagenated(reducerTypes.SEARCH_AGREEMENTS, response.data));
      dispatch(storeAgreements(normalize(response.data.agreements, schema.arrayOfAgreements)));
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
