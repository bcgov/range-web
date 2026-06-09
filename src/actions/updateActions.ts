// @ts-nocheck
import * as actionTypes from '../constants/actionTypes';

export const planUpdated = (payload) => ({
  type: actionTypes.PLAN_UPDATED,
  payload,
});

export const confirmationUpdated = (payload) => ({
  type: actionTypes.CONFIRMATION_UPDATED,
  payload,
});

export const grazingScheduleUpdated = (payload) => ({
  type: actionTypes.SCHEDULE_UPDATED,
  payload,
});

export const ministerIssueUpdated = (payload) => ({
  type: actionTypes.MINISTER_ISSUE_UPDATED,
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
