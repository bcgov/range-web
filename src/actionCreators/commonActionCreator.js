import { normalize } from 'normalizr'
import {
  axios,
  createConfigWithHeader,
  saveReferencesInLocalStorage
} from '../utils'
import * as API from '../constants/api'
import {
  storeUsers,
  storeReferences,
  storeZones,
  request,
  success,
  error
} from '../actions'
import * as schema from './schema'
import { GET_USERS, GET_ZONES } from '../constants/reducerTypes'

export const fetchUsers = params => (dispatch, getState) => {
  dispatch(request(GET_USERS))

  const { orderCId, excludeBy, exclude } = params || {}
  const config = {
    ...createConfigWithHeader(getState),
    params: {
      orderCId,
      excludeBy,
      exclude
    }
  }

  return axios.get(API.GET_USERS, config).then(
    response => {
      const users = response.data
      dispatch(success(GET_USERS, users))
      dispatch(storeUsers(normalize(users, schema.arrayOfUsers)))

      return users
    },
    err => {
      dispatch(error(GET_USERS, err))
      throw err
    }
  )
}

export const fetchReferences = () => (dispatch, getState) => {
  return axios.get(API.GET_REFERENCES, createConfigWithHeader(getState)).then(
    response => {
      const references = response.data
      saveReferencesInLocalStorage(references)
      dispatch(storeReferences(references))

      return references
    },
    err => {
      throw err
    }
  )
}

export const fetchZones = districtId => (dispatch, getState) => {
  dispatch(request(GET_ZONES))

  const config = {
    ...createConfigWithHeader(getState)
  }

  if (districtId) {
    config.params = {
      districtId
    }
  }

  return axios.get(API.GET_ZONES, config).then(
    response => {
      const zones = response.data
      dispatch(success(GET_ZONES, zones))
      dispatch(storeZones(normalize(zones, schema.arrayOfZones)))

      return zones
    },
    err => {
      dispatch(error(GET_ZONES, err))
      throw err
    }
  )
}
