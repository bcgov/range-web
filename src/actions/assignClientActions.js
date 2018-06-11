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
} from '../actions/genericActions';
import { GET_CLIENTS } from '../constants/reducerTypes';
import { SEARCH_CLIENTS_ENDPOINT } from '../constants/api';
// import { ASSIGN_STAFF_TO_ZONE_SUCCESS } from '../constants/strings';
// import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import axios from '../handlers/axios';

export const getClients = term => (dispatch) => {
  dispatch(request(GET_CLIENTS));
  const makeRequest = async () => {
    try {
      const config = {
        params: {
          term,
        },
      };
      const response = await axios.get(SEARCH_CLIENTS_ENDPOINT, config);
      const clients = response.data;

      dispatch(success(GET_CLIENTS, clients));
      return clients;
    } catch (err) {
      dispatch(error(GET_CLIENTS, err));
      throw err;
    }
  };
  return makeRequest();
};

export const s = () => {};
