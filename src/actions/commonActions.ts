import {
  ADD_TOAST,
  REMOVE_TOAST,
  OPEN_CONFIRMATION_MODAL,
  CLOSE_CONFIRMATION_MODAL,
  OPEN_INPUT_MODAL,
  CLOSE_INPUT_MODAL,
  OPEN_PIA_MODAL,
  CLOSE_PIA_MODAL,
} from '../constants/actionTypes';

export const addToast = (payload: { toast: { id: string; [key: string]: unknown } }) => ({
  type: ADD_TOAST,
  payload,
});

export const removeToast = (payload: { toastId: string }) => ({
  type: REMOVE_TOAST,
  payload,
});

export const openConfirmationModal = (payload: unknown) => ({
  type: OPEN_CONFIRMATION_MODAL,
  payload,
});

export const closeConfirmationModal = (payload: { modalId: string }) => ({
  type: CLOSE_CONFIRMATION_MODAL,
  payload,
});

export const openInputModal = (payload: unknown) => ({
  type: OPEN_INPUT_MODAL,
  payload,
});

export const closeInputModal = () => ({
  type: CLOSE_INPUT_MODAL,
});

export const openPiaModal = () => ({
  type: OPEN_PIA_MODAL,
});

export const closePiaModal = () => ({
  type: CLOSE_PIA_MODAL,
});
