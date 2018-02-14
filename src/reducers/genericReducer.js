import {
  REQUEST,
  SUCCESS,
  SUCCESS_PAGINATED,
  ERROR
} from '../constants/actionTypes';

const genericRequest = (state = {
  isLoading: false,
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
        isLoading: true, 
        success: false
      }  
    case SUCCESS:
      return { 
        ...state,
        isLoading: false,
        success: true,
        data: action.data,
      }
    case SUCCESS_PAGINATED:
      return {
        ...state,
        isLoading: false,
        success: true,
        data: action.data,
        totalPages: action.totalPages,
        currentPage: action.currentPage,
        path: action.path
      }
    case ERROR:
      return {
        ...state,
        isLoading: false,
        success: false,
        errorMessage: action.errorMessage,
      }
    default: return state
  }
};

export default genericRequest;