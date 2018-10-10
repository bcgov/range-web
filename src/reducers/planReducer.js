import { combineReducers } from 'redux';
import plansReducer from './plansReducer';
import pasturesReducer from './pasturesReducer';
import grazingSchedulesReducer from './grazingSchedulesReducer';
import ministerIssuesReducer from './ministerIssuesReducer';
import confirmationsReducer from './confirmationsReducer';
import planStatusHistoryReducer from './planStatusHistoryReducer';

// private selectors
export const getPlansMap = state => state.plans.byId;
export const getPlanIds = state => state.plans.allIds;
export const getPasturesMap = state => state.pastures;
export const getGrazingSchedulesMap = state => state.grazingSchedules;
export const getMinisterIssuesMap = state => state.ministerIssues;
export const getConfirmationsMap = state => state.confirmations;
export const getPlanStatusHistoryMap = state => state.planStatusHistory;

export default combineReducers({
  plans: plansReducer,
  pastures: pasturesReducer,
  grazingSchedules: grazingSchedulesReducer,
  ministerIssues: ministerIssuesReducer,
  confirmations: confirmationsReducer,
  planStatusHistory: planStatusHistoryReducer,
});
