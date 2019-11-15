import uuid from 'uuid-v4'
import { axios, getAuthHeaderConfig } from '../utils'
import * as API from '../constants/api'
import RUPSchema from '../components/rangeUsePlanPage/schema'
import { getNetworkStatus } from '../utils/helper/network'

/**
 * Syncs plan and then returns locally stored record
 * @param {number} planId
 */
export const getPlan = async planId => {
  await syncPlan(planId)
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
    return savePlanToLocalStorage(plan, false)
  }

  const {
    pastures,
    grazingSchedules,
    invasivePlantChecklist,
    managementConsiderations,
    ministerIssues,
    additionalRequirements
  } = RUPSchema.cast(plan)

  const config = getAuthHeaderConfig()

  await axios.put(API.UPDATE_RUP(plan.id), plan, config)

  const newPastures = await savePastures(plan.id, pastures)

  await Promise.all(
    newPastures.map(async pasture => {
      await savePlantCommunities(plan.id, pasture.id, pasture.plantCommunities)
    })
  )

  await saveGrazingSchedules(plan.id, grazingSchedules)
  await saveInvasivePlantChecklist(plan.id, invasivePlantChecklist)
  await saveManagementConsiderations(plan.id, managementConsiderations)
  await saveMinisterIssues(plan.id, ministerIssues, newPastures)
  await saveAdditionalRequirements(plan.id, additionalRequirements)
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

export const createVersion = async planId => {
  await axios.post(API.CREATE_RUP_VERSION(planId), {}, getAuthHeaderConfig())
}

export const saveGrazingSchedules = (planId, grazingSchedules) => {
  return Promise.all(
    grazingSchedules.map(async schedule => {
      const grazingScheduleEntries = schedule.grazingScheduleEntries.map(
        ({ id: entryId, ...entry }) => ({
          ...entry,
          ...(!uuid.isUUID(entryId) && { id: entryId })
        })
      )
      const { id, ...grazingSchedule } = schedule

      if (uuid.isUUID(schedule.id)) {
        const { data } = await axios.post(
          API.CREATE_RUP_GRAZING_SCHEDULE(planId),
          { ...grazingSchedule, grazingScheduleEntries, plan_id: planId },
          getAuthHeaderConfig()
        )

        return {
          ...grazingSchedule,
          id: data.id
        }
      } else {
        await axios.put(
          API.UPDATE_RUP_GRAZING_SCHEDULE(planId, schedule.id),
          { ...grazingSchedule, grazingScheduleEntries },
          getAuthHeaderConfig()
        )

        return schedule
      }
    })
  )
}

export const saveInvasivePlantChecklist = async (
  planId,
  invasivePlantChecklist
) => {
  if (invasivePlantChecklist && invasivePlantChecklist.id) {
    await axios.put(
      API.UPDATE_RUP_INVASIVE_PLANT_CHECKLIST(
        planId,
        invasivePlantChecklist.id
      ),
      invasivePlantChecklist,
      getAuthHeaderConfig()
    )

    return invasivePlantChecklist
  } else {
    const { id, ...values } = invasivePlantChecklist
    const { data } = await axios.post(
      API.CREATE_RUP_INVASIVE_PLANT_CHECKLIST(planId),
      values,
      getAuthHeaderConfig()
    )

    return {
      ...invasivePlantChecklist,
      id: data.id
    }
  }
}

export const saveManagementConsiderations = (
  planId,
  managementConsiderations
) => {
  return Promise.all(
    managementConsiderations.map(async consideration => {
      if (uuid.isUUID(consideration.id)) {
        const { id, ...values } = consideration
        const { data } = await axios.post(
          API.CREATE_RUP_MANAGEMENT_CONSIDERATION(planId),
          values,
          getAuthHeaderConfig()
        )

        return {
          ...consideration,
          id: data.id
        }
      } else {
        await axios.put(
          API.UPDATE_RUP_MANAGEMENT_CONSIDERATION(planId, consideration.id),
          consideration,
          getAuthHeaderConfig()
        )

        return consideration
      }
    })
  )
}

export const saveAdditionalRequirements = (planId, additionalRequirements) => {
  return Promise.all(
    additionalRequirements.map(async requirement => {
      if (uuid.isUUID(requirement.id)) {
        const { id, ...values } = requirement
        const { data } = await axios.post(
          API.CREATE_RUP_ADDITIONAL_REQUIREMENT(planId),
          values,
          getAuthHeaderConfig()
        )

        return {
          ...requirement,
          id: data.id
        }
      } else {
        await axios.put(
          API.UPDATE_RUP_ADDITIONAL_REQUIREMENT(planId, requirement.id),
          requirement,
          getAuthHeaderConfig()
        )

        return requirement
      }
    })
  )
}

export const saveMinisterIssues = (planId, ministerIssues, newPastures) => {
  const pastureMap = newPastures.reduce(
    (map, p) => ({
      ...map,
      [p.oldId]: p.id
    }),
    {}
  )

  return Promise.all(
    ministerIssues.map(async issue => {
      const { id, ...issueBody } = issue

      if (uuid.isUUID(issue.id)) {
        const { data: newIssue } = await axios.post(
          API.CREATE_RUP_MINISTER_ISSUE(planId),
          {
            ...issueBody,
            pastures: issueBody.pastures.map(p => pastureMap[p])
          },
          getAuthHeaderConfig()
        )

        const newActions = await saveMinisterIssueActions(
          planId,
          newIssue.id,
          issue.ministerIssueActions
        )

        return {
          ...issue,
          ministerIssueActions: newActions,
          id: newIssue.id
        }
      } else {
        await axios.put(
          API.UPDATE_RUP_MINISTER_ISSUE(planId, issue.id),
          {
            ...issueBody,
            pastures: issueBody.pastures.map(p => pastureMap[p])
          },
          getAuthHeaderConfig()
        )

        const newActions = await saveMinisterIssueActions(
          planId,
          issue.id,
          issue.ministerIssueActions
        )

        return {
          ...issue,
          ministerIssueActions: newActions
        }
      }
    })
  )
}

const saveMinisterIssueActions = (planId, issueId, actions) => {
  return Promise.all(
    actions.map(async action => {
      const { id, ...actionBody } = action
      if (uuid.isUUID(action.id)) {
        const { data } = await axios.post(
          API.CREATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId),
          actionBody,
          getAuthHeaderConfig()
        )

        return {
          ...action,
          id: data.id
        }
      } else {
        await axios.put(
          API.UPDATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, action.id),
          actionBody,
          getAuthHeaderConfig()
        )

        return action
      }
    })
  )
}

export const savePastures = (planId, pastures) => {
  return Promise.all(
    pastures.map(async pasture => {
      if (Number.isInteger(pasture.id)) {
        await axios.put(
          API.UPDATE_RUP_PASTURE(planId, pasture.id),
          pasture,
          getAuthHeaderConfig()
        )

        return { ...pasture, oldId: pasture.id }
      } else {
        const { id, ...values } = pasture
        const { data } = await axios.post(
          API.CREATE_RUP_PASTURE(planId),
          values,
          getAuthHeaderConfig()
        )

        return {
          ...pasture,
          oldId: pasture.id,
          id: data.id
        }
      }
    })
  )
}

export const savePlantCommunities = (planId, pastureId, plantCommunities) => {
  return Promise.all(
    plantCommunities.map(async plantCommunity => {
      let { id: communityId, ...values } = plantCommunity
      if (uuid.isUUID(communityId)) {
        communityId = (await axios.post(
          API.CREATE_RUP_PLANT_COMMUNITY(planId, pastureId),
          values,
          getAuthHeaderConfig()
        )).data.id
      } else {
        await axios.put(
          API.UPDATE_RUP_PLANT_COMMUNITY(planId, pastureId, communityId),
          values,
          getAuthHeaderConfig()
        )
      }

      await savePlantCommunityActions(
        planId,
        pastureId,
        communityId,
        plantCommunity.plantCommunityActions
      )
      await saveIndicatorPlants(
        planId,
        pastureId,
        communityId,
        plantCommunity.indicatorPlants
      )
      await saveMonitoringAreas(
        planId,
        pastureId,
        communityId,
        plantCommunity.monitoringAreas
      )
    })
  )
}

const savePlantCommunityActions = (
  planId,
  pastureId,
  communityId,
  plantCommunityActions
) => {
  return Promise.all(
    plantCommunityActions.map(action => {
      let { id: actionId, ...values } = action
      if (uuid.isUUID(actionId)) {
        return axios.post(
          API.CREATE_RUP_PLANT_COMMUNITY_ACTION(planId, pastureId, communityId),
          values,
          getAuthHeaderConfig()
        )
      } else {
        return axios.put(
          API.UPDATE_RUP_PLANT_COMMUNITY_ACTION(
            planId,
            pastureId,
            communityId,
            actionId
          ),
          values,
          getAuthHeaderConfig()
        )
      }
    })
  )
}

const saveIndicatorPlants = (
  planId,
  pastureId,
  communityId,
  indicatorPlants
) => {
  return Promise.all(
    indicatorPlants.map(plant => {
      let { id: plantId, ...values } = plant
      if (uuid.isUUID(plantId)) {
        return axios.post(
          API.CREATE_RUP_INDICATOR_PLANT(planId, pastureId, communityId),
          values,
          getAuthHeaderConfig()
        )
      } else {
        return axios.put(
          API.UPDATE_RUP_INDICATOR_PLANT(
            planId,
            pastureId,
            communityId,
            plantId
          ),
          values,
          getAuthHeaderConfig()
        )
      }
    })
  )
}

const saveMonitoringAreas = (
  planId,
  pastureId,
  communityId,
  monitoringAreas
) => {
  return Promise.all(
    monitoringAreas.map(area => {
      let { id: areaId, ...values } = area
      if (uuid.isUUID(areaId)) {
        return axios.post(
          API.CREATE_RUP_MONITERING_AREA(planId, pastureId, communityId),
          values,
          getAuthHeaderConfig()
        )
      } else {
        return axios.put(
          API.UPDATE_RUP_MONITORING_AREA(
            planId,
            pastureId,
            communityId,
            areaId
          ),
          values,
          getAuthHeaderConfig()
        )
      }
    })
  )
}

export const deleteMinisterIssueAction = async (planId, issueId, actionId) => {
  await axios.delete(
    API.DELETE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, actionId),
    getAuthHeaderConfig()
  )
}

export const deleteManagementConsideration = async (
  planId,
  considerationId
) => {
  await axios.delete(
    API.DELETE_RUP_MANAGEMENT_CONSIDERATION(planId, considerationId),
    getAuthHeaderConfig()
  )
}

export const deleteGrazingSchedule = async (planId, scheduleId) => {
  await axios.delete(
    API.DELETE_RUP_GRAZING_SCHEDULE(planId, scheduleId),
    getAuthHeaderConfig()
  )
}

export const deleteGrazingScheduleEntry = async (
  planId,
  scheduleId,
  entryId
) => {
  await axios.delete(
    API.DELETE_RUP_GRAZING_SCHEDULE_ENTRY(planId, scheduleId, entryId),
    getAuthHeaderConfig()
  )
}
