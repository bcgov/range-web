import uuid from 'uuid-v4'
import { axios, createConfigWithHeader } from '../utils'
import {
  CREATE_RUP_ADDITIONAL_REQUIREMENT,
  CREATE_RUP_MANAGEMENT_CONSIDERATION,
  UPDATE_RUP_MANAGEMENT_CONSIDERATION,
  DELETE_RUP_MANAGEMENT_CONSIDERATION
} from '../constants/api'
import { success, request, error } from '../actions'
import { DELETE_MANAGEMENT_CONSIDERATION } from '../constants/reducerTypes'

export const createRUPAdditionalRequirement = (
  planId,
  { id, ...requirement }
) => (dispatch, getState) => {
  return axios
    .post(
      CREATE_RUP_ADDITIONAL_REQUIREMENT(planId),
      requirement,
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

export const createRUPManagementConsideration = (
  planId,
  { id, ...consideration }
) => (dispatch, getState) => {
  return axios
    .post(
      CREATE_RUP_MANAGEMENT_CONSIDERATION(planId),
      consideration,
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

export const updateRUPManagementConsideration = (planId, consideration) => (
  dispatch,
  getState
) => {
  return axios
    .put(
      UPDATE_RUP_MANAGEMENT_CONSIDERATION(planId, consideration.id),
      consideration,
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

export const createOrUpdateRUPManagementConsideration = (
  planId,
  consideration
) => dispatch => {
  if (uuid.isUUID(consideration.id)) {
    return dispatch(createRUPManagementConsideration(planId, consideration))
  }

  return dispatch(updateRUPManagementConsideration(planId, consideration))
}

export const deleteRUPManagementConsideration = (planId, considerationId) => (
  dispatch,
  getState
) => {
  dispatch(request(DELETE_MANAGEMENT_CONSIDERATION))
  return axios
    .delete(
      DELETE_RUP_MANAGEMENT_CONSIDERATION(planId, considerationId),
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        dispatch(success(DELETE_MANAGEMENT_CONSIDERATION, response))
        return response.data
      },
      err => {
        dispatch(error(DELETE_MANAGEMENT_CONSIDERATION, err))
        throw err
      }
    )
}
