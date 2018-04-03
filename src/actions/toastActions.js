import { TOAST } from '../constants/reducerTypes';
import {
  OPEN_TOAST_MESSAGE,
  CLOSE_TOAST_MESSAGE,
} from '../constants/actionTypes';
import { getErrorMessage } from '../handlers';

export const openToastMessage = (success, message) => (
  {
    name: TOAST,
    type: OPEN_TOAST_MESSAGE,
    success,
    error: !success,
    message,
  }
);

export const closeToastMessage = () => (
  {
    name: TOAST,
    type: CLOSE_TOAST_MESSAGE,
  }
);

let toastTimeout = null;
const toastMessage = (success, message, timeout = 4000) => (dispatch) => {
  // unregister the timeout to prevent from closing
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // close the previous message if it was presented
  dispatch(closeToastMessage());

  // open a new message
  dispatch(openToastMessage(success, message));

  toastTimeout = setTimeout(() => {
    dispatch(closeToastMessage());
  }, timeout);
};

export const toastErrorMessage = (err, timeout) => (dispatch) => {
  const errorMessage = getErrorMessage(err);
  dispatch(toastMessage(false, errorMessage, timeout));
};

export const toastSuccessMessage = (message = 'Success!', timeout) => (dispatch) => {
  dispatch(toastMessage(true, message, timeout));
};
