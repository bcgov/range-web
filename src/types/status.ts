/**
 * Plan lifecycle status — represents the current state of a Range Use Plan.
 */
export interface Status {
  id: number;
  code: string;
  name: string;
  active?: boolean;
  descriptionShort?: string;
  descriptionFull?: string;
}

/**
 * Plan status codes used throughout the application.
 * These match the backend constants in range-api/src/constants.ts.
 */
export const PLAN_STATUS_CODE = {
  PENDING: 'P',
  DRAFT: 'D',
  CREATED: 'C',
  CHANGE_REQUESTED: 'R',
  STAFF_DRAFT: 'SD',
  WRONGLY_MADE_WITHOUT_EFFECT: 'WM',
  STANDS_WRONGLY_MADE: 'SW',
  STANDS: 'S',
  NOT_APPROVED_FURTHER_WORK_REQUIRED: 'NF',
  NOT_APPROVED: 'NA',
  APPROVED: 'A',
  SUBMITTED_FOR_REVIEW: 'SR',
  SUBMITTED_FOR_FINAL_DECISION: 'SFD',
  RECOMMEND_READY: 'RR',
  RECOMMEND_NOT_READY: 'RNR',
  RECOMMEND_FOR_SUBMISSION: 'RFS',
  READY_FOR_FINAL_DECISION: 'RFD',
  AWAITING_CONFIRMATION: 'AC',
  STANDS_REVIEW: 'MSR',
  STANDS_NOT_REVIEWED: 'SNR',
  MANDATORY_AMENDMENT_STAFF: 'APS',
  AMENDMENT_AH: 'APA',
  SUBMITTED_AS_MANDATORY: 'SAM',
  RETIRED: 'RE',
  EXPIRED: 'EX',
} as const;

export type PlanStatusCode = (typeof PLAN_STATUS_CODE)[keyof typeof PLAN_STATUS_CODE];

/**
 * Amendment types for Range Use Plans.
 */
export const AMENDMENT_TYPE = {
  MINOR: 'MNA',
  MANDATORY: 'MA',
  INITIAL: 'A',
} as const;

export type AmendmentTypeCode = (typeof AMENDMENT_TYPE)[keyof typeof AMENDMENT_TYPE];

/**
 * Plan extension status values.
 */
export const PLAN_EXTENSION_STATUS = {
  AWAITING_VOTES: 1,
  AGREEMENT_HOLDER_REJECTED: 2,
  STAFF_REJECTED: 6,
  DISTRICT_MANAGER_REJECTED: 7,
  AWAITING_EXTENSION: 3,
  EXTENDED: 4,
  IS_EXTENSION: 5,
  REPLACEMENT_PLAN_CREATED: 8,
  INACTIVE_REPLACEMENT_PLAN: 9,
  ACTIVE_REPLACEMENT_PLAN: 10,
  REPLACED_WITH_REPLACEMENT_PLAN: 11,
} as const;

export type PlanExtensionStatusValue = (typeof PLAN_EXTENSION_STATUS)[keyof typeof PLAN_EXTENSION_STATUS];
