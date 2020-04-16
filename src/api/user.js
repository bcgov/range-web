import * as API from '../constants/api'
import { getAuthHeaderConfig, axios } from '../utils'

export const createClientLink = async (userId, clientId) => {
  return axios.post(
    API.CREATE_USER_CLIENT_LINK(userId),
    { clientId },
    getAuthHeaderConfig()
  )
}

export const deleteClientLink = async (userId, clientId) => {
  return axios.delete(
    API.DELETE_USER_CLIENT_LINK(userId, clientId),
    getAuthHeaderConfig()
  )
}
