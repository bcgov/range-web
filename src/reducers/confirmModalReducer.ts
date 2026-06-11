import { OPEN_CONFIRMATION_MODAL, CLOSE_CONFIRMATION_MODAL } from '../constants/actionTypes';
import { ConfirmationModal } from './modalReducer';

export type ConfirmModalState = Record<string, ConfirmationModal>;

interface ConfirmModalAction {
  type: string;
  payload: ConfirmationModal | { modalId: string };
}

const openModal = (state: ConfirmModalState, action: ConfirmModalAction): ConfirmModalState => {
  const modal = action.payload as ConfirmationModal;
  return {
    ...state,
    [modal.id]: modal,
  };
};

const closeModal = (state: ConfirmModalState, action: ConfirmModalAction): ConfirmModalState => {
  const { modalId } = action.payload as { modalId: string };
  const newState = { ...state };
  delete newState[modalId];

  return newState;
};

const confirmModalReducer = (state: ConfirmModalState = {}, action: ConfirmModalAction): ConfirmModalState => {
  switch (action.type) {
    case OPEN_CONFIRMATION_MODAL:
      return openModal(state, action);
    case CLOSE_CONFIRMATION_MODAL:
      return closeModal(state, action);
    default:
      return state;
  }
};

export const getConfirmationModalsMap = (state: ConfirmModalState): ConfirmModalState => state;

export default confirmModalReducer;
