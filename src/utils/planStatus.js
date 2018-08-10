import { PLAN_STATUS } from '../constants/variables';
import {
  RUP_CHANGE_REQUESTED_FOR_AH_CONTENT,
  RUP_COMPLETE_FOR_AH_CONTENT,
  RUP_CREATED_FOR_AH_CONTENT,
  RUP_IN_DRAFT_FOR_AH_CONTENT,
  RUP_PENDING_FOR_AH_CONTENT,
  RUP_APPROVED_FOR_AH_CONTENT,
  RUP_NOT_APPROVED_FOR_AH_CONTENT,
  RUP_NOT_APPROVED_FURTHER_WORK_REQUIRED_FOR_AH_CONTENT,
  RUP_STANDS_FOR_AH_CONTENT,
  RUP_STANDS_WRONGLY_MADE_AH_CONTENT,
  RUP_WRONGLY_MADE_WITHOUT_EFFECT,
} from '../constants/strings';

export const isStatusCreated = status => (
  status && status.code === PLAN_STATUS.CREATED
);

export const isStatusDraft = status => (
  status && status.code === PLAN_STATUS.DRAFT
);

export const isStatusStaffDraft = status => (
  status && status.code === PLAN_STATUS.STAFF_DRAFT
);

export const isStatusCompleted = status => (
  status && status.code === PLAN_STATUS.COMPLETED
);

export const isStatusChangedRequested = status => (
  status && status.code === PLAN_STATUS.CHANGE_REQUESTED
);

export const isStatusPending = status => (
  status && status.code === PLAN_STATUS.PENDING
);

export const isStatusApproved = status => (
  status && status.code === PLAN_STATUS.APPROVED
);

export const isStatusNotApproved = status => (
  status && status.code === PLAN_STATUS.NOT_APPROVED
);

export const isStatusNotApprovedFWR = status => (
  status && status.code === PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED
);

export const isStatusStands = status => (
  status && status.code === PLAN_STATUS.STANDS
);

export const isStatusStandsWM = status => (
  status && status.code === PLAN_STATUS.STANDS_WRONGLY_MADE
);

export const isStatusWronglyMakeWE = status => (
  status && status.code === PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT
);

export const getBannerContentForAH = (status) => {
  if (isStatusCreated(status)) {
    return RUP_CREATED_FOR_AH_CONTENT;
  }
  if (isStatusDraft(status)) {
    return RUP_IN_DRAFT_FOR_AH_CONTENT;
  }
  if (isStatusPending(status)) {
    return RUP_PENDING_FOR_AH_CONTENT;
  }
  if (isStatusChangedRequested(status)) {
    return RUP_CHANGE_REQUESTED_FOR_AH_CONTENT;
  }
  if (isStatusCompleted(status)) {
    return RUP_COMPLETE_FOR_AH_CONTENT;
  }
  if (isStatusApproved(status)) {
    return RUP_APPROVED_FOR_AH_CONTENT;
  }
  if (isStatusNotApproved(status)) {
    return RUP_NOT_APPROVED_FOR_AH_CONTENT;
  }
  if (isStatusNotApprovedFWR(status)) {
    return RUP_NOT_APPROVED_FURTHER_WORK_REQUIRED_FOR_AH_CONTENT;
  }
  if (isStatusStands(status)) {
    return RUP_STANDS_FOR_AH_CONTENT;
  }
  if (isStatusStandsWM(status)) {
    return RUP_STANDS_WRONGLY_MADE_AH_CONTENT;
  }
  if (isStatusWronglyMakeWE(status)) {
    return RUP_WRONGLY_MADE_WITHOUT_EFFECT;
  }
  return 'View Range Use Plan.';
};
