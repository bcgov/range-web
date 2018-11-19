import { combineReducers } from 'redux';
import plansReducer from './plansReducer';
import pasturesReducer from './pasturesReducer';
import grazingSchedulesReducer from './grazingSchedulesReducer';
import ministerIssuesReducer from './ministerIssuesReducer';
import confirmationsReducer from './confirmationsReducer';
import planStatusHistoryReducer from './planStatusHistoryReducer';
import additionalRequirementsReducer from './additionalRequirementsReducer';
import managementConsiderationsReducer from './managementConsiderationsReducer';

// private selectors
export const getPlansMap = state => state.plans.byId;
export const getPlanIds = state => state.plans.allIds;
export const getPasturesMap = state => state.pastures;
export const getGrazingSchedulesMap = state => state.grazingSchedules;
export const getMinisterIssuesMap = state => state.ministerIssues;
export const getConfirmationsMap = state => state.confirmations;
export const getPlanStatusHistoryMap = state => state.planStatusHistory;
export const getAdditionalRequirementsMap = state => state.additionalRequirements;
export const getManagementConsiderationsMap = state => state.managementConsiderations;

export default combineReducers({
  plans: plansReducer,
  pastures: pasturesReducer,
  grazingSchedules: grazingSchedulesReducer,
  ministerIssues: ministerIssuesReducer,
  confirmations: confirmationsReducer,
  planStatusHistory: planStatusHistoryReducer,
  additionalRequirements: additionalRequirementsReducer,
  managementConsiderations: managementConsiderationsReducer,
});
