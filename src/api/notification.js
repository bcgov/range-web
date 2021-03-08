import * as API from '../constants/api'
import { getAuthHeaderConfig, axios } from '../utils'

export const getNotifications = async userId => {
  return axios.get(API.GET_NOTIFICATIONS(userId), getAuthHeaderConfig())
}
