import { OPEN_INPUT_MODAL, CLOSE_INPUT_MODAL } from '../constants/actionTypes';
import { InputModal } from './modalReducer';

export type InputModalState = InputModal | null;

interface InputModalAction {
  type: string;
  payload?: InputModal;
}

const openModal = (_state: InputModalState, action: InputModalAction): InputModalState => {
  const modal = action.payload!;

  return {
    ...modal,
  };
};

const inputModalReducer = (state: InputModalState = null, action: InputModalAction): InputModalState => {
  switch (action.type) {
    case OPEN_INPUT_MODAL:
      return openModal(state, action);
    case CLOSE_INPUT_MODAL:
      return null;
    default:
      return state;
  }
};

export const getInputModal = (state: InputModalState): InputModalState => state;

export default inputModalReducer;
