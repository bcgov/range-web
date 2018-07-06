import * as actionTypes from '../constants/actionTypes';

export const storeAgreements = payload => (
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

export const storeZones = payload => (
  {
    type: actionTypes.STORE_ZONES,
    payload,
  }
);

export const storeReferences = payload => (
  {
    type: actionTypes.STORE_REFERENCES,
    payload,
  }
);

export const storeUsers = payload => (
  {
    type: actionTypes.STORE_USERS,
    payload,
  }
);

export const storeClients = payload => (
  {
    type: actionTypes.STORE_CLIENTS,
    payload,
  }
);
