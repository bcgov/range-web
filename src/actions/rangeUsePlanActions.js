import {
  success,
  request,
  error,
} from '../actions/genericActions';
import { UPDATE_RUP_STATUS_SUCCESS, UPDATE_RUP_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import { UPDATE_RUP_STATUS, UPDATE_RUP_ZONE, GET_ZONES, GET_PDF } from '../constants/reducerTypes';
import { BASE_URL, STATUS, AGREEMENT, ZONE, PLAN, REPORT } from '../constants/api';
import axios from '../handlers/axios';

export const updateRupStatus = ({ planId, statusId }) => (dispatch) => {
  dispatch(request(UPDATE_RUP_STATUS));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}${PLAN}/${planId}${STATUS}`,
        { statusId },
      );
      dispatch(success(UPDATE_RUP_STATUS, response.data));
      dispatch(toastSuccessMessage(UPDATE_RUP_STATUS_SUCCESS));
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
        `${BASE_URL}${AGREEMENT}/${agreementId}${ZONE}`,
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
      const response = await axios.get(
        `${BASE_URL}${REPORT}/${planId}`,
        { responseType: 'arraybuffer' },
      );
      dispatch(success(GET_PDF, response.data));
      return response.data;
    } catch (err) {
      dispatch(error(GET_PDF, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
};
