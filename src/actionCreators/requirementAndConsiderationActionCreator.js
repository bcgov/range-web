import uuid from 'uuid-v4';
import { toastErrorMessage } from './toastActionCreator';
import {
  axios, createConfigWithHeader,
} from '../utils';
import { CREATE_RUP_ADDITIONAL_REQUIREMENT, CREATE_RUP_MANAGEMENT_CONSIDERATION, UPDATE_RUP_MANAGEMENT_CONSIDERATION } from '../constants/api';

export const createRUPAdditionalRequirement = (planId, requirement) => (dispatch, getState) => {
  return axios.post(
    CREATE_RUP_ADDITIONAL_REQUIREMENT(planId),
    requirement,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const createRUPManagementConsideration = (planId, consideration) => (dispatch, getState) => {
  return axios.post(
    CREATE_RUP_MANAGEMENT_CONSIDERATION(planId),
    consideration,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const updateRUPManagementConsideration = (planId, consideration) => (dispatch, getState) => {
  return axios.put(
    UPDATE_RUP_MANAGEMENT_CONSIDERATION(planId, consideration.id),
    consideration,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      dispatch(toastErrorMessage(err));
      throw err;
    },
  );
};

export const createOrUpdateRUPManagementConsideration = (planId, consideration) => (dispatch) => {
  if (uuid.isUUID(consideration.id)) {
    return dispatch(createRUPManagementConsideration(planId, consideration));
  }

  return dispatch(updateRUPManagementConsideration(planId, consideration));
};
