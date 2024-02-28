import {
  REQUEST,
  SUCCESS,
  ERROR,
  SUCCESS_PAGINATED,
} from '../constants/actionTypes';

const initialState = {
  isFetching: false,
  errorOccured: false,
  errorResponse: null,
  success: null,
  pagination: {
    perPage: 10,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
  },
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        isFetching: true,
        errorOccured: false,
        success: null,
      };
    case SUCCESS:
      return {
        ...state,
        isFetching: false,
        errorOccured: false,
        success: action.data,
      };
    case ERROR:
      return {
        ...state,
        isFetching: false,
        errorOccured: true,
        errorResponse: action.errorResponse,
        success: null,
      };
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isFetching: false,
        errorOccured: false,
        success: action.data,
        pagination: {
          perPage: action.perPage,
          currentPage: action.currentPage,
          totalItems: action.totalItems,
          totalPages: action.totalPages,
        },
      };
    default:
      return state;
  }
};

export default networkReducer;

// private selectors
export const getIsFetching = (state) => state.isFetching;
export const getPagination = (state) => state.pagination;
export const getErrorOccured = (state) => state.errorOccured;
export const getErrorResponse = (state) => state.errorResponse;
export const getData = (state) => state.success;
