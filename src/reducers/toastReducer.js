import {
  OPEN_TOAST_MESSAGE,
  CLOSE_TOAST_MESSAGE
} from '../constants/actionTypes';

const toastReducer = (state = {
  close: false,
  success: false,
  error: false,
  message: ''
}, action) => {
  switch (action.type) {
    case OPEN_TOAST_MESSAGE:
      return {
        ...state,
        close: false,
        success: action.success,
        error: action.error,
        message: action.message,
      }
    case CLOSE_TOAST_MESSAGE:
      return {
        ...state,
        close: true,
        message: '',
      }
    default:
      return state
  }
};

export default toastReducer;