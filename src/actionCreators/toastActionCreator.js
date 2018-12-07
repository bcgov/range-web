import uuid from 'uuid-v4';
import { addToast, removeToast } from '../actions';
import { getErrorMessage } from '../utils';
import { getToastsMap } from '../reducers/rootReducer';
import { TOAST_TIMEOUT } from '../constants/variables';

const toastMessage = (dispatch, getState, text, success, timeout) => {
  const id = uuid();
  const toast = {
    id,
    text,
    success,
  };
  dispatch(addToast({ toast }));

  setTimeout(() => {
    const toastsMap = getToastsMap(getState());
    // remove the toast if it exists
    if (toastsMap[id]) {
      dispatch(removeToast({ toastId: id }));
    }
  }, timeout);
};

export const toastSuccessMessage = (text, timeout = TOAST_TIMEOUT) => (dispatch, getState) => toastMessage(dispatch, getState, text, true, timeout);

export const toastErrorMessage = (err, timeout = TOAST_TIMEOUT) => (dispatch, getState) => {
  toastMessage(dispatch, getState, getErrorMessage(err), false, timeout);
};
