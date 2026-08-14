import { expect } from '@playwright/test';

export const PLAN_EXTENSION_STATUS = {
  AWAITING_VOTES: 1,
  AGREEMENT_HOLDER_REJECTED: 2,
  AWAITING_EXTENSION: 3,
  EXTENDED: 4,
  IS_EXTENSION: 5,
  STAFF_REJECTED: 6,
  DISTRICT_MANAGER_REJECTED: 7,
  REPLACEMENT_PLAN_CREATED: 8,
  INACTIVE_REPLACEMENT_PLAN: 9,
  ACTIVE_REPLACEMENT_PLAN: 10,
  REPLACED_WITH_REPLACEMENT_PLAN: 11,
} as const;

export type ExtensionRoleCode = 'AH' | 'SA' | 'DM';

export type ExtensionPlanSnapshot = {
  id: number;
  planEndDate: string;
  extensionStatus: number | null;
  extensionRequiredVotes: number | null;
  extensionReceivedVotes: number | null;
  extensionDate?: string | null;
  replacementPlanId?: number | null;
  replacementOf?: number | null;
};

type ExpectedActions = {
  canVote: boolean;
  canForward: boolean;
  canApprove: boolean;
  canReject: boolean;
};

export const getExpectedActions = ({
  role,
  plan,
  isStaffOwner,
}: {
  role: ExtensionRoleCode;
  plan: ExtensionPlanSnapshot;
  isStaffOwner?: boolean;
}): ExpectedActions => {
  const status = plan.extensionStatus;
  const votesDone = Number(plan.extensionReceivedVotes || 0) >= Number(plan.extensionRequiredVotes || 0);

  if (role === 'AH') {
    return {
      canVote: status === PLAN_EXTENSION_STATUS.AWAITING_VOTES,
      canForward: false,
      canApprove: false,
      canReject: status === PLAN_EXTENSION_STATUS.AWAITING_VOTES,
    };
  }

  if (role === 'SA') {
    return {
      canVote: false,
      canForward: status === PLAN_EXTENSION_STATUS.AWAITING_VOTES && votesDone && Boolean(isStaffOwner),
      canApprove: false,
      canReject: status === PLAN_EXTENSION_STATUS.AWAITING_VOTES || status === PLAN_EXTENSION_STATUS.AWAITING_EXTENSION,
    };
  }

  return {
    canVote: false,
    canForward: false,
    canApprove: status === PLAN_EXTENSION_STATUS.AWAITING_EXTENSION && votesDone,
    canReject: status === PLAN_EXTENSION_STATUS.AWAITING_VOTES || status === PLAN_EXTENSION_STATUS.AWAITING_EXTENSION,
  };
};

export const assertExtensionState = ({
  plan,
  expected,
}: {
  plan: ExtensionPlanSnapshot;
  expected: Partial<ExtensionPlanSnapshot>;
}) => {
  if (Object.prototype.hasOwnProperty.call(expected, 'extensionStatus')) {
    expect(plan.extensionStatus).toBe(expected.extensionStatus);
  }
  if (Object.prototype.hasOwnProperty.call(expected, 'extensionRequiredVotes')) {
    expect(plan.extensionRequiredVotes).toBe(expected.extensionRequiredVotes);
  }
  if (Object.prototype.hasOwnProperty.call(expected, 'extensionReceivedVotes')) {
    expect(plan.extensionReceivedVotes).toBe(expected.extensionReceivedVotes);
  }
  if (Object.prototype.hasOwnProperty.call(expected, 'replacementPlanId')) {
    expect(plan.replacementPlanId).toBe(expected.replacementPlanId);
  }
};

export const assertActionVisibilityByRole = ({
  role,
  plan,
  expected,
  isStaffOwner,
}: {
  role: ExtensionRoleCode;
  plan: ExtensionPlanSnapshot;
  expected: Partial<ExpectedActions>;
  isStaffOwner?: boolean;
}) => {
  const computed = getExpectedActions({ role, plan, isStaffOwner });
  if (Object.prototype.hasOwnProperty.call(expected, 'canVote')) {
    expect(computed.canVote).toBe(expected.canVote);
  }
  if (Object.prototype.hasOwnProperty.call(expected, 'canForward')) {
    expect(computed.canForward).toBe(expected.canForward);
  }
  if (Object.prototype.hasOwnProperty.call(expected, 'canApprove')) {
    expect(computed.canApprove).toBe(expected.canApprove);
  }
  if (Object.prototype.hasOwnProperty.call(expected, 'canReject')) {
    expect(computed.canReject).toBe(expected.canReject);
  }
};
