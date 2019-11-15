import uuid from 'uuid-v4'
import { axios, getAuthHeaderConfig } from '../utils'
import * as API from '../constants/api'

export const getPlan = async planId => {
  const { data } = await axios.get(API.GET_RUP(planId), getAuthHeaderConfig())

  return data
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
        const { data } = axios.post(
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
      }
      return Promise.resolve()
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
      }
      return Promise.resolve()
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
      }
      return Promise.resolve()
    })
  )
}
