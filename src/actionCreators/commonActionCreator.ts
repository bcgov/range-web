import { normalize } from 'normalizr';
import { axios, createConfigWithHeader, saveReferencesInLocalStorage } from '../utils';
import * as API from '../constants/api';
import { storeUsers, storeReferences, request, success, error } from '../actions';
import * as schema from './schema';
import { GET_USERS } from '../constants/reducerTypes';
import type { AppThunk } from '../configureStore';

export const fetchUsers =
  (params?: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(request(GET_USERS));

    const { orderCId, excludeBy, exclude } = params || {};
    const config = {
      ...createConfigWithHeader(getState),
      params: {
        orderCId,
        excludeBy,
        exclude,
      },
    };

    return axios.get(API.GET_USERS, config).then(
      (response: any) => {
        const users = response.data;
        dispatch(success(GET_USERS, users));
        dispatch(storeUsers(normalize(users, schema.arrayOfUsers)));

        return users;
      },
      (err: any) => {
        dispatch(error(GET_USERS, err));
        throw err;
      },
    );
  };

export const fetchReferences = (): AppThunk<Promise<any>> => (dispatch, getState) => {
  return axios
    .get(API.GET_REFERENCES, createConfigWithHeader(getState))
    .then((response: any) => {
      const references = response.data;
      saveReferencesInLocalStorage(references);
      dispatch(storeReferences(references));

      return references;
    })
    .catch((err: any) => {
      if (err?.status === 401) {
        // Request was unauthorized, user probably hasn't logged in yet.
      } else {
        console.warn(`Error fetching references, '${err}'. Falling back to locally stored references`);
      }
    });
};
