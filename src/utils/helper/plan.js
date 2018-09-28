import * as strings from '../../constants/strings';
import { PLAN_STATUS, APPROVED_PLAN_STATUSES, EDITABLE_PLAN_STATUSES, FEEDBACK_REQUIRED_FROM_STAFF_PLAN_STATUSES } from '../../constants/variables';

const getAmendmentTypeDescription = (amendmentTypeId, amendmentTypes) => {
  if (amendmentTypeId && amendmentTypes) {
    const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId);
    return amendmentType.description;
  }
  return '';
};

export const getPlanTypeDescription = (plan = {}, amendmentTypes) => {
  const { agreementId, amendmentTypeId } = plan;
  if (!plan.id) return '';
  if (agreementId && amendmentTypeId) {
    return getAmendmentTypeDescription(amendmentTypeId, amendmentTypes);
  }
  return 'Initial RUP';
};

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

export const isStatusSubmittedForReview = status => (
  status && status.code === PLAN_STATUS.SUBMITTED_FOR_REVIEW
);

export const isStatusSubmittedForFD = status => (
  status && status.code === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION
);

export const isStatusReadyForFD = status => (
  status && status.code === PLAN_STATUS.READY_FOR_FINAL_DECISION
);

export const isStatusRecommendReady = status => (
  status && status.code === PLAN_STATUS.RECOMMEND_READY
);

export const isStatusRecommendNotReady = status => (
  status && status.code === PLAN_STATUS.RECOMMEND_NOT_READY
);

export const isStatusAwaitingConfirmation = status => (
  status && status.code === PLAN_STATUS.AWAITING_CONFIRMATION
);

export const isStatusAmongApprovedStatuses = status => (
  status && status.code &&
  (APPROVED_PLAN_STATUSES.findIndex(code => code === status.code) >= 0)
);

export const isStatusAllowingRevisionForAH = status => (
  status && status.code &&
  (EDITABLE_PLAN_STATUSES.findIndex(code => code === status.code) >= 0)
);

export const isStatusIndicatingStaffFeedbackNeeded = status => (
  status && status.code &&
  (FEEDBACK_REQUIRED_FROM_STAFF_PLAN_STATUSES.findIndex(code => code === status.code) >= 0)
);

export const canUserSubmitConfirmation = (status, user, confirmations = [], confirmationsMap = {}) => {
  if (isStatusAwaitingConfirmation(status) && user) {
    let isConfirmed = false;
    confirmations.map((cId) => {
      const confirmation = confirmationsMap[cId];
      if (user.clientId && (user.clientId === confirmation.clientId)) {
        isConfirmed = confirmation.confirmed;
      }
      return undefined;
    });

    // users who haven't confirmed yet can submit the confirmation
    return !isConfirmed;
  }
  return false;
};

export const getBannerContentForAH = (status) => {
  if (isStatusCreated(status)) {
    return strings.RUP_CREATED_FOR_AH_CONTENT;
  }
  if (isStatusDraft(status)) {
    return strings.RUP_IN_DRAFT_FOR_AH_CONTENT;
  }
  if (isStatusPending(status)) {
    return strings.RUP_PENDING_FOR_AH_CONTENT;
  }
  if (isStatusChangedRequested(status)) {
    return strings.RUP_CHANGE_REQUESTED_FOR_AH_CONTENT;
  }
  if (isStatusCompleted(status)) {
    return strings.RUP_COMPLETE_FOR_AH_CONTENT;
  }
  if (isStatusApproved(status)) {
    return strings.RUP_APPROVED_FOR_AH_CONTENT;
  }
  if (isStatusNotApproved(status)) {
    return strings.RUP_NOT_APPROVED_FOR_AH_CONTENT;
  }
  if (isStatusNotApprovedFWR(status)) {
    return strings.RUP_NOT_APPROVED_FURTHER_WORK_REQUIRED_FOR_AH_CONTENT;
  }
  if (isStatusStands(status)) {
    return strings.RUP_STANDS_FOR_AH_CONTENT;
  }
  if (isStatusStandsWM(status)) {
    return strings.RUP_STANDS_WRONGLY_MADE_AH_CONTENT;
  }
  if (isStatusWronglyMakeWE(status)) {
    return strings.RUP_WRONGLY_MADE_WITHOUT_EFFECT;
  }
  return 'View Range Use Plan.';
};
