import * as actionTypes from '../constants/actionTypes';

export const agreementSearchChanged = (payload) => ({
  type: actionTypes.AGREEMENT_SEARCH_CHANGED,
  payload,
});

export const userUpdated = (payload) => ({
  type: actionTypes.USER_UPDATED,
  payload,
});

export const planUpdated = (payload) => ({
  type: actionTypes.PLAN_UPDATED,
  payload,
});

export const planStatusHistoryRecordAdded = (payload) => ({
  type: actionTypes.PLAN_STATUS_HISTORY_RECORD_ADDED,
  payload,
});

export const confirmationUpdated = (payload) => ({
  type: actionTypes.CONFIRMATION_UPDATED,
  payload,
});

export const grazingScheduleAdded = (payload) => ({
  type: actionTypes.SCHEDULE_ADDED,
  payload,
});

export const grazingScheduleUpdated = (payload) => ({
  type: actionTypes.SCHEDULE_UPDATED,
  payload,
});

export const grazingScheduleDeleted = (payload) => ({
  type: actionTypes.SCHEDULE_DELETED,
  payload,
});

export const ministerIssueUpdated = (payload) => ({
  type: actionTypes.MINISTER_ISSUE_UPDATED,
  payload,
});

export const managementConsiderationAdded = (payload) => ({
  type: actionTypes.MANAGEMENT_CONSIDERATION_ADDED,
  payload,
});

export const managementConsiderationUpdated = (payload) => ({
  type: actionTypes.MANAGEMENT_CONSIDERATION_UPDATED,
  payload,
});

export const managementConsiderationDeleted = (payload) => ({
  type: actionTypes.MANAGEMENT_CONSIDERATION_DELETED,
  payload,
});

export const pastureAdded = (payload) => ({
  type: actionTypes.PASTURE_ADDED,
  payload,
});

export const pastureUpdated = (payload) => ({
  type: actionTypes.PASTURE_UPDATED,
  payload,
});

export const pastureSubmitted = (payload) => ({
  type: actionTypes.PASTURE_SUBMITTED,
  payload,
});

export const pastureCopied = (payload) => ({
  type: actionTypes.PASTURE_COPIED,
  payload,
});

export const plantCommunityAdded = (payload) => ({
  type: actionTypes.PLANT_COMMUNITY_ADDED,
  payload,
});

export const plantCommunityUpdated = (payload) => ({
  type: actionTypes.PLANT_COMMUNITY_UPDATED,
  payload,
});
