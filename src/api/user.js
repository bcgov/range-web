import * as API from '../constants/api'
import { getAuthHeaderConfig, axios } from '../utils'

export const createClientLink = async (userId, clientNumber) => {
  return axios.post(
    API.CREATE_USER_CLIENT_LINK(userId),
    { clientId: clientNumber },
    getAuthHeaderConfig()
  )
}

export const deleteClientLink = async (userId, clientNumber) => {
  return axios.delete(
    API.DELETE_USER_CLIENT_LINK(userId, clientNumber),
    getAuthHeaderConfig()
  )
}
