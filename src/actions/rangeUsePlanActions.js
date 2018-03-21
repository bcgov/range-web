import {
  success,
  request,
  error,
} from '../actions/genericActions';
import { UPDATE_RUP_STATUS_SUCCESS } from '../constants/strings';
import { toastSuccessMessage, toastErrorMessage } from '../actions/toastActions';
import { UPDATE_RUP_STATUS } from '../constants/reducerTypes';
import { BASE_URL, STATUS, AGREEMENT } from '../constants/api';
import axios from '../handlers/axios';

export const updateRupStatus = (requestData) => (dispatch) => {
  dispatch(request(UPDATE_RUP_STATUS));
  const makeRequest = async () => {
    try {
      const { agreementId, statusId } = requestData;
      const response = await axios.put(
        `${BASE_URL}${AGREEMENT}/${agreementId}${STATUS}`, 
        { statusId }
      );
      dispatch(success(UPDATE_RUP_STATUS, response.data));
      dispatch(toastSuccessMessage(UPDATE_RUP_STATUS_SUCCESS));
    } catch (err) {
      dispatch(error(UPDATE_RUP_STATUS, err));
      dispatch(toastErrorMessage(err));
      throw err;
    }
  };
  return makeRequest();
}