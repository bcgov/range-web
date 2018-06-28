import { normalize } from 'normalizr';
import { success, request, error, storePlan } from '../actions';
// import { UPDATE_RUP_STATUS_SUCCESS, UPDATE_RUP_ZONE_SUCCESS } from '../constants/strings';
// import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
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
      // delete response.data.plan;
      // const agreement = { ...response.data, plans: [rangeUsePlan] };
      // console.log(normalize(agreement, schema.agreement));
      // dispatch(storeAgreements())
      // console.log(normalize(rangeUsePlan, schema.agreement));

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

export const updateRupStatus = (planId, statusId, shouldToast = true) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_RUP_STATUS));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_RUP_STATUS(planId),
        { statusId },
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_RUP_STATUS, response.data));
      if (shouldToast) {
        // dispatch(toastSuccessMessage(UPDATE_RUP_STATUS_SUCCESS));
      }
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_RUP_STATUS, err));
      // dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const updateRupZone = ({ agreementId, zoneId }) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_RUP_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_RUP_ZONE(agreementId),
        { zoneId },
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.UPDATE_RUP_ZONE, response.data));
      // dispatch(toastSuccessMessage(UPDATE_RUP_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_RUP_ZONE, err));
      // dispatch(toastErrorMessage(err));
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
      // dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const createRupSchedule = (planId, schedule) => (dispatch, getState) => {
  dispatch(request(reducerTypes.CREATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.post(
        API.CREATE_RUP_SCHEDULE(planId),
        { ...schedule, plan_id: planId },
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.CREATE_RUP_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.CREATE_RUP_SCHEDULE, err));
      // dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const updateRupSchedule = (planId, schedule) => (dispatch, getState) => {
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
      // dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const createOrUpdateRupSchedule = (planId, schedule) => (dispatch) => {
  if (schedule.id) {
    return dispatch(updateRupSchedule(planId, schedule));
  }
  return dispatch(createRupSchedule(planId, schedule));
};

export const deleteRupSchedule = (planId, scheduleId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_SCHEUDLE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_SCHEDULE(planId, scheduleId),
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_SCHEUDLE, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_SCHEUDLE, err));
      // dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const deleteRupScheduleEntry = (planId, scheduleId, entryId) => (dispatch, getState) => {
  dispatch(request(reducerTypes.DELETE_SCHEUDLE_ENTRY));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_SCHEDULE_ENTRY(planId, scheduleId, entryId),
        createRequestHeader(getState),
      );
      dispatch(success(reducerTypes.DELETE_SCHEUDLE_ENTRY, data));
      return data;
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_SCHEUDLE_ENTRY, err));
      // dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};
