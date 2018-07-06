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
import { normalize } from 'normalizr';
import { axios, saveUserProfileInLocal, createRequestHeader, saveReferencesInLocalStorage } from '../utils';
import * as schema from './schema';
import * as actions from '../actions';
import { getIsFetchingAgreements } from '../reducers/rootReducer';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator';
import { LINK_CLIENT_SUCCESS, ASSIGN_STAFF_TO_ZONE_SUCCESS } from '../constants/strings';

export * from './planActionCreator';
export * from './toastActionCreator';

/* eslint-disable arrow-body-style */
export const updateClientIdOfUser = (userId, clientNumber) => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.UPDATE_CLIENT_ID_OF_USER));
  return axios.put(API.UPDATE_CLIENT_ID_OF_USER(userId, clientNumber), {}, createRequestHeader(getState)).then(
    (response) => {
      const client = response.data;

      dispatch(actions.success(reducerTypes.UPDATE_CLIENT_ID_OF_USER, client));
      dispatch(toastSuccessMessage(LINK_CLIENT_SUCCESS));
      return client;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.UPDATE_CLIENT_ID_OF_USER, err));
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const searchClients = term => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.SEARCH_CLIENTS));
  const config = {
    ...createRequestHeader(getState),
    params: {
      term,
    },
  };
  return axios.get(API.SEARCH_CLIENTS, config).then(
    (response) => {
      const clients = response.data;
      dispatch(actions.success(reducerTypes.SEARCH_CLIENTS));
      dispatch(actions.storeClients(normalize(clients, schema.arrayOfClients)));
      return clients;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.SEARCH_CLIENTS, err));
      throw err;
    },
  );
};

export const updateUserIdOfZone = (zoneId, userId) => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.UPDATE_USER_ID_OF_ZONE));
  return axios.put(
    API.UPDATE_USER_ID_OF_ZONE(zoneId),
    { userId },
    createRequestHeader(getState),
  ).then(
    (response) => {
      dispatch(actions.success(reducerTypes.UPDATE_USER_ID_OF_ZONE));
      dispatch(toastSuccessMessage(ASSIGN_STAFF_TO_ZONE_SUCCESS));
      return response.data;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.UPDATE_USER_ID_OF_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const fetchUsers = () => (dispatch, getState) => {
  return axios.get(API.GET_USERS, createRequestHeader(getState)).then(
    (response) => {
      const users = response.data;
      dispatch(actions.storeUsers(normalize(users, schema.arrayOfUsers)));
      return users;
    },
    (err) => {
      throw err;
    },
  );
};

export const fetchReferences = () => (dispatch, getState) => {
  return axios.get(API.GET_REFERENCES, createRequestHeader(getState)).then(
    (response) => {
      const references = response.data;
      saveReferencesInLocalStorage(references);
      dispatch(actions.storeReferences(references));
      return references;
    },
    (err) => {
      throw err;
    },
  );
};

export const fetchZones = districtId => (dispatch, getState) => {
  const config = {
    ...createRequestHeader(getState),
  };

  if (districtId) {
    config.params = {
      districtId,
    };
  }

  return axios.get(API.GET_ZONES, config).then(
    (response) => {
      const zones = response.data;
      dispatch(actions.storeZones(normalize(zones, schema.arrayOfZones)));
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
  dispatch(actions.removeAuthDataAndUser());
};

export const fetchUser = () => (dispatch, getState) => {
  return axios.get(API.GET_USER_PROFILE, createRequestHeader(getState)).then(
    (response) => {
      const user = response.data;
      dispatch(actions.storeUser(user));
      saveUserProfileInLocal(user);
      return user;
    },
    (err) => {
      throw err;
    },
  );
};

export const searchAgreements = ({ term = '', page = 1, limit = 10 }) => (dispatch, getState) => {
  if (getIsFetchingAgreements(getState())) {
    return Promise.resolve();
  }
  dispatch(actions.request(reducerTypes.SEARCH_AGREEMENTS));

  const config = {
    ...createRequestHeader(getState),
    params: {
      term,
      page: Number(page),
      limit: Number(limit),
    },
  };

  return axios.get(API.SEARCH_AGREEMENTS, config).then(
    (response) => {
      dispatch(actions.successPagenated(reducerTypes.SEARCH_AGREEMENTS, response.data));
      dispatch(actions.storeAgreements(normalize(response.data.agreements, schema.arrayOfAgreements)));
      return response.data;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.SEARCH_AGREEMENTS, err.message));
      throw err;
    },
  );
};
