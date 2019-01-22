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
import * as schema from './schema';
import * as actions from '../actions';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/api';
import { getIsFetchingAgreements } from '../reducers/rootReducer';
import { axios, saveUserProfileInLocal, createConfigWithHeader } from '../utils';
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator';
import { LINK_CLIENT_SUCCESS, ASSIGN_STAFF_TO_ZONE_SUCCESS } from '../constants/strings';

export * from './planActionCreator';
export * from './toastActionCreator';
export * from './commonActionCreator';
export * from './grazingScheduleActionCreator';
export * from './pastureActionCreator';
export * from './ministerIssueActionCreator';

export const fetchAgreement = agreementId => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.GET_AGREEMENT));
  return axios.get(API.GET_AGREEMENT(agreementId), createConfigWithHeader(getState)).then(
    (response) => {
      const agreement = response.data;
      dispatch(actions.success(reducerTypes.GET_AGREEMENT, agreement));
      dispatch(actions.storeAgreementWithAllPlans(normalize(agreement, schema.agreement)));

      return agreement;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.GET_AGREEMENT, err));
      throw err;
    },
  );
};

export const updateClientIdOfUser = (userId, clientNumber) => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.UPDATE_CLIENT_ID_OF_USER));
  return axios.put(API.UPDATE_CLIENT_ID_OF_USER(userId, clientNumber), {}, createConfigWithHeader(getState)).then(
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
  if (!term) {
    return dispatch(actions.storeClients(normalize([], schema.arrayOfClients)));
  }

  dispatch(actions.request(reducerTypes.SEARCH_CLIENTS));

  const config = {
    ...createConfigWithHeader(getState),
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
    createConfigWithHeader(getState),
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

export const signOut = () => (dispatch) => {
  // clear the local storage in the browser
  localStorage.clear();
  dispatch(actions.removeAuthDataAndUser());
};

export const fetchUser = () => (dispatch, getState) => {
  dispatch(actions.request(reducerTypes.GET_USER));
  return axios.get(API.GET_USER_PROFILE, createConfigWithHeader(getState)).then(
    (response) => {
      const user = response.data;
      dispatch(actions.success(reducerTypes.GET_USER, user));
      dispatch(actions.storeUser(user));
      saveUserProfileInLocal(user);
      return user;
    },
    (err) => {
      dispatch(actions.error(reducerTypes.GET_USER, err));
      dispatch(toastErrorMessage(err));
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
    ...createConfigWithHeader(getState),
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
      dispatch(actions.error(reducerTypes.SEARCH_AGREEMENTS, err));
      throw err;
    },
  );
};
