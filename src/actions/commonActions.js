import { ADD_TOAST, REMOVE_TOAST, OPEN_CONFIRMATION_MODAL, CLOSE_CONFIRMATION_MODAL, EDIT_CONFIRMATION_MODAL } from '../constants/actionTypes';

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

export const openConfirmationModal = payload => (
  {
    type: OPEN_CONFIRMATION_MODAL,
    payload,
  }
);

export const closeConfirmationModal = payload => (
  {
    type: CLOSE_CONFIRMATION_MODAL,
    payload,
  }
);

export const editConfirmationModal = payload => (
  {
    type: EDIT_CONFIRMATION_MODAL,
    payload,
  }
);
