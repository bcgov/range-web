import * as actionTypes from '../constants/actionTypes';

export const updateZone = payload => (
  {
    type: actionTypes.UPDATE_ZONE,
    payload,
  }
);

export const updateUser = payload => (
  {
    type: actionTypes.UPDATE_USER,
    payload,
  }
);

export const updatePlan = payload => (
  {
    type: actionTypes.UPDATE_PLAN,
    payload,
  }
);

export const updateGrazingSchedule = payload => (
  {
    type: actionTypes.UPDATE_GRAZING_SCHEDULE,
    payload,
  }
);

export const updateGrazingScheduleEntry = payload => (
  {
    type: actionTypes.UPDATE_GRAZING_SCHEDULE_ENTRY,
    payload,
  }
);
