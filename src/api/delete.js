import * as API from '../constants/api'
import { getAuthHeaderConfig, axios } from '../utils'

export const initDeleteQueue = () => {
  if (!loadDeleteQueue()) {
    saveDeleteQueue({
      ministerIssueActions: [],
      ministerIssues: [],
      pastures: [],
      plantCommunities: []
    })
  }
}

export const deleteFromQueue = async () => {
  const deleteQueue = loadDeleteQueue()
  await Promise.all(
    deleteQueue.ministerIssueActions.map(action =>
      deleteMinisterIssueAction(action.planId, action.issueId, action.actionId)
    )
  )

  await Promise.all(
    deleteQueue.ministerIssues.map(action =>
      deleteMinisterIssue(action.planId, action.issueId)
    )
  )

  await Promise.all(
    deleteQueue.pastures.map(action =>
      deletePasture(action.planId, action.pastureId)
    )
  )

  await Promise.all(
    deleteQueue.plantCommunities.map(action =>
      deletePlantCommunity(action.planId, action.pastureId, action.communityId)
    )
  )
}

const saveDeleteQueue = deleteQueue => {
  localStorage.setItem('delete-queue', JSON.stringify(deleteQueue))
}

const loadDeleteQueue = () => {
  return JSON.parse(localStorage.getItem('delete-queue'))
}

export const deleteMinisterIssueAction = async (planId, issueId, actionId) => {
  const deleteQueue = loadDeleteQueue()

  try {
    await axios.delete(
      API.DELETE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, actionId),
      getAuthHeaderConfig()
    )
    deleteQueue.ministerIssueActions = deleteQueue.ministerIssueActions.filter(
      action => action.actionId !== actionId
    )
  } catch (e) {
    deleteQueue.ministerIssueActions.push({ planId, issueId, actionId })
  }

  saveDeleteQueue(deleteQueue)
}

export const deletePasture = async (planId, pastureId) => {
  const deleteQueue = loadDeleteQueue()

  try {
    await axios.delete(
      API.DELETE_RUP_PASTURE(planId, pastureId),
      getAuthHeaderConfig()
    )
    deleteQueue.pastures = deleteQueue.pastures.filter(
      pasture => pasture.pastureId !== pastureId
    )
  } catch (e) {
    deleteQueue.pastures.push({ planId, pastureId })
  }

  saveDeleteQueue(deleteQueue)
}

export const deletePlantCommunity = async (planId, pastureId, communityId) => {
  const deleteQueue = loadDeleteQueue()

  try {
    await axios.delete(
      API.DELETE_RUP_PLANT_COMMUNITY(planId, pastureId, communityId),
      getAuthHeaderConfig()
    )
    deleteQueue.plantCommunities = deleteQueue.plantCommunities.filter(
      community => community.communityId !== communityId
    )
  } catch (e) {
    deleteQueue.pastures.push({ planId, pastureId, communityId })
  }

  saveDeleteQueue(deleteQueue)
}

export const deleteMinisterIssue = async (planId, issueId) => {
  const deleteQueue = loadDeleteQueue()

  try {
    await axios.delete(
      API.DELETE_RUP_MINISTER_ISSUE(planId, issueId),
      getAuthHeaderConfig()
    )
    deleteQueue.ministerIssues = deleteQueue.ministerIssues.filter(
      issue => issue.issueId !== issueId
    )
  } catch (e) {
    deleteQueue.ministerIssues.push({ planId, issueId })
  }

  saveDeleteQueue(deleteQueue)
}
