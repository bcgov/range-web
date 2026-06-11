import uuid from 'uuid-v4';
import { axios, createConfigWithHeader } from '../utils';
import {
  CREATE_RUP_ADDITIONAL_REQUIREMENT,
  CREATE_RUP_MANAGEMENT_CONSIDERATION,
  UPDATE_RUP_MANAGEMENT_CONSIDERATION,
} from '../constants/api';
import type { AppThunk, AppDispatch } from '../configureStore';

export const createRUPAdditionalRequirement =
  (planId: string | number, requirement: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const { ...data } = requirement;
    return axios.post(CREATE_RUP_ADDITIONAL_REQUIREMENT(planId), data, createConfigWithHeader(getState)).then(
      (response: any) => {
        return response.data;
      },
      (err: any) => {
        throw err;
      },
    );
  };

export const createRUPManagementConsideration =
  (planId: string | number, consideration: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const { ...data } = consideration;
    return axios
      .post(CREATE_RUP_MANAGEMENT_CONSIDERATION(planId), data, createConfigWithHeader(getState))
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const updateRUPManagementConsideration =
  (planId: string | number, consideration: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    return axios
      .put(UPDATE_RUP_MANAGEMENT_CONSIDERATION(planId, consideration.id), consideration, createConfigWithHeader(getState))
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const createOrUpdateRUPManagementConsideration =
  (planId: string | number, consideration: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch) => {
    if (uuid.isUUID(consideration.id)) {
      return dispatch(createRUPManagementConsideration(planId, consideration));
    }

    return dispatch(updateRUPManagementConsideration(planId, consideration));
  };
