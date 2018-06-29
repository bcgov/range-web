import { STORE_PLAN } from '../constants/actionTypes';

const storePastures = (state, action) => {
  const { pastures } = action.payload.entities;

  return {
    byId: {
      ...state.byId,
      ...pastures,
    },
  };
};

const pasturesReducer = (state = {
  byId: {},
}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePastures(state, action);
    default:
      return state;
  }
};

export default pasturesReducer;
