import {
  STORE_PLAN,
  PLAN_UPDATED,
  GRAZING_SCHEDULE_ADDED,
  GRAZING_SCHEDULE_DELETED,
  PLAN_STATUS_HISTORY_RECORD_ADDED,
  MANAGEMENT_CONSIDERATION_ADDED,
  MANAGEMENT_CONSIDERATION_DELETED,
} from '../../constants/actionTypes';

const initialState = {
  byId: {},
  allIds: [],
};

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
  const { plan } = action.payload;
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

const deleteGrazingSchedule = (state, action) => {
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

const addPlanStatusHistoryRecord = (state, action) => {
  const { planId, planStatusHistory } = action.payload;
  const plan = {
    ...state.byId[planId],
    planStatusHistory,
  };

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId]: plan,
    },
  };
};

const addManagementConsideration = (state, action) => {
  const { planId, managementConsideration } = action.payload;
  const plan = { ...state.byId[planId] };
  plan.managementConsiderations = [
    ...plan.managementConsiderations,
    managementConsideration.id,
  ];

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId]: plan,
    },
  };
};

const deleteManagementConsideration = (state, action) => {
  const { planId, considerationId } = action.payload;
  const plan = { ...state.byId[planId] };
  plan.managementConsiderations = plan.managementConsiderations.filter(c => c !== considerationId);

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId]: plan,
    },
  };
};

const plansReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlan(state, action);
    case PLAN_UPDATED:
      return updatePlan(state, action);
    case GRAZING_SCHEDULE_ADDED:
      return addGrazingSchedule(state, action);
    case GRAZING_SCHEDULE_DELETED:
      return deleteGrazingSchedule(state, action);
    case PLAN_STATUS_HISTORY_RECORD_ADDED:
      return addPlanStatusHistoryRecord(state, action);
    case MANAGEMENT_CONSIDERATION_ADDED:
      return addManagementConsideration(state, action);
    case MANAGEMENT_CONSIDERATION_DELETED:
      return deleteManagementConsideration(state, action);
    default:
      return state;
  }
};

export default plansReducer;
