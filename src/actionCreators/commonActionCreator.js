import { normalize } from 'normalizr';
import { axios, createConfigWithHeader, saveReferencesInLocalStorage } from '../utils';
import * as API from '../constants/api';
import { storeUsers, storeReferences, storeZones } from '../actions';
import * as schema from './schema';

export const fetchUsers = () => (dispatch, getState) => {
  return axios.get(API.GET_USERS, createConfigWithHeader(getState)).then(
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
  return axios.get(API.GET_REFERENCES, createConfigWithHeader(getState)).then(
    (response) => {
      const references = response.data;
      saveReferencesInLocalStorage(references);
      dispatch(storeReferences(references));
      return references;
    },
    (err) => {
      throw err;
    },
  );
};

export const fetchZones = districtId => (dispatch, getState) => {
  const config = {
    ...createConfigWithHeader(getState),
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
