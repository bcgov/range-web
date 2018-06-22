// import axios from 'axios';
import { normalize } from 'normalizr';
import * as schema from './schema';
import * as api from '../api';
import { request, success, successPagenated, error, storeAgreement, storePlan } from '../actions';
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

export const getPlan = () => (dispatch) => {
  dispatch(request(reducerTypes.GET_PLAN));

  return api.fetchPlan().then(
    (response) => {
      dispatch(success(reducerTypes.GET_PLAN), response);
      dispatch(storePlan(normalize(response.plan, schema.plan)));
      dispatch(storePlan(normalize(response.plan, schema.plan)));
    },
    (err) => {
      dispatch(error(reducerTypes.GET_PLAN, err.message));
    },
  );
};
