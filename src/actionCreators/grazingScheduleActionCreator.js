import uuid from 'uuid-v4'
import { success, request, error } from '../actions'
import { toastErrorMessage } from './toastActionCreator'
import * as reducerTypes from '../constants/reducerTypes'
import * as API from '../constants/api'
import { axios, createConfigWithHeader } from '../utils'

export const createRUPGrazingScheduleEntry = (
  planId,
  grazingScheduleId,
  entry
) => (dispatch, getState) => {
  return axios
    .post(
      API.CREATE_RUP_GRAZING_SCHEDULE_ENTRY(planId, grazingScheduleId),
      { ...entry, plan_id: planId },
      createConfigWithHeader(getState)
    )
    .then(
      response => {
        const newEntry = response.data
        return newEntry
      },
      err => {
        throw err
      }
    )
}

export const createRUPGrazingSchedule = (planId, schedule) => (
  dispatch,
  getState
) => {
  const makeRequest = async () => {
    const { data: newSchedule } = await axios.post(
      API.CREATE_RUP_GRAZING_SCHEDULE(planId),
      { ...schedule, plan_id: planId },
      createConfigWithHeader(getState)
    )
    // const newGses = await Promise.all(schedule.grazingScheduleEntries
    //   .map(gse => dispatch(createRUPGrazingScheduleEntry(planId, newSchedule.id, gse))));

    return {
      ...newSchedule
      // grazingScheduleEntries: newGses,
    }
  }
  return makeRequest()
}

const createRUPGrazingScheduleAndEntries = (planId, schedule) => (
  dispatch,
  getState
) => {
  dispatch(request(reducerTypes.CREATE_GRAZING_SCHEDULE_AND_ENTRIES))
  const makeRequest = async () => {
    try {
      const { id, ...grazingSchedule } = schedule
      const { data } = await axios.post(
        API.CREATE_RUP_GRAZING_SCHEDULE(planId),
        { ...grazingSchedule, plan_id: planId },
        createConfigWithHeader(getState)
      )
      dispatch(success(reducerTypes.CREATE_GRAZING_SCHEDULE_AND_ENTRIES, data))
      return data
    } catch (err) {
      dispatch(error(reducerTypes.CREATE_GRAZING_SCHEDULE_AND_ENTRIES, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }
  return makeRequest()
}

const updateRUPGrazingScheduleAndEntries = (planId, schedule) => (
  dispatch,
  getState
) => {
  dispatch(request(reducerTypes.UPDATE_GRAZING_SCHEDULE_AND_ENTRIES))
  const makeRequest = async () => {
    try {
      const { data } = await axios.put(
        API.UPDATE_RUP_GRAZING_SCHEDULE(planId, schedule.id),
        { ...schedule },
        createConfigWithHeader(getState)
      )
      dispatch(success(reducerTypes.UPDATE_GRAZING_SCHEDULE_AND_ENTRIES, data))
      return data
    } catch (err) {
      dispatch(error(reducerTypes.UPDATE_GRAZING_SCHEDULE_AND_ENTRIES, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }
  return makeRequest()
}

export const createOrUpdateRUPGrazingSchedule = (
  planId,
  schedule
) => dispatch => {
  if (uuid.isUUID(schedule.id)) {
    return dispatch(createRUPGrazingScheduleAndEntries(planId, schedule))
  }
  return dispatch(updateRUPGrazingScheduleAndEntries(planId, schedule))
}

export const deleteRUPGrazingSchedule = (planId, scheduleId) => (
  dispatch,
  getState
) => {
  dispatch(request(reducerTypes.DELETE_GRAZING_SCHEUDLE))
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_GRAZING_SCHEDULE(planId, scheduleId),
        createConfigWithHeader(getState)
      )
      dispatch(success(reducerTypes.DELETE_GRAZING_SCHEUDLE, data))
      return data
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_GRAZING_SCHEUDLE, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }
  return makeRequest()
}

export const deleteRUPGrazingScheduleEntry = (planId, scheduleId, entryId) => (
  dispatch,
  getState
) => {
  dispatch(request(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY))
  const makeRequest = async () => {
    try {
      const { data } = await axios.delete(
        API.DELETE_RUP_GRAZING_SCHEDULE_ENTRY(planId, scheduleId, entryId),
        createConfigWithHeader(getState)
      )
      dispatch(success(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY, data))
      return data
    } catch (err) {
      dispatch(error(reducerTypes.DELETE_GRAZING_SCHEUDLE_ENTRY, err))
      dispatch(toastErrorMessage(err))
      throw err
    }
  }
  return makeRequest()
}
