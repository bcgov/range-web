import { STORE_PLAN } from '../constants/actionTypes';

const initialState = {
  plans: {},
  planIds: [],
  pastures: {},
  grazingSchedules: {},
  grazingScheduleEntries: {},
  ministerIssues: {},
};

const storePlan = (state, action) => {
  const { entities, result: planId } = action.payload;
  const {
    plans: plan,
    pastures,
    grazingSchedules,
    grazingScheduleEntries,
    ministerIssues,
  } = entities;
  const handlePlanIds = (state, planId) => {
    if (state.planIds.find(id => id === planId)) {
      return [...state.planIds];
    }
    return [...state.planIds, planId];
  };

  return {
    plans: {
      ...state.plans,
      ...plan,
    },
    planIds: handlePlanIds(state, planId),
    pastures: {
      ...state.pastures,
      ...pastures,
    },
    grazingSchedules: {
      ...state.grazingSchedules,
      ...grazingSchedules,
    },
    grazingScheduleEntries: {
      ...state.grazingScheduleEntries,
      ...grazingScheduleEntries,
    },
    ministerIssues: {
      ...state.ministerIssues,
      ...ministerIssues,
    },
  };
};

const planReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlan(state, action);
    default:
      return state;
  }
};

export default planReducer;
