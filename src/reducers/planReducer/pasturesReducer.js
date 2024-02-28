import {
  STORE_PLAN,
  PASTURE_ADDED,
  PASTURE_UPDATED,
  PASTURE_SUBMITTED,
  PASTURE_COPIED,
} from '../../constants/actionTypes';

const initialPasture = {
  name: '',
  allowableAum: 0,
  pldPercent: 0,
  graceDays: 0,
  notes: '',
  plantCommunities: [],
};

const storePastures = (state, action) => {
  const { pastures } = action.payload.entities;

  return {
    ...state,
    ...pastures,
  };
};

const addPasture = (state, action) => {
  // Set temporary ID based on timestamp to track unsubmitted pastures
  const id = new Date().toISOString();
  return {
    ...state,
    [id]: {
      ...initialPasture,
      id,
      planId: action.payload,
    },
  };
};

const updatePasture = (state, action) => {
  const { pasture } = action.payload;
  return {
    ...state,
    [pasture.id]: {
      ...initialPasture,
      ...pasture,
    },
  };
};

const submitPasture = (state, action) => {
  const { id, pasture } = action.payload;
  const newState = { ...state };
  delete newState[id];

  return {
    ...newState,
    [pasture.id]: {
      ...initialPasture,
      ...pasture,
    },
  };
};

const copyPasture = (state, action) => {
  const { pastureId, planId, name } = action.payload;
  // Set temporary ID based on timestamp to track unsubmitted pastures
  const id = new Date().toISOString();
  return {
    ...state,
    [id]: {
      ...state[pastureId],
      planId,
      id,
      name,
    },
  };
};

const pasturesReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePastures(state, action);
    case PASTURE_ADDED:
      return addPasture(state, action);
    case PASTURE_UPDATED:
      return updatePasture(state, action);
    case PASTURE_SUBMITTED:
      return submitPasture(state, action);
    case PASTURE_COPIED:
      return copyPasture(state, action);
    default:
      return state;
  }
};

export default pasturesReducer;
