import { OPEN_CONFIRMATION_MODAL, CLOSE_CONFIRMATION_MODAL } from '../constants/actionTypes';

const openModal = (state, action) => {
  const modal = action.payload;
  return {
    ...state,
    [modal.id]: modal,
  };
};

const closeModal = (state, action) => {
  const { modalId } = action.payload;
  const newState = { ...state };
  delete newState[modalId];

  return newState;
};

const confirmationModalReducer = (state = {}, action) => {
  switch (action.type) {
    case OPEN_CONFIRMATION_MODAL:
      return openModal(state, action);
    case CLOSE_CONFIRMATION_MODAL:
      return closeModal(state, action);
    default:
      return state;
  }
};

export const getConfirmationModalsMap = state => state;

export default confirmationModalReducer;
