import { ADD_TOAST, REMOVE_TOAST } from '../constants/actionTypes';
import { ToastMessage } from '../types';

export type ToastState = Record<string, ToastMessage>;

interface AddToastAction {
  type: typeof ADD_TOAST;
  payload: { toast: ToastMessage };
}

interface RemoveToastAction {
  type: typeof REMOVE_TOAST;
  payload: { toastId: string };
}

type ToastAction = AddToastAction | RemoveToastAction | { type: string };

const addToast = (state: ToastState, action: AddToastAction): ToastState => {
  const { toast } = action.payload;
  return {
    ...state,
    [toast.id]: toast,
  };
};

const removeToast = (state: ToastState, action: RemoveToastAction): ToastState => {
  const { toastId } = action.payload;
  const newState = { ...state };
  delete newState[toastId];
  return newState;
};

const toastReducer = (state: ToastState = {}, action: ToastAction): ToastState => {
  switch (action.type) {
    case ADD_TOAST:
      return addToast(state, action as AddToastAction);
    case REMOVE_TOAST:
      return removeToast(state, action as RemoveToastAction);
    default:
      return state;
  }
};

export const getToastsMap = (state: ToastState): ToastState => state;

export default toastReducer;
