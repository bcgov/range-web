import { STORE_PLAN } from '../constants/actionTypes';

const storePastures = (state, action) => {
  const { pastures } = action.payload.entities;

  return {
    ...state,
    ...pastures,
  };
};

const pasturesReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePastures(state, action);
    default:
      return state;
  }
};

export default pasturesReducer;
