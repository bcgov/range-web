import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { AGREEMENTS, RANGE_USE_PLAN } from '../constants/reducerTypes';
import { AGREEMENT, PLAN } from '../constants/api';
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
      const response = await axios.get(`${AGREEMENT}/search`, config);
      const { agreements, currentPage, totalPage } = response.data;
      dispatch(successPaginated(AGREEMENTS, agreements, currentPage, totalPage));
    } catch (err) {
      dispatch(error(AGREEMENTS, err));
    }
  };
  makeRequest();
};

export const getRangeUsePlan = ({ agreementId, planId }) => (dispatch) => {
  dispatch(request(RANGE_USE_PLAN));
  const makeRequest = async () => {
    try {
      const response1 = await axios.get(`${AGREEMENT}/${agreementId}`);
      const response2 = await axios.get(`${PLAN}/${planId}`);
      const agreement = response1.data;
      const plan = response2.data;
      delete agreement.plans;

      const rangeUsePlan = { ...agreement, plan };
      dispatch(success(RANGE_USE_PLAN, rangeUsePlan));
    } catch (err) {
      dispatch(error(RANGE_USE_PLAN, err));
    }
  };
  makeRequest();
};
