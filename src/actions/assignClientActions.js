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

import {
  success,
  request,
  error,
  dataChanged,
} from '../actions/genericActions';
import { SEARCH_CLIENTS, ASSIGN_CLIENT, GET_USERS } from '../constants/reducerTypes';
import { SEARCH_CLIENTS_ENDPOINT, UPDATE_AH_CLIENT_ID_ENDPOINT } from '../constants/api';
import { ASSIGN_CLIENT_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import axios from '../handlers/axios';

export const getClients = term => (dispatch) => {
  dispatch(request(SEARCH_CLIENTS));
  const makeRequest = async () => {
    try {
      const config = {
        params: {
          term,
        },
      };
      const response = await axios.get(SEARCH_CLIENTS_ENDPOINT, config);
      const clients = response.data;

      dispatch(success(SEARCH_CLIENTS, clients));
      return clients;
    } catch (err) {
      dispatch(error(SEARCH_CLIENTS, err));
      throw err;
    }
  };
  return makeRequest();
};

export const assignClient = (userId, clientNumber) => (dispatch) => {
  dispatch(request(ASSIGN_CLIENT));
  const makeRequest = async () => {
    try {
      const response = await axios.put(UPDATE_AH_CLIENT_ID_ENDPOINT(userId, clientNumber));
      const client = response.data;

      dispatch(success(ASSIGN_CLIENT, client));
      dispatch(toastSuccessMessage(ASSIGN_CLIENT_SUCCESS));
      return client;
    } catch (err) {
      dispatch(error(ASSIGN_CLIENT, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const clientAssigned = (users, userId, assignedClientNumber) => (dispatch) => {
  const newUsers = users.map((u) => {
    const user = { ...u };
    if (user.id === userId) {
      user.clientId = assignedClientNumber;
    }
    return user;
  });
  dispatch(dataChanged(GET_USERS, newUsers));
};
