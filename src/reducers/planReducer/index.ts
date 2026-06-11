//
// MyRangeBC
//
// Copyright © 2018 Province of British Columbia
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
import schedulesReducer from './grazingSchedulesReducer';
import ministerIssuesReducer from './ministerIssuesReducer';
import confirmationsReducer from './confirmationsReducer';
import planStatusHistoryReducer from './planStatusHistoryReducer';
import additionalRequirementsReducer from './additionalRequirementsReducer';
import managementConsiderationsReducer from './managementConsiderationsReducer';
import type { PlansState, NormalizedPlan } from './plansReducer';
import type { PasturesState } from './pasturesReducer';
import type { PlantCommunitiesState } from './plantCommunitiesReducer';
import type { SchedulesState } from './grazingSchedulesReducer';
import type { MinisterIssuesState } from './ministerIssuesReducer';
import type { ConfirmationsState } from './confirmationsReducer';
import type { PlanStatusHistoryState } from './planStatusHistoryReducer';
import type { AdditionalRequirementsState } from './additionalRequirementsReducer';
import type { ManagementConsiderationsState } from './managementConsiderationsReducer';
import type { EntityMap , PlanStatusHistory, PlanConfirmation, Pasture, PlantCommunity, Schedule, MinisterIssue, AdditionalRequirement, ManagementConsideration } from '../../types';

export interface PlanReducerState {
  plans: PlansState;
  pastures: PasturesState;
  plantCommunities: PlantCommunitiesState;
  schedules: SchedulesState;
  ministerIssues: MinisterIssuesState;
  confirmations: ConfirmationsState;
  planStatusHistory: PlanStatusHistoryState;
  additionalRequirements: AdditionalRequirementsState;
  managementConsiderations: ManagementConsiderationsState;
}

// private selectors
export const getPlansMap = (state: PlanReducerState): EntityMap<NormalizedPlan> => state.plans.byId;
export const getPlanIds = (state: PlanReducerState): Array<string | number> => state.plans.allIds;
export const getPasturesMap = (state: PlanReducerState): EntityMap<Pasture> => state.pastures;
export const getPlantCommunitiesMap = (state: PlanReducerState): EntityMap<PlantCommunity> => state.plantCommunities;
export const getSchedulesMap = (state: PlanReducerState): EntityMap<Schedule> => state.schedules;
export const getMinisterIssuesMap = (state: PlanReducerState): EntityMap<MinisterIssue> => state.ministerIssues;
export const getConfirmationsMap = (state: PlanReducerState): EntityMap<PlanConfirmation> => state.confirmations;
export const getPlanStatusHistoryMap = (state: PlanReducerState): EntityMap<PlanStatusHistory> => state.planStatusHistory;
export const getAdditionalRequirementsMap = (state: PlanReducerState): EntityMap<AdditionalRequirement> => state.additionalRequirements;
export const getManagementConsiderationsMap = (state: PlanReducerState): EntityMap<ManagementConsideration> => state.managementConsiderations;

export default combineReducers({
  plans: plansReducer,
  pastures: pasturesReducer,
  plantCommunities: plantCommunitiesReducer,
  schedules: schedulesReducer,
  ministerIssues: ministerIssuesReducer,
  confirmations: confirmationsReducer,
  planStatusHistory: planStatusHistoryReducer,
  additionalRequirements: additionalRequirementsReducer,
  managementConsiderations: managementConsiderationsReducer,
});
