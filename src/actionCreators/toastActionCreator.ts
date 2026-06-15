import uuid from 'uuid-v4';
import { addToast, removeToast } from '../actions';
import { getErrorMessage } from '../utils';
import { getToastsMap } from '../reducers/rootReducer';
import {
  SESSION_EXPIRY_WARNING_DURATION,
  SESSION_EXPIRY_WARNING_TOAST_ID,
  TOAST_TIMEOUT,
} from '../constants/variables';
import type { AppThunk, AppDispatch, RootState } from '../configureStore';

const toastMessage = (
  dispatch: AppDispatch,
  getState: () => RootState,
  text: string,
  success: boolean,
  timeout: number,
): void => {
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

export const toastSuccessMessage =
  (text: string, timeout: number = TOAST_TIMEOUT): AppThunk<void> =>
  (dispatch, getState) => {
    toastMessage(dispatch, getState, text, true, timeout);
  };

export const toastErrorMessage =
  (err: any, timeout: number = TOAST_TIMEOUT): AppThunk<void> =>
  (dispatch, getState) => {
    toastMessage(dispatch, getState, getErrorMessage(err), false, timeout);
  };

export const toastSessionExpiry = (): AppThunk<void> => (dispatch) => {
  const id = SESSION_EXPIRY_WARNING_TOAST_ID;
  const toast = {
    id,
    success: false,
    isCountdown: true,
  };
  dispatch(addToast({ toast }));

  setTimeout(() => {
    dispatch(removeToast({ toastId: id }));
  }, SESSION_EXPIRY_WARNING_DURATION * 1000);
};
