import { ADD_TOAST, REMOVE_TOAST } from '../constants/actionTypes';

export const addToast = payload => (
  {
    type: ADD_TOAST,
    payload,
  }
);

export const removeToast = payload => (
  {
    type: REMOVE_TOAST,
    payload,
  }
);
