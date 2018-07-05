import { ADD_TOAST, REMOVE_TOAST } from '../constants/actionTypes';

const addToast = (state, action) => {
  const { toast } = action.payload;
  return {
    ...state,
    [toast.id]: toast,
  };
};

const removeToast = (state, action) => {
  const { toastId } = action.payload;
  const newState = { ...state };
  delete newState[toastId];

  return newState;
};

const toastReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TOAST:
      return addToast(state, action);
    case REMOVE_TOAST:
      return removeToast(state, action);
    default:
      return state;
  }
};

export const getToastsMap = state => state;

export default toastReducer;
