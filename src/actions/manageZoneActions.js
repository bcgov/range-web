import {
  success,
  request,
  error,
} from '../actions/genericActions';
import { ASSIGN_STAFF_TO_ZONE_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import { ASSIGN_STAFF_TO_ZONE } from '../constants/reducerTypes';
import { BASE_URL, USER, ZONE } from '../constants/api';
import axios from '../handlers/axios';

export const assignStaffToZone = ({ zoneId, userId }) => (dispatch) => {
  dispatch(request(ASSIGN_STAFF_TO_ZONE));
  const makeRequest = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}${ZONE}/${zoneId}${USER}`,
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
