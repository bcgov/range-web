import * as actionTypes from '../constants/actionTypes';

export const storeAgreements = (payload: unknown) => ({
  type: actionTypes.STORE_AGREEMENTS,
  payload,
});

export const storePlan = (payload: unknown) => ({
  type: actionTypes.STORE_PLAN,
  payload,
});

export const storeReferences = (payload: unknown) => ({
  type: actionTypes.STORE_REFERENCES,
  payload,
});

export const storeUsers = (payload: unknown) => ({
  type: actionTypes.STORE_USERS,
  payload,
});

export const storeClients = (payload: unknown) => ({
  type: actionTypes.STORE_CLIENTS,
  payload,
});

export const storeAgreementWithAllPlans = (payload: unknown) => ({
  type: actionTypes.STORE_AGREEMENT_WITH_ALL_PLANS,
  payload,
});
