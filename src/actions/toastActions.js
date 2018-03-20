import { TOAST } from '../constants/reducerTypes';
import {
  OPEN_TOAST_MESSAGE,
  CLOSE_TOAST_MESSAGE
} from '../constants/actionTypes';
import { handleToastMessage, getErrorMessage } from '../handlers';

export const openToastMessage = (success, message) => {
  return {
    name: TOAST,
    type: OPEN_TOAST_MESSAGE,
    success,
    error: !success,
    message,
  }
}

export const closeToastMessage = () => {
  return {
    name: TOAST,
    type: CLOSE_TOAST_MESSAGE,
  }
}

const toastMessage = (success, message, timeout = 4000) => (dispatch) => {
  const open = () => { 
    dispatch(openToastMessage(success, message)); 
  }
  const close = () => {
    dispatch(closeToastMessage());
  }

  handleToastMessage(open, close, timeout);
}

export const toastErrorMessage = (err) => (dispatch) => {
  const errorMessage = getErrorMessage(err);
  dispatch(toastMessage(false, errorMessage));
}

export const toastSuccessMessage = (message) => (dispatch) => {
  dispatch(toastMessage(true, message));
}