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

export const storeAgreementWithAllPlans = payload => (
  {
    type: actionTypes.STORE_AGREEMENT_WITH_ALL_PLANS,
    payload,
  }
);

export const addPlanStatusHistoryRecord = payload => (
  {
    type: actionTypes.ADD_PLAN_STATUS_HISTORY_RECORD,
    payload,
  }
);
