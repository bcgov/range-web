import {
  success,
  request,
  successPaginated,
  error,
} from '../actions/genericActions';
import { GET_RANGE_USE_PLANS } from '../constants/reducerTypes';
import { getMockRangeUsePlans } from '../components/rangeUsePlans/test/mockValues';

export const getRangeUsePlans = (requestData) => (dispatch) => {
  dispatch(request(GET_RANGE_USE_PLANS));

  setTimeout(() => {
    let plans;
    if(requestData) {
      plans = getMockRangeUsePlans(2);
      dispatch(success(GET_RANGE_USE_PLANS, plans));
    } else {
      plans = getMockRangeUsePlans(8);
      dispatch(success(GET_RANGE_USE_PLANS, plans));
    }
  }, 1000);
};
