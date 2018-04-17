import {
  success,
  request,
  error,
  dataChanged,
} from '../actions/genericActions';
import { ASSIGN_STAFF_TO_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import { ASSIGN_STAFF_TO_ZONE, GET_ZONES } from '../constants/reducerTypes';
import { USER, ZONE } from '../constants/api';
import axios from '../handlers/axios';

export const assignStaffToZone = ({ zoneId, userId }) => (dispatch) => {
  dispatch(request(ASSIGN_STAFF_TO_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        `${ZONE}/${zoneId}${USER}`,
        { userId },
      );
      dispatch(success(ASSIGN_STAFF_TO_ZONE, response.data));
      dispatch(toastSuccessMessage(ASSIGN_STAFF_TO_ZONE_SUCCESS));
      return response.data;
    } catch (err) {
      dispatch(error(ASSIGN_STAFF_TO_ZONE, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };

  return makeRequest();
};

export const staffAssignedToZone = requestData => (dispatch) => {
  const { zones, zoneId, assignedUser } = requestData;
  const newZones = zones.map((z) => {
    const zone = { ...z };
    if (zone.id === zoneId) {
      zone.userId = assignedUser.id;
      zone.user = assignedUser;
    }
    return zone;
  });
  dispatch(dataChanged(GET_ZONES, newZones));
};
