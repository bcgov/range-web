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

export const planStatusHistoryRecordAdded = payload => (
  {
    type: actionTypes.PLAN_STATUS_HISTORY_RECORD_ADDED,
    payload,
  }
);

export const confirmationUpdated = payload => (
  {
    type: actionTypes.CONFIRMATION_UPDATED,
    payload,
  }
);

export const grazingScheduleAdded = payload => (
  {
    type: actionTypes.GRAZING_SCHEDULE_ADDED,
    payload,
  }
);

export const grazingScheduleUpdated = payload => (
  {
    type: actionTypes.GRAZING_SCHEDULE_UPDATED,
    payload,
  }
);

export const grazingScheduleDeleted = payload => (
  {
    type: actionTypes.GRAZING_SCHEDULE_DELETED,
    payload,
  }
);

export const ministerIssueUpdated = payload => (
  {
    type: actionTypes.MINISTER_ISSUE_UPDATED,
    payload,
  }
);

export const managementConsiderationAdded = payload => (
  {
    type: actionTypes.MANAGEMENT_CONSIDERATION_ADDED,
    payload,
  }
);

export const managementConsiderationUpdated = payload => (
  {
    type: actionTypes.MANAGEMENT_CONSIDERATION_UPDATED,
    payload,
  }
);

export const managementConsiderationDeleted = payload => (
  {
    type: actionTypes.MANAGEMENT_CONSIDERATION_DELETED,
    payload,
  }
);
