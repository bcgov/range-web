import { normalize } from 'normalizr'
import { success, request, error, storePlan } from '../actions'
import {
  UPDATE_PLAN_STATUS_SUCCESS,
  UPDATE_AGREEMENT_ZONE_SUCCESS
} from '../constants/strings'
import { toastSuccessMessage, toastErrorMessage } from './toastActionCreator'
import * as reducerTypes from '../constants/reducerTypes'
import * as API from '../constants/api'
import * as schema from './schema'
import {
  getPasturesMap,
  getGrazingSchedulesMap,
  getMinisterIssuesMap,
  getReferences,
  getAdditionalRequirementsMap,
  getManagementConsiderationsMap,
  getPlantCommunitiesMap
} from '../reducers/rootReducer'
import {
  REFERENCE_KEY,
  PLAN_STATUS,
  AMENDMENT_TYPE
} from '../constants/variables'
import {
  axios,
  createConfigWithHeader,
  copyPlanToCreateAmendment,
  copyPasturesToCreateAmendment,
  normalizePasturesWithOldId,
  copyGrazingSchedulesToCreateAmendment,
  copyMinisterIssuesToCreateAmendment,
  copyInvasivePlantChecklistToCreateAmendment,
  copyManagementConsiderationsToCreateAmendment,
  copyAdditionalRequirementsToCreateAmendment,
  copyPlantCommunitiesToCreateAmendment,
  findStatusWithCode
} from '../utils'
import { createRUPGrazingSchedule } from './grazingScheduleActionCreator'
import {
  createRUPPasture,
  createRUPPlantCommunityAndOthers
} from './pastureActionCreator'
import { createRUPMinisterIssueAndActions } from './ministerIssueActionCreator'
import {
  createRUPManagementConsideration,
  createRUPAdditionalRequirement
} from './requirementAndConsiderationActionCreator'

export const createRUPInvasivePlantChecklist = (
  planId,
  invasivePlantChecklist
) => (dispatch, getState) => {
  return axios
    .post(
      API.CREATE_RUP_INVASIVE_PLANT_CHECKLIST(planId),
      invasivePlantChecklist,
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        return response.data
      },
      err => {
        throw err
      }
    )
}

export const updateRUPInvasivePlantChecklist = (
  planId,
  { id: checklistId, ...invasivePlantChecklist }
) => (dispatch, getState) => {
  return axios
    .put(
      API.UPDATE_RUP_INVASIVE_PLANT_CHECKLIST(planId, checklistId),
      invasivePlantChecklist,
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        return response.data
      },
      err => {
        throw err
      }
    )
}

export const createOrUpdateRUPInvasivePlantChecklist = (
  planId,
  checklist
) => dispatch => {
  if (checklist && checklist.id) {
    return dispatch(updateRUPInvasivePlantChecklist(planId, checklist))
  }
  return dispatch(createRUPInvasivePlantChecklist(planId, checklist))
}

export const createRUPStatusRecord = (plan, newStatus, note) => (
  dispatch,
  getState
) => {
  const { id: planId, statusId: fromPlanStatusId } = plan

  return axios
    .post(
      API.CREATE_RUP_STATUS_RECORD(planId),
      {
        fromPlanStatusId,
        toPlanStatusId: newStatus.id,
        note
      },
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        return response.data
      },
      err => {
        dispatch(toastErrorMessage(err))
        throw err
      }
    )
}

export const updateRUPConfirmation = (
  plan,
  user,
  confirmationId,
  confirmed,
  isMinorAmendment,
  isOwnSignature = true
) => (dispatch, getState) => {
  const { id: planId } = plan
  const config = {
    ...createConfigWithHeader(getState),
    params: {
      isMinorAmendment
    }
  }

  return axios
    .put(
      API.UPDATE_CONFIRMATION(planId, confirmationId),
      { confirmed, userId: user.id, isOwnSignature },
      config
    )
    .then(
      response => {
        return response.data
      },
      err => {
        throw err
      }
    )
}

export const updateRUP = (planId, body) => (dispatch, getState) => {
  return axios
    .put(API.UPDATE_RUP(planId), body, createConfigWithHeader(getState))
    .then(
      response => {
        const updatedPlan = response.data
        dispatch(storePlan(normalize(updatedPlan, schema.plan)))
        return updatedPlan
      },
      err => {
        throw err
      }
    )
}

export const createRUP = plan => (dispatch, getState) => {
  return axios
    .post(API.CREATE_RUP, plan, createConfigWithHeader(getState))
    .then(
      response => {
        const newPlan = response.data
        return newPlan
      },
      err => {
        throw err
      }
    )
}

export const createAmendment = plan => (dispatch, getState) => {
  dispatch(request(reducerTypes.CREATE_AMENDMENT))

  const makeRequest = async () => {
    try {
      const references = getReferences(getState())
      const pasturesMap = getPasturesMap(getState())
      const plantCommunitiesMap = getPlantCommunitiesMap(getState())
      const grazingSchedulesMap = getGrazingSchedulesMap(getState())
      const ministerIssuesMap = getMinisterIssuesMap(getState())
      const additionalRequirementsMap = getAdditionalRequirementsMap(getState())
      const managementConsiderationsMap = getManagementConsiderationsMap(
        getState()
      )

      const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
      const createdStatus = findStatusWithCode(references, PLAN_STATUS.CREATED)
      const initialAmendment = amendmentTypes.find(
        at => at.code === AMENDMENT_TYPE.INITIAL
      )

      const newPlan = copyPlanToCreateAmendment(
        plan,
        createdStatus.id,
        initialAmendment.id
      )
      const amendment = await dispatch(createRUP(newPlan))
      const { id: amendmentId } = amendment

      const { pastures, plantCommunities: pcs } = copyPasturesToCreateAmendment(
        plan,
        pasturesMap
      )
      const newPastures = await Promise.all(
        pastures.map(p => dispatch(createRUPPasture(amendmentId, p)))
      )

      // create a normalized pasture ids map with the old pasture id as a key
      const newPastureIdsMap = normalizePasturesWithOldId(pastures, newPastures)

      const plantCommunities = copyPlantCommunitiesToCreateAmendment(
        pcs,
        plantCommunitiesMap,
        newPastureIdsMap
      )
      const newPlantCommunities = await Promise.all(
        plantCommunities.map(pc =>
          dispatch(
            createRUPPlantCommunityAndOthers(amendmentId, pc.pastureId, pc)
          )
        )
      )

      const grazingSchedules = copyGrazingSchedulesToCreateAmendment(
        plan,
        grazingSchedulesMap,
        newPastureIdsMap
      )
      const newGrazingSchedules = await Promise.all(
        grazingSchedules.map(gs =>
          dispatch(createRUPGrazingSchedule(amendmentId, gs))
        )
      )

      const ministerIssues = copyMinisterIssuesToCreateAmendment(
        plan,
        ministerIssuesMap,
        newPastureIdsMap
      )
      const newMinisterIssues = await Promise.all(
        ministerIssues.map(mi =>
          dispatch(createRUPMinisterIssueAndActions(amendmentId, mi))
        )
      )

      const invasivePlantChecklist = copyInvasivePlantChecklistToCreateAmendment(
        plan
      )
      const newInvasivePlantCheckList = await dispatch(
        createRUPInvasivePlantChecklist(amendmentId, invasivePlantChecklist)
      )

      const managementConsiderations = copyManagementConsiderationsToCreateAmendment(
        plan,
        managementConsiderationsMap
      )
      const newManagementConsiderations = await Promise.all(
        managementConsiderations.map(mc =>
          dispatch(createRUPManagementConsideration(amendmentId, mc))
        )
      )

      const additionalRequirements = copyAdditionalRequirementsToCreateAmendment(
        plan,
        additionalRequirementsMap
      )
      const newAdditionalRequirements = await Promise.all(
        additionalRequirements.map(ar =>
          dispatch(createRUPAdditionalRequirement(amendmentId, ar))
        )
      )

      // successfully finish uploading so make this amendment visible!
      await dispatch(updateRUP(amendmentId, { uploaded: true }))

      const newAmendment = {
        ...amendment,
        pastures: newPastures,
        grazingSchedules: newGrazingSchedules,
        ministerIssues: newMinisterIssues,
        invasivePlantChecklist: newInvasivePlantCheckList,
        managementConsiderations: newManagementConsiderations,
        additionalRequirements: newAdditionalRequirements,
        plantCommunities: newPlantCommunities
      }

      dispatch(success(reducerTypes.CREATE_AMENDMENT, newAmendment))
      return newAmendment
    } catch (err) {
      dispatch(error(reducerTypes.CREATE_AMENDMENT, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }

  return makeRequest()
}

export const fetchRUP = planId => (dispatch, getState) => {
  dispatch(request(reducerTypes.GET_PLAN))
  const makeRequest = async () => {
    try {
      const response = await axios.get(
        API.GET_RUP(planId),
        createConfigWithHeader(getState)
      )
      const planWithAgreement = response.data

      dispatch(success(reducerTypes.GET_PLAN, planWithAgreement))
      // store the plan object
      dispatch(storePlan(normalize(planWithAgreement, schema.plan)))

      // return the agreement data for view
      return planWithAgreement
    } catch (err) {
      dispatch(error(reducerTypes.GET_PLAN, err))
      throw err
    }
  }
  return makeRequest()
}

export const updateRUPStatus = ({
  planId,
  statusId,
  note = null,
  shouldToast = true
}) => (dispatch, getState) => {
  dispatch(request(reducerTypes.UPDATE_PLAN_STATUS))
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_PLAN_STATUS(planId),
        { statusId, note },
        createConfigWithHeader(getState)
      )
      dispatch(success(reducerTypes.UPDATE_PLAN_STATUS, response.data))
      if (shouldToast) {
        dispatch(toastSuccessMessage(UPDATE_PLAN_STATUS_SUCCESS))
      }
      return response.data
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_PLAN_STATUS, err))
      if (shouldToast) {
        dispatch(toastErrorMessage(err))
      }
      throw err
    }
  }
  return makeRequest()
}

export const updateAgreementZone = ({ agreementId, zoneId }) => (
  dispatch,
  getState
) => {
  dispatch(request(reducerTypes.UPDATE_AGREEMENT_ZONE))
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        API.UPDATE_AGREEMENT_ZONE(agreementId),
        { zoneId },
        createConfigWithHeader(getState)
      )
      dispatch(success(reducerTypes.UPDATE_AGREEMENT_ZONE, response.data))
      dispatch(toastSuccessMessage(UPDATE_AGREEMENT_ZONE_SUCCESS))
      return response.data
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_AGREEMENT_ZONE, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }

  return makeRequest()
}

export const fetchRupPDF = planId => (dispatch, getState) => {
  dispatch(request(reducerTypes.GET_PLAN_PDF))
  const makeRequest = async () => {
    try {
      const config = {
        ...createConfigWithHeader(getState),
        responseType: 'arraybuffer'
      }
      const { data } = await axios.get(API.GET_PLAN_PDF(planId), config)
      dispatch(success(reducerTypes.GET_PLAN_PDF, data))
      return data
    } catch (err) {
      dispatch(error(reducerTypes.GET_PLAN_PDF, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }
  return makeRequest()
}
