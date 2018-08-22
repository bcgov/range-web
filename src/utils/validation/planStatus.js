import { PLAN_STATUS, APPROVED_PLAN_STATUSES, EDITABLE_PLAN_STATUSES } from '../../constants/variables';

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

export const isStatusAmongApprovedStatuses = status => (
  status && status.code &&
  (APPROVED_PLAN_STATUSES.findIndex(code => code === status.code) >= 0)
);

export const isStatusAllowingRevisionForAH = status => (
  status && status.code &&
  (EDITABLE_PLAN_STATUSES.findIndex(code => code === status.code) >= 0)
);