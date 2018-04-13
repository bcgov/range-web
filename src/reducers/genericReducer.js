import {
  REQUEST,
  SUCCESS,
  SUCCESS_PAGINATED,
  ERROR,
  DATA_CHANGED,
} from '../constants/actionTypes';

const genericRequest = (state, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        isLoading: true,
        success: false,
      };
    case SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        data: action.data,
      };
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isLoading: false,
        success: true,
        data: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
      };
    case DATA_CHANGED:
      return {
        ...state,
        data: action.data,
      };
    case ERROR:
      return {
        ...state,
        isLoading: false,
        success: false,
        error: action.error,
      };
    default: return state;
  }
};

export default genericRequest;
