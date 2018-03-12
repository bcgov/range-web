import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { TENURE_AGREEMENT } from '../constants/reducerTypes';
import { getMockRangeUsePlans } from '../components/tenureAgreement/test/mockValues';
import { BASE_URL, AGREEMENTS } from '../constants/api';
import axios from '../handlers/axios';

export const searchTenureAgreements = (requestData) => (dispatch) => {
  dispatch(request(TENURE_AGREEMENT));

  axios.get(BASE_URL + AGREEMENTS)
    .then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    });

  setTimeout(() => {
    let plans;
    if(requestData) {
      plans = getMockRangeUsePlans(2);
      dispatch(success(TENURE_AGREEMENT, plans));
    } else {
      plans = getMockRangeUsePlans(8);
      dispatch(success(TENURE_AGREEMENT, plans));
    }
  }, 1000);
};
