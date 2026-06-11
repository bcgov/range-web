import { STORE_PLAN, PLAN_STATUS_HISTORY_RECORD_ADDED } from '../../constants/actionTypes';
import { PlanStatusHistory, EntityMap } from '../../types';

export type PlanStatusHistoryState = EntityMap<PlanStatusHistory>;

interface StatusHistoryAction {
  type: string;
  payload: {
    entities?: { planStatusHistory?: EntityMap<PlanStatusHistory> };
    record?: PlanStatusHistory;
  };
}

const storeStatusHistory = (state: PlanStatusHistoryState, action: StatusHistoryAction): PlanStatusHistoryState => {
  const planStatusHistory = action.payload.entities?.planStatusHistory ?? {};

  return {
    ...state,
    ...planStatusHistory,
  };
};

const addStatusHistoryRecord = (state: PlanStatusHistoryState, action: StatusHistoryAction): PlanStatusHistoryState => {
  const { record } = action.payload;

  return {
    ...state,
    [record!.id]: record!,
  };
};

const planStatusHistoryReducer = (state: PlanStatusHistoryState = {}, action: StatusHistoryAction): PlanStatusHistoryState => {
  switch (action.type) {
    case STORE_PLAN:
      return storeStatusHistory(state, action);
    case PLAN_STATUS_HISTORY_RECORD_ADDED:
      return addStatusHistoryRecord(state, action);
    default:
      return state;
  }
};

export default planStatusHistoryReducer;
