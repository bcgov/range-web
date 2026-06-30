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

import { combineReducers, AnyAction, Reducer } from 'redux';
import * as reducerTypes from '../constants/reducerTypes';
import { SIGN_OUT } from '../constants/actionTypes';
import agreementReducer from './agreementReducer';
import networkReducer, * as fromNetwork from './networkReducer';
import authReducer, * as fromAuth from './authReducer';
import planReducer, * as fromPlan from './planReducer';
import commonStoreReducer, * as fromCommonStore from './commonStoreReducer';
import clientReducer from './clientReducer';
import toastReducer, * as fromToast from './toastReducer';
import modalReducer, * as fromModalReducer from './modalReducer';
import type {
  NetworkState,
  EntityMap,
  User,
  Pasture,
  PlantCommunity,
  Schedule,
  MinisterIssue,
  AdditionalRequirement,
  ManagementConsideration,
} from '../types';
import type { References } from './commonStoreReducer';
import type { ToastState } from './toastReducer';
import type { ConfirmationModal, InputModal } from './modalReducer';

// createReducer to allow for reducer reuse
const createReducer =
  (reducer: Reducer<NetworkState, AnyAction>, name: string) =>
  (state: NetworkState | undefined, action: AnyAction): NetworkState => {
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
  [reducerTypes.PLAN]: planReducer,
  [reducerTypes.CLIENT]: clientReducer,
  [reducerTypes.MODAL]: modalReducer,
  [reducerTypes.SEARCH_AGREEMENTS]: createReducer(networkReducer, reducerTypes.SEARCH_AGREEMENTS),
  [reducerTypes.GET_PLAN]: createReducer(networkReducer, reducerTypes.GET_PLAN),
  [reducerTypes.SEARCH_CLIENTS]: createReducer(networkReducer, reducerTypes.SEARCH_CLIENTS),
  [reducerTypes.UPDATE_CLIENT_ID_OF_USER]: createReducer(networkReducer, reducerTypes.UPDATE_CLIENT_ID_OF_USER),
  [reducerTypes.UPDATE_PLAN_STATUS]: createReducer(networkReducer, reducerTypes.UPDATE_PLAN_STATUS),
  [reducerTypes.CREATE_PASTURE]: createReducer(networkReducer, reducerTypes.CREATE_PASTURE),
  [reducerTypes.DELETE_SCHEUDLE]: createReducer(networkReducer, reducerTypes.DELETE_SCHEUDLE),
  [reducerTypes.DELETE_SCHEUDLE_ENTRY]: createReducer(networkReducer, reducerTypes.DELETE_SCHEUDLE_ENTRY),
  [reducerTypes.DELETE_MANAGEMENT_CONSIDERATION]: createReducer(
    networkReducer,
    reducerTypes.DELETE_MANAGEMENT_CONSIDERATION,
  ),
  [reducerTypes.GET_USER]: createReducer(networkReducer, reducerTypes.GET_USER),
  [reducerTypes.UPDATE_USER]: createReducer(networkReducer, reducerTypes.UPDATE_USER),
  [reducerTypes.CREATE_AMENDMENT]: createReducer(networkReducer, reducerTypes.CREATE_AMENDMENT),
  [reducerTypes.GET_ZONES]: createReducer(networkReducer, reducerTypes.GET_ZONES),
  [reducerTypes.GET_USERS]: createReducer(networkReducer, reducerTypes.GET_USERS),
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: RootState | undefined, action: AnyAction): RootState => {
  // reset the state of a Redux store when users sign out
  if (action.type === SIGN_OUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;

// public selectors
export const getUser = (state: RootState): User | undefined => fromAuth.getUser(state[reducerTypes.AUTH]);
export const getToken = (state: RootState): string | undefined => fromAuth.getToken(state[reducerTypes.AUTH]);
export const getReAuthRequired = (state: RootState): boolean => fromAuth.getReAuthRequired(state[reducerTypes.AUTH]);
export const getAuthTimeout = (state: RootState): Record<string, ReturnType<typeof setTimeout>> =>
  fromAuth.getAuthTimeout(state[reducerTypes.AUTH]);
export const getIsFetchingUser = (state: RootState): boolean => fromNetwork.getIsFetching(state[reducerTypes.GET_USER]);
export const getFetchingUserErrorResponse = (state: RootState): unknown =>
  fromNetwork.getErrorResponse(state[reducerTypes.GET_USER]);
export const getFetchingUserErrorOccured = (state: RootState): boolean =>
  fromNetwork.getErrorOccured(state[reducerTypes.GET_USER]);
export const getIsUpdatingUser = (state: RootState): boolean =>
  fromNetwork.getIsFetching(state[reducerTypes.UPDATE_USER]);
export const getUpdatingUserErrorOccured = (state: RootState): boolean =>
  fromNetwork.getErrorOccured(state[reducerTypes.UPDATE_USER]);

export const getReferences = (state: RootState): References =>
  fromCommonStore.getReferences(state[reducerTypes.COMMON]);
export const getPasturesMap = (state: RootState): EntityMap<Pasture> =>
  fromPlan.getPasturesMap(state[reducerTypes.PLAN]);
export const getPlantCommunitiesMap = (state: RootState): EntityMap<PlantCommunity> =>
  fromPlan.getPlantCommunitiesMap(state[reducerTypes.PLAN]);
export const getSchedulesMap = (state: RootState): EntityMap<Schedule> =>
  fromPlan.getSchedulesMap(state[reducerTypes.PLAN]);
export const getMinisterIssuesMap = (state: RootState): EntityMap<MinisterIssue> =>
  fromPlan.getMinisterIssuesMap(state[reducerTypes.PLAN]);
export const getAdditionalRequirementsMap = (state: RootState): EntityMap<AdditionalRequirement> =>
  fromPlan.getAdditionalRequirementsMap(state[reducerTypes.PLAN]);
export const getManagementConsiderationsMap = (state: RootState): EntityMap<ManagementConsideration> =>
  fromPlan.getManagementConsiderationsMap(state[reducerTypes.PLAN]);

export const getIsUpdatingPlanStatus = (state: RootState): boolean =>
  fromNetwork.getIsFetching(state[reducerTypes.UPDATE_PLAN_STATUS]);

export const getToastsMap = (state: RootState): ToastState => fromToast.getToastsMap(state[reducerTypes.TOAST]);
export const getConfirmationModalsMap = (state: RootState): Record<string, ConfirmationModal> =>
  fromModalReducer.getConfirmationModalsMap(state[reducerTypes.MODAL]);
export const getInputModal = (state: RootState): InputModal | null =>
  fromModalReducer.getInputModal(state[reducerTypes.MODAL]);
export const getIsPiaModalOpen = (state: RootState): boolean =>
  fromModalReducer.getIsPiaModalOpen(state[reducerTypes.MODAL]);
