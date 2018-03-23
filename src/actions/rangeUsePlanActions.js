import {
  success,
  request,
  error,
} from '../actions/genericActions';
import { UPDATE_RUP_STATUS_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import { UPDATE_RUP_STATUS, UPDATE_RUP_ZONE, GET_ZONES } from '../constants/reducerTypes';
import { BASE_URL, STATUS, AGREEMENT, ZONE } from '../constants/api';
import axios from '../handlers/axios';

export const updateRupStatus = (requestData) => (dispatch) => {
  dispatch(request(UPDATE_RUP_STATUS));
  const makeRequest = async () => {
    try {
      const { agreementId, statusId } = requestData;
      const response = await axios.put(
        `${BASE_URL}${AGREEMENT}/${agreementId}${STATUS}`, 
        { statusId }
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

export const updateRupZone = (requestData) => (dispatch) => {
  dispatch(request(UPDATE_RUP_ZONE));
  const makeRequest = async () => {
    try {
      const { agreementId, zoneId } = requestData;
      const response = await axios.put(
        `${BASE_URL}${AGREEMENT}/${agreementId}${ZONE}`,
        { zoneId }
      );
      dispatch(success(UPDATE_RUP_ZONE, response.data));
      dispatch(toastSuccessMessage());
      return response.data;
    } catch (err) {
      dispatch(error(UPDATE_RUP_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

export const getZones = (districtId) => (dispatch) => {
  dispatch(request(GET_ZONES));
  const makeRequest = async () => {
    try {
      let config = {};
      if (districtId) {
        config.params = {
          districtId,
        };
      }
      const response = await axios.get(`${BASE_URL}${ZONE}`, config);
      dispatch(success(GET_ZONES, response.data));
    } catch (err) {
      dispatch(error(GET_ZONES, err));
      dispatch(toastErrorMessage(err));
    }
  };
  makeRequest();
};