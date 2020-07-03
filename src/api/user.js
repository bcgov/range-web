import * as API from '../constants/api'
import { getAuthHeaderConfig, axios } from '../utils'

export const createClientLink = async (userId, clientId) => {
  return axios.post(
    API.CREATE_USER_CLIENT_LINK(userId),
    { clientId },
    getAuthHeaderConfig()
  )
}

export const createAllClientLinks = async (userId, clientNumber) => {
  const res = await axios.get(`v1/client`, getAuthHeaderConfig())
  const { data: user } = await axios.get(
    `${API.GET_USERS}/${userId}`,
    getAuthHeaderConfig()
  )

  const clientsToLink = res.data.filter(
    client =>
      client.clientNumber === clientNumber &&
      !user.clients.find(c => c.id === client.id)
  )
  if (clientsToLink.length === 0) {
    throw new Error(
      'All locations for this client number are already linked to this user'
    )
  }

  for (const client of clientsToLink) {
    await axios.post(
      API.CREATE_USER_CLIENT_LINK(userId),
      { clientId: client.id },
      getAuthHeaderConfig()
    )
  }

  return clientsToLink
}

export const deleteClientLink = async (userId, clientId) => {
  return axios.delete(
    API.DELETE_USER_CLIENT_LINK(userId, clientId),
    getAuthHeaderConfig()
  )
}
