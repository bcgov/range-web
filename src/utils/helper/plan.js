import moment from 'moment';
import * as strings from '../../constants/strings';
import { PLAN_STATUS, APPROVED_PLAN_STATUSES, EDITABLE_PLAN_STATUSES, FEEDBACK_REQUIRED_FROM_STAFF_PLAN_STATUSES, REQUIRE_NOTES_PLAN_STATUSES, NOT_DOWNLOADABLE_PLAN_STATUSES } from '../../constants/variables';
import { isAmendment } from './amendment';
import { isPlanAmendment } from '../validation';

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

export const scrollIntoView = (elementId) => {
  document.getElementById(elementId).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  });
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

export const isStatusReadyForSubmission = status => (
  status && status.code === PLAN_STATUS.RECOMMEND_FOR_SUBMISSION
);

export const cannotDownloadPDF = status => (
  status && status.code &&
    NOT_DOWNLOADABLE_PLAN_STATUSES.includes(status.code)
);

export const isStatusAmongApprovedStatuses = status => (
  status && status.code &&
    APPROVED_PLAN_STATUSES.includes(status.code)
);

export const canAllowRevisionForAH = status => (
  status && status.code &&
    EDITABLE_PLAN_STATUSES.includes(status.code)
);

export const isStatusIndicatingStaffFeedbackNeeded = status => (
  status && status.code &&
    FEEDBACK_REQUIRED_FROM_STAFF_PLAN_STATUSES.includes(status.code)
);

export const isNoteRequired = statusCode => (
  REQUIRE_NOTES_PLAN_STATUSES.includes(statusCode)
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

export const canUserEditThisPlan = (plan = {}, user = {}) => {
  const { status, creatorId } = plan;
  if (isPlanAmendment(plan)) {
    if (status && creatorId && user.id) {
      return canAllowRevisionForAH(status)
        && (creatorId === user.id);
    }
  } else { // initial plan
    return canAllowRevisionForAH(status);
  }

  return false;
};

export const getBannerContentForAH = (plan) => {
  const { status, amendmentTypeId } = plan;

  if (isStatusCreated(status)) {
    if (isAmendment(amendmentTypeId)) return strings.AMENDMENT_CREATED_BANNER_FOR_AH;
    return strings.RUP_CREATED_BANNER_FOR_AH;
  }
  if (isStatusDraft(status)) {
    return strings.RUP_IN_DRAFT_BANNER_FOR_AH;
  }
  if (isStatusPending(status)) {
    return strings.RUP_PENDING_BANNER_FOR_AH;
  }
  if (isStatusChangedRequested(status)) {
    return strings.RUP_CHANGE_REQUESTED_BANNER_FOR_AH;
  }
  if (isStatusCompleted(status)) {
    return strings.RUP_COMPLETE_BANNER_FOR_AH;
  }
  if (isStatusApproved(status)) {
    return strings.RUP_APPROVED_BANNER_FOR_AH;
  }
  if (isStatusNotApproved(status)) {
    return strings.RUP_NOT_APPROVED_BANNER_FOR_AH;
  }
  if (isStatusNotApprovedFWR(status)) {
    return strings.RUP_NOT_APPROVED_FURTHER_WORK_REQUIRED_BANNER_FOR_AH;
  }
  if (isStatusStands(status)) {
    return strings.RUP_STANDS_BANNER_FOR_AH;
  }
  if (isStatusStandsWM(status)) {
    return strings.RUP_STANDS_WRONGLY__BANNER_FOR_AH;
  }
  if (isStatusWronglyMakeWE(status)) {
    return strings.RUP_WRONGLY_MADE_WITHOUT_EFFECT;
  }
  return 'View Range Use Plan.';
};

export const getRangeReadinessMonthAndDate = (month, day) => {
  let readinessMonthAndDate;
  if (month && day) {
    const currYear = new Date().getFullYear();
    readinessMonthAndDate = moment(`${currYear} ${month} ${day}`).format('MMMM D');
  }
  return readinessMonthAndDate;
};
