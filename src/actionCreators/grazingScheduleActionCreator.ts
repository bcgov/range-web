import uuid from 'uuid-v4';
import { success, request, error } from '../actions';
import { toastErrorMessage } from './toastActionCreator';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/api';
import { axios, createConfigWithHeader } from '../utils';
import type { AppThunk, AppDispatch } from '../configureStore';

export const createRUPSchedule =
  (planId: string | number, schedule: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const makeRequest = async () => {
      const { data: newSchedule } = await axios.post(
        API.CREATE_RUP_SCHEDULE(planId),
        { ...schedule, plan_id: planId },
        createConfigWithHeader(getState),
      );

      return {
        ...newSchedule,
      };
    };
    return makeRequest();
  };

const createRUPScheduleAndEntries =
  (planId: string | number, schedule: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(request(reducerTypes.CREATE_SCHEDULE_AND_ENTRIES));
    const makeRequest = async () => {
      try {
        const { ...grazingSchedule } = schedule;
        const { data } = await axios.post(
          API.CREATE_RUP_SCHEDULE(planId),
          { ...grazingSchedule, plan_id: planId },
          createConfigWithHeader(getState),
        );
        dispatch(success(reducerTypes.CREATE_SCHEDULE_AND_ENTRIES, data));
        return data;
      } catch (err) {
        dispatch(error(reducerTypes.CREATE_SCHEDULE_AND_ENTRIES, err));
        dispatch(toastErrorMessage(err));
        throw err;
      }
    };
    return makeRequest();
  };

const updateRUPScheduleAndEntries =
  (planId: string | number, schedule: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(request(reducerTypes.UPDATE_SCHEDULE_AND_ENTRIES));
    const makeRequest = async () => {
      try {
        const { data } = await axios.put(
          API.UPDATE_RUP_SCHEDULE(planId, schedule.id),
          { ...schedule },
          createConfigWithHeader(getState),
        );
        dispatch(success(reducerTypes.UPDATE_SCHEDULE_AND_ENTRIES, data));
        return data;
      } catch (err) {
        dispatch(error(reducerTypes.UPDATE_SCHEDULE_AND_ENTRIES, err));
        dispatch(toastErrorMessage(err));
        throw err;
      }
    };
    return makeRequest();
  };

export const createOrUpdateRUPSchedule =
  (planId: string | number, schedule: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch) => {
    if (uuid.isUUID(schedule.id)) {
      return dispatch(createRUPScheduleAndEntries(planId, schedule));
    }
    return dispatch(updateRUPScheduleAndEntries(planId, schedule));
  };
