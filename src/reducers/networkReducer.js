import { REQUEST, SUCCESS, ERROR, SUCCESS_PAGINATED } from '../constants/actionTypes';

const initialState = {
  isFetching: false,
  isSuccessful: false,
  error: null,
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
        isSuccessful: false,
        error: null,
        success: null,
      };
    case SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSuccessful: true,
        error: null,
        success: action.data,
      };
    case ERROR:
      return {
        ...state,
        isFetching: false,
        isSuccessful: false,
        error: action.errorMessage,
        success: null,
      };
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isFetching: false,
        isSuccessful: true,
        error: null,
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
export const getIsFetching = state => state.isFetching;
export const getPagination = state => state.pagination;
export const getErrorMessage = state => state.error;
