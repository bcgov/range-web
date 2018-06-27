// import axios from 'axios';
import { normalize } from 'normalizr';
import { axios, saveUserProfileInLocal, createRequestHeader } from '../utils';
import * as schema from './schema';
import * as api from '../api';
import {
  request, success, successPagenated, error,
  storeAgreements, storePlan, storeUser, removeAuthDataAndUser,
  storeZones, storeReferences, storeUsers, storeClients,
} from '../actions';
import { getAgreementsIsFetching, getToken } from '../reducers/rootReducer';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';

export const updateClientIdOfUser = (userId, clientNumber) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_CLIENT_ID_OF_USER));
  const token = getToken(getState());
  return axios.put(API.UPDATE_CLIENT_ID_OF_USER(userId, clientNumber), {}, createRequestHeader(token)).then(
    (response) => {
      const client = response.data;

      dispatch(success(reducerTypes.UPDATE_CLIENT_ID_OF_USER, client));
      // dispatch(toastSuccessMessage(LINK_CLIENT_SUCCESS));
      return client;
    },
    (err) => {
      dispatch(error(reducerTypes.UPDATE_CLIENT_ID_OF_USER, err));
      // dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const searchClients = term => (dispatch, getState) => {
  dispatch(request(reducerTypes.SEARCH_CLIENTS));
  const token = getToken(getState());
  const config = {
    ...createRequestHeader(token),
    params: {
      term,
    },
  };
  return axios.get(API.SEARCH_CLIENTS, config).then(
    (response) => {
      const clients = response.data;
      dispatch(success(reducerTypes.SEARCH_CLIENTS));
      dispatch(storeClients(normalize(clients, schema.arrayOfClients)));
      return clients;
    },
    (err) => {
      dispatch(error(reducerTypes.SEARCH_CLIENTS, err));
      throw err;
    },
  );
};

export const updateUserIdOfZone = (zoneId, userId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_USER_ID_OF_ZONE));
  const token = getToken(getState());
  return axios.put(
    API.UPDATE_USER_ID_OF_ZONE(zoneId),
    { userId },
    createRequestHeader(token),
  ).then(
    (response) => {
      dispatch(success(reducerTypes.UPDATE_USER_ID_OF_ZONE));
      // dispatch(toastSuccessMessage(ASSIGN_STAFF_TO_ZONE_SUCCESS));
      return response.data;
    },
    (err) => {
      dispatch(error(reducerTypes.UPDATE_USER_ID_OF_ZONE, err));
      // dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const fetchUsers = () => (dispatch, getState) => {
  const token = getToken(getState());
  return axios.get(API.GET_USERS, createRequestHeader(token)).then(
    (response) => {
      const users = response.data;
      dispatch(storeUsers(normalize(users, schema.arrayOfUsers)));
      return users;
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
      return references;
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
      return zones;
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
      return user;
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
      return response.data;
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
