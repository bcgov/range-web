import * as actionTypes from '../constants/actionTypes';

export const planUpdated = (payload: unknown) => ({
  type: actionTypes.PLAN_UPDATED,
  payload,
});

export const confirmationUpdated = (payload: unknown) => ({
  type: actionTypes.CONFIRMATION_UPDATED,
  payload,
});

export const pastureSubmitted = (payload: unknown) => ({
  type: actionTypes.PASTURE_SUBMITTED,
  payload,
});
