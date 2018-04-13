import {
  success,
  request,
  error,
} from '../actions/genericActions';

import { saveReferencesInLocal } from '../handlers';
import { toastErrorMessage } from '../actions/toastActions';

import { GET_REFERENCES, GET_USERS, GET_ZONES } from '../constants/reducerTypes';
import { BASE_URL, REFERENCES, USER, ZONE } from '../constants/api';
import axios from '../handlers/axios';

export const getReferences = () => (dispatch) => {
  dispatch(request(GET_REFERENCES));

  const makeRequest = async () => {
    try {
      const response = await axios.get(BASE_URL + REFERENCES);
      const references = response.data;

      saveReferencesInLocal(references);
      dispatch(success(GET_REFERENCES, references));
    } catch (err) {
      dispatch(error(GET_REFERENCES, err));
    }
  }
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
      const response = await axios.get(`${BASE_URL}${ZONE}`, config);
      const zones = response.data;

      dispatch(success(GET_ZONES, zones));
    } catch (err) {
      dispatch(error(GET_ZONES, err));
      dispatch(toastErrorMessage(err));
    }
  };
  return makeRequest();
};

export const getUsers = () => (dispatch) => {
  dispatch(request(GET_USERS));
  const makeRequest = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${USER}`);
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
