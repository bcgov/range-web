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

export const storeZone = payload => (
  {
    type: actionTypes.STORE_ZONE,
    payload,
  }
);

export const storeReference = payload => (
  {
    type: actionTypes.STORE_REFERENCE,
    payload,
  }
);
