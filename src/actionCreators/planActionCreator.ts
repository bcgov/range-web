import { normalize } from 'normalizr';
import { success, request, error, storePlan } from '../actions';
import { UPDATE_PLAN_STATUS_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator';
import * as reducerTypes from '../constants/reducerTypes';
import * as API from '../constants/api';
import * as schema from './schema';
import {
  getPasturesMap,
  getSchedulesMap as getSchedulesMap,
  getMinisterIssuesMap,
  getReferences,
  getAdditionalRequirementsMap,
  getManagementConsiderationsMap,
  getPlantCommunitiesMap,
} from '../reducers/rootReducer';
import { REFERENCE_KEY, PLAN_STATUS, AMENDMENT_TYPE } from '../constants/variables';
import {
  axios,
  createConfigWithHeader,
  copyPlanToCreateAmendment,
  copyPasturesToCreateAmendment,
  normalizePasturesWithOldId,
  copySchedulesToCreateAmendment as copySchedulesToCreateAmendment,
  copyMinisterIssuesToCreateAmendment,
  copyInvasivePlantChecklistToCreateAmendment,
  copyManagementConsiderationsToCreateAmendment,
  copyAdditionalRequirementsToCreateAmendment,
  copyPlantCommunitiesToCreateAmendment,
  findStatusWithCode,
} from '../utils';
import { createRUPSchedule } from './grazingScheduleActionCreator';
import { createRUPPasture, createRUPPlantCommunityAndOthers } from './pastureActionCreator';
import { createRUPMinisterIssueAndActions } from './ministerIssueActionCreator';
import {
  createRUPManagementConsideration,
  createRUPAdditionalRequirement,
} from './requirementAndConsiderationActionCreator';
import type { AppThunk, AppDispatch } from '../configureStore';

export const createRUPInvasivePlantChecklist =
  (planId: string | number, invasivePlantChecklist: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    return axios
      .post(API.CREATE_RUP_INVASIVE_PLANT_CHECKLIST(planId), invasivePlantChecklist, createConfigWithHeader(getState))
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const updateRUPInvasivePlantChecklist =
  (planId: string | number, checklist: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const { id: checklistId, ...invasivePlantChecklist } = checklist;
    return axios
      .put(
        API.UPDATE_RUP_INVASIVE_PLANT_CHECKLIST(planId, checklistId),
        invasivePlantChecklist,
        createConfigWithHeader(getState),
      )
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const createOrUpdateRUPInvasivePlantChecklist =
  (planId: string | number, checklist: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch) => {
    if (checklist && checklist.id) {
      return dispatch(updateRUPInvasivePlantChecklist(planId, checklist));
    }
    return dispatch(createRUPInvasivePlantChecklist(planId, checklist));
  };

export const updateRUPConfirmation =
  (
    plan: any,
    user: any,
    confirmationId: string | number,
    confirmed: boolean,
    isMinorAmendment: boolean,
    isOwnSignature = true,
    isManualConfirmation = false,
  ): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    const { id: planId } = plan;
    const config = {
      ...createConfigWithHeader(getState),
      params: {
        isMinorAmendment,
      },
    };
    return axios
      .put(
        API.UPDATE_CONFIRMATION(planId, confirmationId),
        { confirmed, userId: user.id, isOwnSignature, isManualConfirmation },
        config,
      )
      .then(
        (response: any) => {
          return response.data;
        },
        (err: any) => {
          throw err;
        },
      );
  };

export const updateRUP =
  (planId: string | number, body: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    return axios.put(API.UPDATE_RUP(planId), body, createConfigWithHeader(getState)).then(
      (response: any) => {
        const updatedPlan = response.data;
        dispatch(storePlan(normalize(updatedPlan, schema.plan)));
        return updatedPlan;
      },
      (err: any) => {
        throw err;
      },
    );
  };

export const createRUP =
  (plan: any): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    return axios.post(API.CREATE_RUP, plan, createConfigWithHeader(getState)).then(
      (response: any) => {
        const newPlan = response.data;
        return newPlan;
      },
      (err: any) => {
        throw err;
      },
    );
  };

export const createAmendment =
  (plan: any): AppThunk<Promise<any>> =>
  (dispatch: AppDispatch, getState) => {
    dispatch(request(reducerTypes.CREATE_AMENDMENT));

    const makeRequest = async () => {
      try {
        const references = getReferences(getState());
        const pasturesMap = getPasturesMap(getState());
        const plantCommunitiesMap = getPlantCommunitiesMap(getState());
        const grazingSchedulesMap = getSchedulesMap(getState());
        const ministerIssuesMap = getMinisterIssuesMap(getState());
        const additionalRequirementsMap = getAdditionalRequirementsMap(getState());
        const managementConsiderationsMap = getManagementConsiderationsMap(getState());

        const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE] as Array<{ id: number; code: string }>;
        const createdStatus = findStatusWithCode(references, PLAN_STATUS.CREATED);
        const initialAmendment = amendmentTypes.find((at) => at.code === AMENDMENT_TYPE.INITIAL);

        const newPlan = copyPlanToCreateAmendment(plan, createdStatus!.id, initialAmendment!.id);
        const amendment = await dispatch(createRUP(newPlan));
        const { id: amendmentId } = amendment;

        const { pastures, plantCommunities: pcs } = copyPasturesToCreateAmendment(plan, pasturesMap);
        const newPastures = await Promise.all(pastures.map((p: any) => dispatch(createRUPPasture(amendmentId, p))));

        // create a normalized pasture ids map with the old pasture id as a key
        const newPastureIdsMap = normalizePasturesWithOldId(pastures, newPastures);

        const plantCommunities = copyPlantCommunitiesToCreateAmendment(
          pcs as unknown as (number | string)[],
          plantCommunitiesMap,
          newPastureIdsMap,
        );
        const newPlantCommunities = await Promise.all(
          plantCommunities.map((pc: any) => dispatch(createRUPPlantCommunityAndOthers(amendmentId, pc.pastureId, pc))),
        );

        const schedules = copySchedulesToCreateAmendment(plan, grazingSchedulesMap, newPastureIdsMap);
        const newSchedules = await Promise.all(
          schedules.map((gs: any) => dispatch(createRUPSchedule(amendmentId, gs))),
        );

        const ministerIssues = copyMinisterIssuesToCreateAmendment(plan, ministerIssuesMap, newPastureIdsMap);
        const newMinisterIssues = await Promise.all(
          ministerIssues.map((mi: any) => dispatch(createRUPMinisterIssueAndActions(amendmentId, mi))),
        );

        const invasivePlantChecklist = copyInvasivePlantChecklistToCreateAmendment(plan);
        const newInvasivePlantCheckList = await dispatch(
          createRUPInvasivePlantChecklist(amendmentId, invasivePlantChecklist),
        );

        const managementConsiderations = copyManagementConsiderationsToCreateAmendment(
          plan,
          managementConsiderationsMap,
        );
        const newManagementConsiderations = await Promise.all(
          managementConsiderations.map((mc: any) => dispatch(createRUPManagementConsideration(amendmentId, mc))),
        );

        const additionalRequirements = copyAdditionalRequirementsToCreateAmendment(plan, additionalRequirementsMap);
        const newAdditionalRequirements = await Promise.all(
          additionalRequirements.map((ar: any) => dispatch(createRUPAdditionalRequirement(amendmentId, ar))),
        );

        // successfully finish uploading so make this amendment visible!
        await dispatch(updateRUP(amendmentId, { uploaded: true }));

        const newAmendment = {
          ...amendment,
          pastures: newPastures,
          schedules: newSchedules,
          ministerIssues: newMinisterIssues,
          invasivePlantChecklist: newInvasivePlantCheckList,
          managementConsiderations: newManagementConsiderations,
          additionalRequirements: newAdditionalRequirements,
          plantCommunities: newPlantCommunities,
        };

        dispatch(success(reducerTypes.CREATE_AMENDMENT, newAmendment));
        return newAmendment;
      } catch (err) {
        dispatch(error(reducerTypes.CREATE_AMENDMENT, err));
        dispatch(toastErrorMessage(err));
        throw err;
      }
    };

    return makeRequest();
  };

export const updateRUPStatus =
  ({
    planId,
    statusId,
    note = null,
    shouldToast = true,
  }: {
    planId: string | number;
    statusId: string | number;
    note?: string | null;
    shouldToast?: boolean;
  }): AppThunk<Promise<any>> =>
  (dispatch, getState) => {
    dispatch(request(reducerTypes.UPDATE_PLAN_STATUS));
    const makeRequest = async () => {
      try {
        const response = await axios.put(
          API.UPDATE_PLAN_STATUS(planId),
          { statusId, note },
          createConfigWithHeader(getState),
        );
        dispatch(success(reducerTypes.UPDATE_PLAN_STATUS, response.data));
        if (shouldToast) {
          dispatch(toastSuccessMessage(UPDATE_PLAN_STATUS_SUCCESS));
        }
        return response.data;
      } catch (err) {
        dispatch(error(reducerTypes.UPDATE_PLAN_STATUS, err));
        if (shouldToast) {
          dispatch(toastErrorMessage(err));
        }
        throw err;
      }
    };
    return makeRequest();
  };
