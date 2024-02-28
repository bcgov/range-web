import { OPEN_INPUT_MODAL, CLOSE_INPUT_MODAL } from '../constants/actionTypes';

const openModal = (state, action) => {
  const modal = action.payload;

  return {
    ...modal,
  };
};

const inputModalReducer = (state = null, action) => {
  switch (action.type) {
    case OPEN_INPUT_MODAL:
      return openModal(state, action);
    case CLOSE_INPUT_MODAL:
      return null;
    default:
      return state;
  }
};

export const getInputModal = (state) => state;

export default inputModalReducer;
