import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { AGREEMENTS, RANGE_USE_PLAN } from '../constants/reducerTypes';
import { BASE_URL, AGREEMENT } from '../constants/api';
import axios from '../handlers/axios';

export const getAgreements = ({ term = '', page = 1, limit = 10 }) => (dispatch) => {
  dispatch(request(AGREEMENTS));
  const makeRequest = async () => {
    try {
      const config = {
        params: {
          term,
          page,
          limit,
        },
      };
      const response = await axios.get(BASE_URL + AGREEMENT, config);
      const { agreements, currentPage, totalPage } = response.data;
      dispatch(successPaginated(AGREEMENTS, agreements, currentPage, totalPage));
    } catch (err) {
      dispatch(error(AGREEMENTS, err));
    }
  };
  makeRequest();
};

export const getRangeUsePlan = id => (dispatch) => {
  dispatch(request(RANGE_USE_PLAN));
  const makeRequest = async () => {
    try {
      const url = `${BASE_URL}${AGREEMENT}/${id}`;
      const response = await axios.get(url);
      const rangeUsePlan = response.data;
      dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
    } catch (err) {
      dispatch(error(RANGE_USE_PLAN, err));
    }
  };
  makeRequest();
};
