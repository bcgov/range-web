import * as API from '../constants/api'
import { getAuthHeaderConfig, axios } from '../utils'

export const initDeleteQueue = () => {
  if (!loadDeleteQueue()) {
    saveDeleteQueue({
      ministerIssueActions: []
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
