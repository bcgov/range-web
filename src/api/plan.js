import uuid from 'uuid-v4'
import { axios, getAuthHeaderConfig } from '../utils'
import * as API from '../constants/api'
import RUPSchema from '../components/rangeUsePlanPage/schema'
import { getNetworkStatus } from '../utils/helper/network'
import { deleteFromQueue, initDeleteQueue } from './delete'
import {
  saveGrazingSchedules,
  saveInvasivePlantChecklist,
  saveManagementConsiderations,
  saveMinisterIssues,
  saveAdditionalRequirements,
  savePlantCommunities,
  savePastures
} from '.'
import { PLAN_STATUS } from '../constants/variables'

/**
 * Syncs plan and then returns locally stored record
 * @param {number} planId
 */
export const getPlan = async planId => {
  if (!uuid.isUUID(planId)) {
    await syncPlan(planId)
  }
  const plan = getPlanFromLocalStorage(planId)

  return plan
}

/**
 * If online, first updates any unsynced plan changes and then fetches and then
 * stores the latest version of the plan into local storage
 * @param {number} planId
 * @returns {void}
 */

const syncPlan = async planId => {
  await initDeleteQueue()
  const isOnline = await getNetworkStatus()
  const localPlan = getPlanFromLocalStorage(planId)

  if (isOnline) {
    if (localPlan && !localPlan.synced) {
      console.log(localPlan)

      await savePlan(localPlan)
    }

    const { data: serverPlan } = await axios.get(
      API.GET_RUP(planId),
      getAuthHeaderConfig()
    )
    savePlanToLocalStorage(serverPlan, true)
  }
}

/**
 * If online, uploads the plan to the API. Otherwise, saves the plan to local storage
 * @param {object} plan
 */
export const savePlan = async plan => {
  const isOnline = await getNetworkStatus()

  if (!isOnline) {
    savePlanToLocalStorage(plan, false)
    return plan.id
  }

  await deleteFromQueue()

  const {
    pastures,
    grazingSchedules,
    invasivePlantChecklist,
    managementConsiderations,
    ministerIssues,
    additionalRequirements
  } = RUPSchema.cast(plan)

  const config = getAuthHeaderConfig()

  let planId = plan.id

  if (uuid.isUUID(planId)) {
    const { id, ...planData } = plan
    const { data } = await axios.post(API.CREATE_RUP, planData, config)
    removePlanFromLocalStorage(planId)
    planId = data.id
  } else {
    await axios.put(API.UPDATE_RUP(plan.id), plan, config)
  }

  const newPastures = await savePastures(planId, pastures)

  await Promise.all(
    newPastures.map(async pasture => {
      await savePlantCommunities(planId, pasture.id, pasture.plantCommunities)
    })
  )

  await saveGrazingSchedules(planId, grazingSchedules)
  await saveInvasivePlantChecklist(planId, invasivePlantChecklist)
  await saveManagementConsiderations(planId, managementConsiderations)
  await saveMinisterIssues(planId, ministerIssues, newPastures)
  await saveAdditionalRequirements(planId, additionalRequirements)

  return planId
}

/**
 * Saves the plan to local storage, with the key corresponding to its id
 * @param {object} plan -
 * @param {boolean} synced - If the stored plan is to be marked as synced
 */
export const savePlanToLocalStorage = (plan, synced = false) => {
  localStorage.setItem(`plan-${plan.id}`, JSON.stringify({ ...plan, synced }))
}

/**
 * Get a plan from local storage
 * @param {number} planId - ID of the plan
 */
export const getPlanFromLocalStorage = planId => {
  return JSON.parse(localStorage.getItem(`plan-${planId}`))
}

export const removePlanFromLocalStorage = planId => {
  localStorage.removeItem(`plan-${planId}`)
}

export const getLocalPlansForAgreement = agreementId => {
  const plans = Object.entries(localStorage)
    .filter(([key]) => isPlanLocal({ id: key }))
    .map(entry => JSON.parse(entry[1]))
    .filter(plan => plan.agreementId === agreementId)

  return plans
}

export const getLocalPlans = () =>
  Object.entries(localStorage)
    .filter(([key]) => {
      const res = /(plan-)(.*)/g.exec(key)
      return res && uuid.isUUID(res[2])
    })
    .map(entry => JSON.parse(entry[1]))

export const isPlanLocal = plan => {
  return uuid.isUUID(plan && plan.id)
}

export const getPlans = () =>
  Object.entries(localStorage)
    .filter(([key]) => key.match(/(plan-)(.*)/g))
    .map(entry => JSON.parse(entry[1]))

export const createNewPlan = agreement => {
  const newPlan = {
    id: uuid(),
    agreementId: agreement.id,
    statusId: 6,
    status: { code: PLAN_STATUS.STAFF_DRAFT },
    agreement,
    planStatusHistory: [],
    pastures: [],
    ministerIssues: [],
    invasivePlanChecklist: {
      beginInUninfestedArea: false,
      equipmentAndVehiclesParking: false,
      other: null,
      revegetate: false,
      undercarrigesInspected: false
    },
    grazingSchedules: [],
    managementConsiderations: [],
    additionalRequirements: [],
    uploaded: true
  }

  savePlanToLocalStorage(newPlan)

  return newPlan
}
