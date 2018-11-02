import * as API from '../constants/api';
import { axios, createConfigWithHeader } from '../utils';

export const createRUPPasture = (planId, pasture) => (dispatch, getState) => {
  return axios.post(
    API.CREATE_RUP_PASTURE(planId),
    pasture,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      const newPasture = response.data;
      const { copiedId } = pasture;

      // this is when creating amendment to keep track of the copied id
      if (copiedId) {
        return { ...newPasture, copiedId };
      }
      return newPasture;
    },
    (err) => {
      throw err;
    },
  );
};
