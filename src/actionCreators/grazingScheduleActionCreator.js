import uuid from 'uuid-v4';
import { success, request, error } from '../actions';
import { toastErrorMessage } from './toastActionCreator';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/api';
import { axios, createConfigWithHeader } from '../utils';

export const createRUPSchedule = (planId, schedule) => (dispatch, getState) => {
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

const createRUPScheduleAndEntries = (planId, schedule) => (dispatch, getState) => {
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

const updateRUPScheduleAndEntries = (planId, schedule) => (dispatch, getState) => {
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

export const createOrUpdateRUPSchedule = (planId, schedule) => (dispatch) => {
  if (uuid.isUUID(schedule.id)) {
    return dispatch(createRUPScheduleAndEntries(planId, schedule));
  }
  return dispatch(updateRUPScheduleAndEntries(planId, schedule));
};

export const deleteRUPSchedule = (planId, scheduleId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_SCHEUDLE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_SCHEDULE(planId, scheduleId),
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_SCHEUDLE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_SCHEUDLE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const deleteRUPScheduleEntry = (planId, scheduleId, entryId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_SCHEUDLE_ENTRY));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_SCHEDULE_ENTRY(planId, scheduleId, entryId),
        createConfigWithHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_SCHEUDLE_ENTRY, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_SCHEUDLE_ENTRY, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};
