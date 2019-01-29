import * as actionTypes from '../constants/actionTypes';

export const addGrazingSchedule = payload => (
  {
    type: actionTypes.ADD_GRAZING_SCHEDULE,
    payload,
  }
);

export const updateGrazingSchedule = payload => (
  {
    type: actionTypes.UPDATE_GRAZING_SCHEDULE,
    payload,
  }
);

export const deleteGrazingSchedule = payload => (
  {
    type: actionTypes.DELETE_GRAZING_SCHEDULE,
    payload,
  }
);

export const updateMinisterIssue = payload => (
  {
    type: actionTypes.UPDATE_MINISTER_ISSUE,
    payload,
  }
);

export const updateManagementConsideration = payload => (
  {
    type: actionTypes.UPDATE_MANAGEMENT_CONSIDERATION,
    payload,
  }
);

export const managementConsiderationDeleted = payload => (
  {
    type: actionTypes.DELETE_MANAGEMENT_CONSIDERATION,
    payload,
  }
);
