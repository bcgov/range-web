import * as actionTypes from '../constants/actionTypes';

export const planUpdated = (payload: unknown) => ({
  type: actionTypes.PLAN_UPDATED,
  payload,
});

export const confirmationUpdated = (payload: unknown) => ({
  type: actionTypes.CONFIRMATION_UPDATED,
  payload,
});

export const grazingScheduleUpdated = (payload: unknown) => ({
  type: actionTypes.SCHEDULE_UPDATED,
  payload,
});

export const ministerIssueUpdated = (payload: unknown) => ({
  type: actionTypes.MINISTER_ISSUE_UPDATED,
  payload,
});

export const pastureAdded = (payload: unknown) => ({
  type: actionTypes.PASTURE_ADDED,
  payload,
});

export const pastureUpdated = (payload: unknown) => ({
  type: actionTypes.PASTURE_UPDATED,
  payload,
});

export const pastureSubmitted = (payload: unknown) => ({
  type: actionTypes.PASTURE_SUBMITTED,
  payload,
});

export const pastureCopied = (payload: unknown) => ({
  type: actionTypes.PASTURE_COPIED,
  payload,
});
