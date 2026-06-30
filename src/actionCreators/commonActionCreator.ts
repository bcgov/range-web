import { axios, createConfigWithHeader, saveReferencesInLocalStorage } from '../utils';
import * as API from '../constants/api';
import { storeReferences } from '../actions';
import type { AppThunk } from '../configureStore';

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
