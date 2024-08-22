//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Kyubin Han.
//

import { combineReducers } from 'redux';
import plansReducer from './plansReducer';
import pasturesReducer from './pasturesReducer';
import plantCommunitiesReducer from './plantCommunitiesReducer';
import grazingSchedulesReducer from './grazingSchedulesReducer';
import ministerIssuesReducer from './ministerIssuesReducer';
import confirmationsReducer from './confirmationsReducer';
import planStatusHistoryReducer from './planStatusHistoryReducer';
import additionalRequirementsReducer from './additionalRequirementsReducer';
import managementConsiderationsReducer from './managementConsiderationsReducer';

// private selectors
export const getPlansMap = (state) => state.plans.byId;
export const getPlanIds = (state) => state.plans.allIds;
export const getPasturesMap = (state) => state.pastures;
export const getPlantCommunitiesMap = (state) => state.plantCommunities;
export const getGrazingSchedulesMap = (state) => state.grazingSchedules;
export const getMinisterIssuesMap = (state) => state.ministerIssues;
export const getConfirmationsMap = (state) => state.confirmations;
export const getPlanStatusHistoryMap = (state) => state.planStatusHistory;
export const getAdditionalRequirementsMap = (state) => state.additionalRequirements;
export const getManagementConsiderationsMap = (state) => state.managementConsiderations;

export default combineReducers({
  plans: plansReducer,
  pastures: pasturesReducer,
  plantCommunities: plantCommunitiesReducer,
  grazingSchedules: grazingSchedulesReducer,
  ministerIssues: ministerIssuesReducer,
  confirmations: confirmationsReducer,
  planStatusHistory: planStatusHistoryReducer,
  additionalRequirements: additionalRequirementsReducer,
  managementConsiderations: managementConsiderationsReducer,
});
