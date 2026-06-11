import {
  OPEN_INPUT_MODAL,
  CLOSE_INPUT_MODAL,
  OPEN_CONFIRMATION_MODAL,
  CLOSE_CONFIRMATION_MODAL,
  OPEN_PIA_MODAL,
  CLOSE_PIA_MODAL,
} from '../constants/actionTypes';

export interface ConfirmationModal {
  id: string;
  open: boolean;
  [key: string]: unknown;
}

export interface InputModal {
  id?: string;
  [key: string]: unknown;
}

export interface ModalState {
  confirmModal: Record<string, ConfirmationModal>;
  inputModal: InputModal | null;
  isPiaModalOpen: boolean;
}

interface ModalAction {
  type: string;
  payload?: { id?: string; modalId?: string; [key: string]: unknown };
}

const initialState: ModalState = {
  confirmModal: {},
  inputModal: null,
  isPiaModalOpen: false,
};

const openConfirmModal = (state: ModalState, action: ModalAction): ModalState => {
  const modal = action.payload as ConfirmationModal;
  return {
    ...state,
    confirmModal: {
      ...state.confirmModal,
      [modal.id]: modal,
    },
  };
};

const closeConfirmModal = (state: ModalState, action: ModalAction): ModalState => {
  const { modalId } = action.payload as { modalId: string };
  const newConfirmModalState = { ...state.confirmModal };
  delete newConfirmModalState[modalId];
  return {
    ...state,
    confirmModal: newConfirmModalState,
  };
};

const openInputModal = (state: ModalState, action: ModalAction): ModalState => {
  const modal = action.payload as InputModal;
  return {
    ...state,
    inputModal: { ...modal },
  };
};

const closeInputModal = (state: ModalState): ModalState => {
  return {
    ...state,
    inputModal: null,
  };
};

const openPiaModal = (state: ModalState): ModalState => {
  return {
    ...state,
    isPiaModalOpen: true,
  };
};

const closePiaModal = (state: ModalState): ModalState => {
  return {
    ...state,
    isPiaModalOpen: false,
  };
};

const modalReducer = (state: ModalState = initialState, action: ModalAction): ModalState => {
  switch (action.type) {
    case OPEN_CONFIRMATION_MODAL:
      return openConfirmModal(state, action);
    case CLOSE_CONFIRMATION_MODAL:
      return closeConfirmModal(state, action);
    case OPEN_INPUT_MODAL:
      return openInputModal(state, action);
    case CLOSE_INPUT_MODAL:
      return closeInputModal(state);
    case OPEN_PIA_MODAL:
      return openPiaModal(state);
    case CLOSE_PIA_MODAL:
      return closePiaModal(state);
    default:
      return state;
  }
};

export const getConfirmationModalsMap = (state: ModalState): Record<string, ConfirmationModal> =>
  state.confirmModal;
export const getInputModal = (state: ModalState): InputModal | null => state.inputModal;
export const getIsPiaModalOpen = (state: ModalState): boolean => state.isPiaModalOpen;

export default modalReducer;
