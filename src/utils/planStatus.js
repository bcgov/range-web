import { PLAN_STATUS } from '../constants/variables';
import {
  RUP_CHANGE_REQUESTED_FOR_AH_CONTENT,
  RUP_COMPLETE_FOR_AH_CONTENT,
  RUP_CREATED_FOR_AH_CONTENT,
  RUP_IN_DRAFT_FOR_AH_CONTENT,
  RUP_PENDING_FOR_AH_CONTENT,
} from '../constants/strings';

export const isStatusCreated = status => (
  status && status.name === PLAN_STATUS.CREATED
);

export const isStatusDraft = status => (
  status && status.name === PLAN_STATUS.DRAFT
);

export const isStatusCompleted = status => (
  status && status.name === PLAN_STATUS.COMPLETED
);

export const isStatusChangedRequested = status => (
  status && status.name === PLAN_STATUS.CHANGE_REQUESTED
);

export const isStatusPending = status => (
  status && status.name === PLAN_STATUS.PENDING
);

export const getBannerContentForAH = (status) => {
  let content = '';
  if (isStatusCreated(status)) {
    content = RUP_CREATED_FOR_AH_CONTENT;
  } else if (isStatusDraft(status)) {
    content = RUP_IN_DRAFT_FOR_AH_CONTENT;
  } else if (isStatusPending(status)) {
    content = RUP_PENDING_FOR_AH_CONTENT;
  } else if (isStatusChangedRequested(status)) {
    content = RUP_CHANGE_REQUESTED_FOR_AH_CONTENT;
  } else if (isStatusCompleted(status)) {
    content = RUP_COMPLETE_FOR_AH_CONTENT;
  }
  return content;
};
