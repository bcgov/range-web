import { normalize } from 'normalizr';
import uuid from 'uuid-v4';
import { success, request, error, storePlan } from '../actions';
import { UPDATE_PLAN_STATUS_SUCCESS, UPDATE_RUP_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';
import * as schema from './schema';
import { axios, createRequestHeader } from '../utils';

export const fetchPlan = planId => (dispatch, getState) => {
  dispatch(request(reducerTypes.GET_PLAN));
  const makeRequest = async () => {
    try {
      const response = await axios.get(API.GET_RUP(planId), createRequestHeader(getState));
      const rangeUsePlan = response.data.plan;

      dispatch(success(reducerTypes.GET_PLAN, response.data));
      dispatch(storePlan(normalize(rangeUsePlan, schema.plan)));
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.GET_PLAN, err));
      throw err;
    }
  };
  return makeRequest();
};

export const updatePlanStatus = (planId, statusId, shouldToast = true) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_PLAN_STATUS));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_PLAN_STATUS(planId),
        { statusId },
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_PLAN_STATUS, response.data));
      if (shouldToast) {
        dispatch(toastSuccessMessage(UPDATE_PLAN_STATUS_SUCCESS));
      }
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_PLAN_STATUS, err));
      if (shouldToast) {
        dispatch(toastErrorMessage(err));
      }
      throw err;
    }
  };
  return makeRequest();
};

export const updateAgreementZone = ({ agreementId, zoneId }) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_RUP_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_RUP_ZONE(agreementId),
        { zoneId },
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_RUP_ZONE, response.data));
      dispatch(toastSuccessMessage(UPDATE_RUP_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_RUP_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

export const fetchRupPDF = planId => (dispatch, getState) => {
  dispatch(request(reducerTypes.GET_RUP_PDF));
  const makeRequest = async () => {
    try {
      const config = {
        ...createRequestHeader(getState),
        responseType: 'arraybuffer',
      };
      const { data } = await axios.get(API.GET_RUP_PDF(planId), config);
      dispatch(success(reducerTypes.GET_RUP_PDF, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.GET_RUP_PDF, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const createRupGrazingSchedule = (planId, schedule) => (dispatch, getState) => {
  dispatch(request(reducerTypes.CREATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { id, ...grazingSchedule } = schedule;
      const { data } = await axios.post(
        API.CREATE_RUP_SCHEDULE(planId),
        { ...grazingSchedule, plan_id: planId },
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.CREATE_RUP_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.CREATE_RUP_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const updateRupGrazingSchedule = (planId, schedule) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.put(
        API.UPDATE_RUP_SCHEDULE(planId, schedule.id),
        { ...schedule },
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_RUP_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_RUP_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const createOrUpdateRupGrazingSchedule = (planId, schedule) => (dispatch) => {
  if (uuid.isUUID(schedule.id)) {
    return dispatch(createRupGrazingSchedule(planId, schedule));
  }
  return dispatch(updateRupGrazingSchedule(planId, schedule));
};

export const deleteRupGrazingSchedule = (planId, scheduleId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_GRAZING_SCHEUDLE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_SCHEDULE(planId, scheduleId),
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_GRAZING_SCHEUDLE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_GRAZING_SCHEUDLE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const deleteRupGrazingScheduleEntry = (planId, scheduleId, entryId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_SCHEDULE_ENTRY(planId, scheduleId, entryId),
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};
