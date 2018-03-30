import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { AGREEMENTS, RANGE_USE_PLAN } from '../constants/reducerTypes';
import { BASE_URL, AGREEMENT } from '../constants/api';
import axios from '../handlers/axios';

export const searchAgreements = (term) => (dispatch) => {
  dispatch(request(AGREEMENTS));
  const makeRequest = async () => {
    try {
      let config = {};
      if (term) {
        config.params = {
          term,
        };
      }
      const response = await axios.get(BASE_URL + AGREEMENT, config);
      const agreements = response.data;
      dispatch(success(AGREEMENTS, agreements));
    } catch (err) {
      dispatch(error(AGREEMENTS, err));
    }
  };
  makeRequest();
};

export const getRangeUsePlan = (id) => (dispatch) => {
  dispatch(request(RANGE_USE_PLAN));
  const makeRequest = async () => {
    try {
      const url = `${BASE_URL}${AGREEMENT}/${id}`;
      const response = await axios.get(url)
      const rangeUsePlan = response.data;
      dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
    } catch (err) {
      dispatch(error(RANGE_USE_PLAN, err));
    }
  };
  makeRequest();
};