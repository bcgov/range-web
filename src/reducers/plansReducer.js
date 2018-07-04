import { STORE_PLAN, UPDATE_PLAN, ADD_GRAZING_SCHEDULE } from '../constants/actionTypes';

const storePlan = (state, action) => {
  const { entities, result: planId } = action.payload;
  const {
    plans: plan,
  } = entities;
  const handlePlanIds = (state, planId) => {
    if (state.allIds.find(id => id === planId)) {
      return [...state.allIds];
    }
    return [...state.allIds, planId];
  };

  return {
    byId: {
      ...state.byId,
      ...plan,
    },
    allIds: handlePlanIds(state, planId),
  };
};

const updatePlan = (state, action) => {
  const plan = { ...action.payload };
  return {
    ...state,
    byId: {
      ...state.byId,
      [plan.id]: plan,
    },
  };
};

const addGrazingSchedule = (state, action) => {
  const { planId, grazingSchedules } = action.payload;
  const plan = {
    ...state.byId[planId],
    grazingSchedules,
  };

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId]: plan,
    },
  };
};

const plansReducer = (state = {
  byId: {},
  allIds: [],
}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlan(state, action);
    case UPDATE_PLAN:
      return updatePlan(state, action);
    case ADD_GRAZING_SCHEDULE:
      return addGrazingSchedule(state, action);
    default:
      return state;
  }
};

export default plansReducer;
