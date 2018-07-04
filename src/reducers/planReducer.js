import { combineReducers } from 'redux';
import plansReducer from './plansReducer';
import pasturesReducer from './pasturesReducer';
import grazingSchedulesReducer from './grazingSchedulesReducer';
import grazingScheduleEntriesReducer from './grazingScheduleEntriesReducer';
import ministerIssuesReducer from './ministerIssuesReducer';

// private selectors
export const getPlansMap = state => state.plans.byId;
export const getPlanIds = state => state.plans.allIds;
export const getPasturesMap = state => state.pastures.byId;
export const getGrazingSchedulesMap = state => state.grazingSchedules.byId;
// export const getGrazingScheduleEntriesMap = state => state.grazingScheduleEntries.byId;
export const getMinisterIssuesMap = state => state.ministerIssues.byId;

export default combineReducers({
  plans: plansReducer,
  pastures: pasturesReducer,
  grazingSchedules: grazingSchedulesReducer,
  // grazingScheduleEntries: grazingScheduleEntriesReducer,
  ministerIssues: ministerIssuesReducer,
});
