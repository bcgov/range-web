import {
  success,
  request,
  error,
} from '../actions/genericActions';
import { UPDATE_RUP_STATUS_SUCCESS, UPDATE_RUP_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import { UPDATE_RUP_STATUS, UPDATE_RUP_ZONE, GET_PDF, UPDATE_RUP_SCHEDULE, CREATE_RUP_SCHEDULE } from '../constants/reducerTypes';
import { STATUS, AGREEMENT, ZONE, PLAN, REPORT, SCHEDULE } from '../constants/api';
import axios from '../handlers/axios';

export const updateRupStatus = ({ planId, statusId }, shouldToast = true) => (dispatch) => {
  dispatch(request(UPDATE_RUP_STATUS));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        `${PLAN}/${planId}${STATUS}`,
        { statusId },
      );
      dispatch(success(UPDATE_RUP_STATUS, response.data));
      if (shouldToast) {
        dispatch(toastSuccessMessage(UPDATE_RUP_STATUS_SUCCESS));
      }
      return response.data;
    } catch (err) {
      dispatch(error(UPDATE_RUP_STATUS, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const updateRupZone = ({ agreementId, zoneId }) => (dispatch) => {
  dispatch(request(UPDATE_RUP_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        `${AGREEMENT}/${agreementId}${ZONE}`,
        { zoneId },
      );
      dispatch(success(UPDATE_RUP_ZONE, response.data));
      dispatch(toastSuccessMessage(UPDATE_RUP_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(UPDATE_RUP_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

export const getRupPDF = planId => (dispatch) => {
  dispatch(request(GET_PDF));
  const makeRequest = async () => {
    try {
      const { data } = await axios.get(
        `${REPORT}/${planId}`,
        { responseType: 'arraybuffer' },
      );
      dispatch(success(GET_PDF, data));
      return data;
    } catch (err) {
      dispatch(error(GET_PDF, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const createRupSchedule = ({ planId, schedule }) => (dispatch) => {
  dispatch(request(CREATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.post(
        `${PLAN}/${planId}${SCHEDULE}`,
        { ...schedule, plan_id: planId },
      );
      dispatch(success(CREATE_RUP_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(CREATE_RUP_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

const updateRupSchedule = ({ planId, schedule }) => (dispatch) => {
  dispatch(request(UPDATE_RUP_SCHEDULE));
  const makeRequest = async () => {
    try {
      const { data } = await axios.put(
        `${PLAN}/${planId}${SCHEDULE}/${schedule.id}`,
        { ...schedule },
      );
      dispatch(success(UPDATE_RUP_SCHEDULE, data));
      return data;
    } catch (err) {
      dispatch(error(UPDATE_RUP_SCHEDULE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};

export const createOrUpdateRupSchedule = ({ planId, schedule }) => (dispatch) => {
  if (schedule.id) {
    return dispatch(updateRupSchedule({ planId, schedule }));
  }
  return dispatch(createRupSchedule({ planId, schedule }));
};
