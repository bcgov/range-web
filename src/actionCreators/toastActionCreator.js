import uuid from 'uuid-v4';
import { addToast, removeToast } from '../actions';
import { getErrorMessage } from '../utils';
import { getToastsMap } from '../reducers/rootReducer';

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
    // remove the toast in 5s(default) if exist
    if (toastsMap[id]) {
      dispatch(removeToast({ toastId: id }));
    }
  }, timeout);
};

export const toastSuccessMessage = (text, timeout = 5000) => (dispatch, getState) =>
  toastMessage(dispatch, getState, text, true, timeout);

export const toastErrorMessage = (err, timeout = 5000) => (dispatch, getState) => {
  let text = err;
  if (typeof err === 'object') {
    text = getErrorMessage(err);
  }
  toastMessage(dispatch, getState, text, false, timeout);
};
