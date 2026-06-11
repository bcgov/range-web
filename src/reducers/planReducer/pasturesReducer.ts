import {
  STORE_PLAN,
  PASTURE_ADDED,
  PASTURE_UPDATED,
  PASTURE_SUBMITTED,
  PASTURE_COPIED,
} from '../../constants/actionTypes';
import { Pasture, EntityMap } from '../../types';

export type PasturesState = EntityMap<Pasture>;

interface StorePlanPayload {
  entities?: { pastures?: EntityMap<Pasture> };
}

interface UpdatePasturePayload {
  pasture: Pasture;
}

interface SubmitPasturePayload {
  id: string | number;
  pasture: Pasture;
}

interface CopyPasturePayload {
  pastureId: string | number;
  planId: number;
  name: string;
}

type PastureAction =
  | { type: typeof STORE_PLAN; payload: StorePlanPayload }
  | { type: typeof PASTURE_ADDED; payload: number }
  | { type: typeof PASTURE_UPDATED; payload: UpdatePasturePayload }
  | { type: typeof PASTURE_SUBMITTED; payload: SubmitPasturePayload }
  | { type: typeof PASTURE_COPIED; payload: CopyPasturePayload }
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

const addPasture = (state: PasturesState, planId: number): PasturesState => {
  const id = new Date().toISOString();
  return {
    ...state,
    [id]: {
      ...initialPasture,
      id: id as unknown as number,
      planId,
    } as Pasture,
  };
};

const updatePasture = (state: PasturesState, action: { payload: UpdatePasturePayload }): PasturesState => {
  const { pasture } = action.payload;
  return {
    ...state,
    [pasture.id]: {
      ...initialPasture,
      ...pasture,
    },
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

const copyPasture = (state: PasturesState, action: { payload: CopyPasturePayload }): PasturesState => {
  const { pastureId, planId, name } = action.payload;
  const id = new Date().toISOString();
  return {
    ...state,
    [id]: {
      ...state[pastureId as string],
      planId,
      id: id as unknown as number,
      name,
    } as Pasture,
  };
};

const pasturesReducer = (state: PasturesState = {}, action: PastureAction): PasturesState => {
  switch (action.type) {
    case STORE_PLAN:
      return storePastures(state, action as { payload: StorePlanPayload });
    case PASTURE_ADDED:
      return addPasture(state, action.payload as number);
    case PASTURE_UPDATED:
      return updatePasture(state, action as { payload: UpdatePasturePayload });
    case PASTURE_SUBMITTED:
      return submitPasture(state, action as { payload: SubmitPasturePayload });
    case PASTURE_COPIED:
      return copyPasture(state, action as { payload: CopyPasturePayload });
    default:
      return state;
  }
};

export default pasturesReducer;
