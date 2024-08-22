import { STORE_PLAN, PLAN_STATUS_HISTORY_RECORD_ADDED } from '../../constants/actionTypes';

const storeStatusHistory = (state, action) => {
  const { planStatusHistory } = action.payload.entities;

  return {
    ...state,
    ...planStatusHistory,
  };
};

const addStatusHistoryRecord = (state, action) => {
  const { record } = action.payload;

  return {
    ...state,
    [record.id]: record,
  };
};

const planStatusHistoryReducer = (state = {}, action) => {
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
