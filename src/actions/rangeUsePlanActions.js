import {
  PLANS_REQUEST,
  PLANS_REQUEST_ERROR,
  GET_PLANS_SUCCESS,
  SEARCH_PLANS_SUCCESS,
} from '../constants/actionTypes';
import { getMockRangeUsePlans } from '../components/rangeUsePlans/test/mockValues';


const getPlansSuccess = (data, currentPage, totalPages) => {
  return {
    type: GET_PLANS_SUCCESS,
    data,
    currentPage,
    totalPages,
  }
};

const searchPlansSuccess = (data, currentPage, totalPages) => {
  return {
    type: SEARCH_PLANS_SUCCESS,
    data,
    currentPage,
    totalPages,
  }
};

const plansRequest = () => {
  return {
    type: PLANS_REQUEST,
  }
};

const plansRequestError = (errorResponse) => {
  return {
    type: PLANS_REQUEST_ERROR,
    errorResponse,
  }
};

export const getRangeUsePlans = (requestData) => (dispatch) => {
  dispatch(plansRequest());
  setTimeout(() => {
    const plans = getMockRangeUsePlans(8);
    dispatch(getPlansSuccess(plans, 1, 10));
  }, 1000);
};

export const searchRangeUsePlans = (term) => (dispatch) => {
  dispatch(plansRequest());
  setTimeout(() => {
    let plans;
    if(term) {
      plans = getMockRangeUsePlans(2);
      dispatch(searchPlansSuccess(plans, 1, 1));
    } else {
      plans = getMockRangeUsePlans(8);
      dispatch(searchPlansSuccess(plans, 1, 10));
    }
  }, 1000);
};