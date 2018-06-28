import { normalize } from 'normalizr';
import { success, request, error, storePlan } from '../actions';
// import { UPDATE_RUP_STATUS_SUCCESS, UPDATE_RUP_ZONE_SUCCESS } from '../constants/strings';
// import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/API';
import * as schema from './schema';
import { axios } from '../utils';

export const fetchPlan = planId => (dispatch) => {
  dispatch(request(reducerTypes.GET_PLAN));
  const makeRequest = async () => {
    try {
      const response = await axios.get(API.GET_RUP(planId));
      const rangeUsePlan = response.data;

      dispatch(success(reducerTypes.GET_PLAN, rangeUsePlan));
      dispatch(storePlan(normalize(rangeUsePlan, schema.plan)));
    } catch (err) {
      dispatch(error(reducerTypes.GET_PLAN, err));
      throw err;
    }
  };
  return makeRequest();
};

export const updateRupStatus = ({ planId, statusId }, shouldToast = true) => (dispatch) => {
  dispatch(request(reducerTypes.UPDATE_RUP_STATUS));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_RUP_STATUS(planId),
        { statusId },
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

export const updateRupZone = ({ agreementId, zoneId }) => (dispatch) => {
  dispatch(request(reducerTypes.UPDATE_RUP_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_RUP_ZONE(agreementId),
        { zoneId },
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

export const fetchRupPDF = planId => (dispatch) => {
  dispatch(request(reducerTypes.GET_RUP_PDF));
  const makeRequest = async () => {
    try {
      const { data } = await axios.get(
        API.GET_RUP_PDF(planId),
        { responseType: 'arraybuffer' },
      );
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

const createRupSchedule = (planId, schedule) => (dispatch) => {
  dispatch(request(reducerTypes.CREATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.post(
        API.CREATE_RUP_SCHEDULE(planId),
        { ...schedule, plan_id: planId },
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

const updateRupSchedule = (planId, schedule) => (dispatch) => {
  dispatch(request(reducerTypes.UPDATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.put(
        API.UPDATE_RUP_SCHEDULE(planId, schedule.id),
        { ...schedule },
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

export const deleteRupSchedule = (planId, scheduleId) => (dispatch) => {
  dispatch(request(reducerTypes.DELETE_SCHEUDLE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(API.DELETE_RUP_SCHEDULE(planId, scheduleId));
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

export const deleteRupScheduleEntry = (planId, scheduleId, entryId) => (dispatch) => {
  dispatch(request(reducerTypes.DELETE_SCHEUDLE_ENTRY));
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(API.DELETE_RUP_SCHEDULE_ENTRY(planId, scheduleId, entryId));
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
