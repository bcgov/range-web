import { STORE_PLAN, CONFIRMATION_UPDATED } from '../../constants/actionTypes';
import { PlanConfirmation, EntityMap } from '../../types';

export type ConfirmationsState = EntityMap<PlanConfirmation>;

interface ConfirmationAction {
  type: string;
  payload: {
    entities?: { confirmations?: EntityMap<PlanConfirmation> };
    confirmation?: PlanConfirmation;
  };
}

const storeConfirmations = (state: ConfirmationsState, action: ConfirmationAction): ConfirmationsState => {
  const confirmations = action.payload.entities?.confirmations ?? {};

  return {
    ...state,
    ...confirmations,
  };
};

const updateConfirmation = (state: ConfirmationsState, action: ConfirmationAction): ConfirmationsState => {
  const { confirmation } = action.payload;

  return {
    ...state,
    [confirmation!.id]: confirmation!,
  };
};

const confirmationsReducer = (state: ConfirmationsState = {}, action: ConfirmationAction): ConfirmationsState => {
  switch (action.type) {
    case STORE_PLAN:
      return storeConfirmations(state, action);
    case CONFIRMATION_UPDATED:
      return updateConfirmation(state, action);
    default:
      return state;
  }
};

export default confirmationsReducer;
