import {
  PLANS_REQUEST,
  PLANS_REQUEST_ERROR,
  GET_PLANS_SUCCESS,
  SEARCH_PLANS_SUCCESS,
} from '../constants/actionTypes';

const rangeUsePlanReducer = (state = {
  isLoading: false,
  rangeUsePlans: [],
  success: false,
  totalPages: 1,
  currentPage: 1,
  errorResponse: {},
}, action) => {
  switch (action.type) {
    case PLANS_REQUEST:
      return {
        ...state,
        isLoading: true,
        success: false,
      }
    case GET_PLANS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        rangeUsePlans: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
      }
    case SEARCH_PLANS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        rangeUsePlans: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
      }
    case PLANS_REQUEST_ERROR:
      return {
        ...state,
        isLoading: false,
        success: false,
        errorResponse: action.errorResponse,
      }
    default:
      return state;
  }
}

export default rangeUsePlanReducer;