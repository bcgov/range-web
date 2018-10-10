import { STORE_PLAN, ADD_PLAN_STATUS_HISTORY_RECORD } from '../constants/actionTypes';

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
    case ADD_PLAN_STATUS_HISTORY_RECORD:
      return addStatusHistoryRecord(state, action);
    default:
      return state;
  }
};

export default planStatusHistoryReducer;
