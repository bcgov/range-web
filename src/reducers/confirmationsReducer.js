import { STORE_PLAN } from '../constants/actionTypes';

const storeConfirmations = (state, action) => {
  const { confirmations } = action.payload.entities;

  return {
    ...state,
    ...confirmations,
  };
};

const confirmationsReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeConfirmations(state, action);
    default:
      return state;
  }
};

export default confirmationsReducer;
