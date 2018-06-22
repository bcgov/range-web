// import axios from 'axios';
import { normalize } from 'normalizr';
import * as schema from './schema';
import * as api from '../api';
import { request, successPagenated, error, storeAgreement } from '../actions';
import { getAgreementsIsFetching } from '../reducers/rootReducer';
import * as reducerTypes from '../constants/reducerTypes';

export const searchAgreements = filter => (dispatch, getState) => {
  if (getAgreementsIsFetching(getState(), filter)) {
    return Promise.resolve();
  }
  dispatch(request(reducerTypes.SEARCH_AGREEMENTS));

  return api.fetchAgreements(filter).then(
    (response) => {
      dispatch(successPagenated(reducerTypes.SEARCH_AGREEMENTS, response));
      dispatch(storeAgreement(normalize(response.agreements, schema.arrayOfAgreements)));
    },
    (err) => {
      dispatch(error(reducerTypes.SEARCH_AGREEMENTS, err.message));
    },
  );
};

export const s = () => {};
