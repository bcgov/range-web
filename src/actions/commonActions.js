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

import { saveReferencesInLocal } from '../handlers';
import { toastErrorMessage } from '../actions/toastActions';

import {
  GET_REFERENCES,
  GET_USERS,
  GET_ZONES,
} from '../constants/reducerTypes';
import {
  GET_REFERENCES_ENDPOINT,
  GET_USERS_ENDPOINT,
  GET_ZONES_ENTPOINT,
} from '../constants/api';
import axios from '../handlers/axios';

export const getReferences = () => (dispatch) => {
  dispatch(request(GET_REFERENCES));

  const makeRequest = async () => {
    try {
      const response = await axios.get(GET_REFERENCES_ENDPOINT);
      const references = response.data;

      saveReferencesInLocal(references);
      dispatch(success(GET_REFERENCES, references));
    } catch (err) {
      dispatch(error(GET_REFERENCES, err));
      throw err;
    }
  };
  return makeRequest();
};

export const getZones = districtId => (dispatch) => {
  dispatch(request(GET_ZONES));
  const makeRequest = async () => {
    try {
      const config = {};

      if (districtId) {
        config.params = {
          districtId,
        };
      }
      const response = await axios.get(GET_ZONES_ENTPOINT, config);
      const zones = response.data;

      dispatch(success(GET_ZONES, zones));
    } catch (err) {
      dispatch(error(GET_ZONES, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const getUsers = () => (dispatch) => {
  dispatch(request(GET_USERS));
  const makeRequest = async () => {
    try {
      const response = await axios.get(GET_USERS_ENDPOINT);
      const users = response.data;

      dispatch(success(GET_USERS, users));
      return users;
    } catch (err) {
      dispatch(error(GET_USERS), err);
      throw err;
    }
  };
  return makeRequest();
};
