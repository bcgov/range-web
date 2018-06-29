import { cloneDeep } from 'lodash';
import { STORE_PLAN, UPDATE_PLAN } from '../constants/actionTypes';

const initialState = {
  plans: {},
  planIds: [],
  pastures: {},
  grazingSchedules: {},
  grazingScheduleEntries: {},
  ministerIssues: {},
};

const storePlans = (state, action) => {
  const { entities, result: planId } = action.payload;
  const {
    plans,
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
      ...plans,
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

const updatePlan = (state, action) => {
  const plan = cloneDeep(action.payload);
  return {
    ...state,
    plans: {
      ...state.plans,
      [plan.id]: plan,
    },
  };
};

// const addGrazingSchedule = (state, action) => {
//   const schedule = cloneDeep(action.payload);
//   return {
//     ...state,
//     grazingSchedules: {
//       ...state.grazingSchedules,
//       [schedule.id]: schedule,
//     },
//   };
// };

// const deleteGrazingSchedule = (state, action) => {
//   return {
//     ...state,
//   }
// }
// const grazingScheduleReducer = (state = { grazingSchedules: {} }, action) => {
//   switch (action.type) {
//     case STORE_PLAN:
//       return state;
//     case ADD_GRAZING_SCHEDULE:
//       return state;
//     default:
//       return state;
//   }
// };
const planReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlans(state, action);
    case UPDATE_PLAN:
      return updatePlan(state, action);
    default:
      return state;
  }
};

export const getPlansMap = state => state.plans;
export const getPlanIds = state => state.planIds;
export const getPasturesMap = state => state.pastures;
export const getGrazingSchedulesMap = state => state.grazingSchedules;
export const getGrazingScheduleEntriesMap = state => state.grazingScheduleEntries;
export const getMinisterIssuesMap = state => state.ministerIssues;

export default planReducer;
