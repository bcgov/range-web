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
import * as reducerTypes from '../constants/reducerTypes';
import { SIGN_OUT } from '../constants/actionTypes';
import agreementReducer, * as fromAgreement from './agreementReducer';
import networkReducer, * as fromNetwork from './networkReducer';
import authReducer, * as fromAuth from './authReducer';
import planReducer, * as fromPlan from './planReducer';
import commonStoreReducer, * as fromCommonStore from './commonStoreReducer';
import clientReducer, * as fromClient from './clientReducer';
import toastReducer, * as fromToast from './toastReducer';
import agreementWithALLPlansReducer, * as fromAgreementWithAllPlans from './agreementWithALLPlansReducer';
import modalReducer, * as fromModalReducer from './modalReducer';

// createReducer to allow for reducer reuse
const createReducer = (reducer, name) => (state, action) => {
  if (name !== action.name && state !== undefined) {
    return state;
  }
  return reducer(state, action);
};

const appReducer = combineReducers({
  [reducerTypes.AUTH]: authReducer,
  [reducerTypes.TOAST]: toastReducer,
  [reducerTypes.COMMON]: commonStoreReducer,
  [reducerTypes.AGREEMENTS]: agreementReducer,
  [reducerTypes.AGREEMENTS_WITH_ALL_PLANS]: agreementWithALLPlansReducer,
  [reducerTypes.PLAN]: planReducer,
  [reducerTypes.CLIENT]: clientReducer,
  [reducerTypes.MODAL]: modalReducer,
  [reducerTypes.SEARCH_AGREEMENTS]: createReducer(networkReducer, reducerTypes.SEARCH_AGREEMENTS),
  [reducerTypes.GET_PLAN]: createReducer(networkReducer, reducerTypes.GET_PLAN),
  [reducerTypes.GET_PLAN_PDF]: createReducer(networkReducer, reducerTypes.GET_PLAN_PDF),
  [reducerTypes.UPDATE_USER_ID_OF_ZONE]: createReducer(networkReducer, reducerTypes.UPDATE_USER_ID_OF_ZONE),
  [reducerTypes.UPDATE_AGREEMENT_ZONE]: createReducer(networkReducer, reducerTypes.UPDATE_AGREEMENT_ZONE),
  [reducerTypes.SEARCH_CLIENTS]: createReducer(networkReducer, reducerTypes.SEARCH_CLIENTS),
  [reducerTypes.UPDATE_CLIENT_ID_OF_USER]: createReducer(networkReducer, reducerTypes.UPDATE_CLIENT_ID_OF_USER),
  [reducerTypes.UPDATE_PLAN_STATUS]: createReducer(networkReducer, reducerTypes.UPDATE_PLAN_STATUS),
  [reducerTypes.DELETE_GRAZING_SCHEUDLE]: createReducer(networkReducer, reducerTypes.DELETE_GRAZING_SCHEUDLE),
  [reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY]: createReducer(networkReducer, reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY),
  [reducerTypes.DELETE_MINISTER_ISSUE_ACTION]: createReducer(networkReducer, reducerTypes.DELETE_MINISTER_ISSUE_ACTION),
  [reducerTypes.DELETE_MANAGEMENT_CONSIDERATION]: createReducer(networkReducer, reducerTypes.DELETE_MANAGEMENT_CONSIDERATION),
  [reducerTypes.GET_USER]: createReducer(networkReducer, reducerTypes.GET_USER),
  [reducerTypes.UPDATE_USER]: createReducer(networkReducer, reducerTypes.UPDATE_USER),
  [reducerTypes.GET_AGREEMENT]: createReducer(networkReducer, reducerTypes.GET_AGREEMENT),
  [reducerTypes.CREATE_AMENDMENT]: createReducer(networkReducer, reducerTypes.CREATE_AMENDMENT),
  [reducerTypes.GET_ZONES]: createReducer(networkReducer, reducerTypes.GET_ZONES),
  [reducerTypes.GET_USERS]: createReducer(networkReducer, reducerTypes.GET_USERS),
});

const rootReducer = (state, action) => {
  // reset the state of a Redux store when users sign out
  if (action.type === SIGN_OUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;

// public selectors
export const getAgreements = state => fromAgreement.getAgreements(state[reducerTypes.AGREEMENTS]);
export const getAgreementIds = state => fromAgreement.getAgreementIds(state[reducerTypes.AGREEMENTS]);
export const getAgreementSearchParams = state => fromAgreement.getAgreementSearchParams(state[reducerTypes.AGREEMENTS]);
export const getAgreementsMap = state => fromAgreement.getAgreementsMap(state[reducerTypes.AGREEMENTS]);
export const getAgreementsPagination = state => fromNetwork.getPagination(state[reducerTypes.SEARCH_AGREEMENTS]);
export const getIsFetchingAgreements = state => fromNetwork.getIsFetching(state[reducerTypes.SEARCH_AGREEMENTS]);
export const getAgreementsErrorOccured = state => fromNetwork.getErrorOccured(state[reducerTypes.SEARCH_AGREEMENTS]);
export const getIsUpdatingAgreementZone = state => fromNetwork.getIsFetching(state[reducerTypes.UPDATE_AGREEMENT_ZONE]);

export const getAgreementsMapWithAllPlan = state => fromAgreementWithAllPlans.getAgreementsMap(state[reducerTypes.AGREEMENTS_WITH_ALL_PLANS]);
export const getIsFetchingAgreementWithAllPlan = state => fromNetwork.getIsFetching(state[reducerTypes.GET_AGREEMENT]);
export const getAgreementsMapWithAllPlanErrorOccured = state => fromNetwork.getErrorOccured(state[reducerTypes.GET_AGREEMENT]);
export const getIsCreatingAmendment = state => fromNetwork.getIsFetching(state[reducerTypes.CREATE_AMENDMENT]);

export const getAuthData = state => fromAuth.getAuthData(state[reducerTypes.AUTH]);
export const getUser = state => fromAuth.getUser(state[reducerTypes.AUTH]);
export const getToken = state => fromAuth.getToken(state[reducerTypes.AUTH]);
export const getReAuthRequired = state => fromAuth.getReAuthRequired(state[reducerTypes.AUTH]);
export const getAuthTimeout = state => fromAuth.getAuthTimeout(state[reducerTypes.AUTH]);
export const getIsFetchingUser = state => fromNetwork.getIsFetching(state[reducerTypes.GET_USER]);
export const getFetchingUserErrorResponse = state => fromNetwork.getErrorResponse(state[reducerTypes.GET_USER]);
export const getFetchingUserErrorOccured = state => fromNetwork.getErrorOccured(state[reducerTypes.GET_USER]);
export const getIsUpdatingUser = state => fromNetwork.getIsFetching(state[reducerTypes.UPDATE_USER]);
export const getUpdatingUserErrorOccured = state => fromNetwork.getErrorOccured(state[reducerTypes.UPDATE_USER]);

export const getZones = state => fromCommonStore.getZones(state[reducerTypes.COMMON]);
export const getZonesMap = state => fromCommonStore.getZonesMap(state[reducerTypes.COMMON]);
export const getReferences = state => fromCommonStore.getReferences(state[reducerTypes.COMMON]);
export const getUsers = state => fromCommonStore.getUsers(state[reducerTypes.COMMON]);
export const getUsersMap = state => fromCommonStore.getUsersMap(state[reducerTypes.COMMON]);
export const getIsUpdatingUserIdOfZone = state => fromNetwork.getIsFetching(state[reducerTypes.UPDATE_USER_ID_OF_ZONE]);

export const getClients = state => fromClient.getClients(state[reducerTypes.CLIENT]);
export const getClientsMap = state => fromClient.getClientsMap(state[reducerTypes.CLIENT]);
export const getIsFetchingClients = state => fromNetwork.getIsFetching(state[reducerTypes.SEARCH_CLIENTS]);
export const getIsUpdatingClientIdOfUser = state => fromNetwork.getIsFetching(state[reducerTypes.UPDATE_CLIENT_ID_OF_USER]);

export const getPlansMap = state => fromPlan.getPlansMap(state[reducerTypes.PLAN]);
export const getPlanIds = state => fromPlan.getPlanIds(state[reducerTypes.PLAN]);
export const getIsFetchingPlan = state => fromNetwork.getIsFetching(state[reducerTypes.GET_PLAN]);
export const getPlanErrorOccured = state => fromNetwork.getErrorOccured(state[reducerTypes.GET_PLAN]);

export const getIsFetchingPlanPDF = state => fromNetwork.getIsFetching(state[reducerTypes.GET_PLAN_PDF]);
export const getPlanPDFErrorOccured = state => fromNetwork.getErrorOccured(state[reducerTypes.GET_PLAN_PDF]);
export const getPlanPDF = state => fromNetwork.getData(state[reducerTypes.GET_PLAN_PDF]);

export const getConfirmationsMap = state => fromPlan.getConfirmationsMap(state[reducerTypes.PLAN]);
export const getPasturesMap = state => fromPlan.getPasturesMap(state[reducerTypes.PLAN]);
export const getPlantCommunitiesMap = state => fromPlan.getPlantCommunitiesMap(state[reducerTypes.PLAN]);
export const getGrazingSchedulesMap = state => fromPlan.getGrazingSchedulesMap(state[reducerTypes.PLAN]);
export const getMinisterIssuesMap = state => fromPlan.getMinisterIssuesMap(state[reducerTypes.PLAN]);
export const getPlanStatusHistoryMap = state => fromPlan.getPlanStatusHistoryMap(state[reducerTypes.PLAN]);
export const getAdditionalRequirementsMap = state => fromPlan.getAdditionalRequirementsMap(state[reducerTypes.PLAN]);
export const getManagementConsiderationsMap = state => fromPlan.getManagementConsiderationsMap(state[reducerTypes.PLAN]);

export const getIsDeletingGrazingSchedule = state => fromNetwork.getIsFetching(state[reducerTypes.DELETE_GRAZING_SCHEUDLE]);
export const getIsDeletingGrazingScheduleEntry = state => fromNetwork.getIsFetching(state[reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY]);
export const getIsUpdatingPlanStatus = state => fromNetwork.getIsFetching(state[reducerTypes.UPDATE_PLAN_STATUS]);

export const getToastsMap = state => fromToast.getToastsMap(state[reducerTypes.TOAST]);
export const getConfirmationModalsMap = state => fromModalReducer.getConfirmationModalsMap(state[reducerTypes.MODAL]);
export const getInputModal = state => fromModalReducer.getInputModal(state[reducerTypes.MODAL]);
export const getIsPiaModalOpen = state => fromModalReducer.getIsPiaModalOpen(state[reducerTypes.MODAL]);
