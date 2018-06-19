import { REQUEST, SUCCESS, ERROR, SUCCESS_PAGINATED } from '../constants/actionTypes';

const initialState = {
  isFetching: false,
  isSuccessful: false,
  error: null,
  // requestType: null,
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
        // requestType: action.type,
      };
    case SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSuccessful: true,
        error: false,
        // requestType: action.type,
      };
    case ERROR:
      return {
        ...state,
        isFetching: false,
        isSuccessful: false,
        error: action.errorMessage,
        // requestType: action.type,
      };
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isFetching: false,
        isSuccessful: true,
        error: false,
        // requestType: action.type,
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
export const getIsFetching = (state, reducerName) => state[reducerName].isFetching;
export const getPagination = (state, reducerName) => state[reducerName].pagination;
export const getErrorMessage = (state, reducerName) => state[reducerName].error;
