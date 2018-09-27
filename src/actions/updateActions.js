import * as actionTypes from '../constants/actionTypes';

export const zoneUpdated = payload => (
  {
    type: actionTypes.ZONE_UPDATED,
    payload,
  }
);

export const userUpdated = payload => (
  {
    type: actionTypes.USER_UPDATED,
    payload,
  }
);

export const planUpdated = payload => (
  {
    type: actionTypes.PLAN_UPDATED,
    payload,
  }
);

export const confirmationUpdated = payload => (
  {
    type: actionTypes.CONFIRMATION_UPDATED,
    payload,
  }
);
