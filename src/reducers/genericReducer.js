import {
  REQUEST,
  SUCCESS,
  SUCCESS_PAGINATED,
  ERROR
} from '../constants/actionTypes';

const genericRequest = (state = {
  isFetching: false,
  data: [],
  length: -1,
  success: false,
  errorMessage: '',
  totalPages: 1,
  currentPage: 1,
  path: ''
}, action) => {
  switch (action.type) {
    case REQUEST:
      return { 
        ...state,
        isFetching: true, 
        success: false
      }  
    case SUCCESS:
      return { 
        ...state,
        isFetching: false,
        success: true,
        data: action.data,
      }
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isFetching: false,
        success: true,
        data: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        path: action.path
      }
    case ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage,
      }
    default: return state
  }
};

export default genericRequest;