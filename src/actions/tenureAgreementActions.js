import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { TENURE_AGREEMENTS, RANGE_USE_PLAN } from '../constants/reducerTypes';
import { BASE_URL, GET_AGREEMENTS } from '../constants/api';
import axios from '../handlers/axios';

export const searchTenureAgreements = (requestData) => (dispatch) => {
  dispatch(request(TENURE_AGREEMENTS));
  const makeRequest = async () => {
    try {
      const response = await axios.get(BASE_URL + GET_AGREEMENTS);
      const agreements = response.data;
      dispatch(success(TENURE_AGREEMENTS, agreements));
    } catch (err) {
      dispatch(error(TENURE_AGREEMENTS, err));
    }
  };
  makeRequest();
};

export const getRangeUsePlan = (id) => (dispatch) => {
  dispatch(request(RANGE_USE_PLAN));
  const makeRequest = async () => {
    try {
      const url = `${BASE_URL}${GET_AGREEMENTS}/${id}`;
      const response = await axios.get(url)
      const rangeUsePlan = response.data;
      dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
    } catch (err) {
      dispatch(error(RANGE_USE_PLAN, err));
    }
  };
  makeRequest();
};