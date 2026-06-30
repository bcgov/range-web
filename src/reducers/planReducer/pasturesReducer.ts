import { STORE_PLAN, PASTURE_SUBMITTED } from '../../constants/actionTypes';
import { Pasture, EntityMap } from '../../types';

export type PasturesState = EntityMap<Pasture>;

interface StorePlanPayload {
  entities?: { pastures?: EntityMap<Pasture> };
}

interface SubmitPasturePayload {
  id: string | number;
  pasture: Pasture;
}

type PastureAction =
  | { type: typeof STORE_PLAN; payload: StorePlanPayload }
  | { type: typeof PASTURE_SUBMITTED; payload: SubmitPasturePayload }
  | { type: string; payload: unknown };

const initialPasture: Omit<Pasture, 'id' | 'planId'> = {
  name: '',
  allowableAum: 0,
  pldPercent: 0,
  graceDays: 0,
  notes: '',
  plantCommunities: [],
};

const storePastures = (state: PasturesState, action: { payload: StorePlanPayload }): PasturesState => {
  const pastures = action.payload.entities?.pastures ?? {};

  return {
    ...state,
    ...pastures,
  };
};

const submitPasture = (state: PasturesState, action: { payload: SubmitPasturePayload }): PasturesState => {
  const { id, pasture } = action.payload;
  const newState = { ...state };
  delete newState[id as string];

  return {
    ...newState,
    [pasture.id]: {
      ...initialPasture,
      ...pasture,
    },
  };
};

const pasturesReducer = (state: PasturesState = {}, action: PastureAction): PasturesState => {
  switch (action.type) {
    case STORE_PLAN:
      return storePastures(state, action as { payload: StorePlanPayload });
    case PASTURE_SUBMITTED:
      return submitPasture(state, action as { payload: SubmitPasturePayload });
    default:
      return state;
  }
};

export default pasturesReducer;
