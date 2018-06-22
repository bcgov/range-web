import * as actionTypes from '../constants/actionTypes';

export const storeAgreement = payload => (
  {
    type: actionTypes.STORE_AGREEMENTS,
    payload,
  }
);

export const storePlan = payload => (
  {
    type: actionTypes.STORE_PLAN,
    payload,
  }
);
