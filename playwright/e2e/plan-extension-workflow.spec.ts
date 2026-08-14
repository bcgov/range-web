import fs from 'fs/promises';
import path from 'path';
import { expect, request, test, type APIRequestContext, type Page } from '@playwright/test';
import {
  clearSession,
  loginPageAs as runtimeLoginPageAs,
  switchRoleAndRelogin as runtimeSwitchRoleAndRelogin,
} from './support/authRuntime';
import {
  getDbPool,
  getSeedSourceAgreementId,
  extensionRoleByCode,
  getApiBaseUrl,
  getSingleUserLoginMode,
  getSingleUserPassword,
  getSingleUserRecordForDb,
  getSingleUserSsoCandidatesForDb,
  getSingleUserUsername,
  getTestDistrictCode,
  isSingleUserMode,
  setUserRoleById,
  type ExtensionRoleCode,
} from './support/extensionRuntime';
import { cleanupSeedDataByAgreementIds } from './support/dbRuntime';
import {
  createPlanExtensionSeedByDb as runtimeCreatePlanExtensionSeedByDb,
  getExtensionRequestIdsByClient as runtimeGetExtensionRequestIdsByClient,
  readPlanExtensionStateByDb as runtimeReadPlanExtensionStateByDb,
  simulateExtensionBackgroundJobByDb,
} from './support/planExtensionSeedRuntime';
import {
  approveExtensionVote,
  createReplacementPlan,
  extendPlan,
  forwardExtensionForDecision,
  rejectExtensionVote,
} from './support/planExtensionFlowRuntime';
import {
  assertActionVisibilityByRole,
  assertExtensionState,
  PLAN_EXTENSION_STATUS,
  type ExtensionPlanSnapshot,
} from './support/planExtensionAssertions';

const logE2E = (message: string) => {
  console.log(`[E2E:EXT] ${message}`);
};

let cachedSingleUserRecord: { id: number; sso_id: string } | null = null;
let apiContext: APIRequestContext;
let lastPlanSnapshot: ExtensionPlanSnapshot | null = null;

const syncCachedUserRecordFromPage = async (page: Page) => {
  await page.goto('/');
  const profile = await page.evaluate(() => JSON.parse(localStorage.getItem('range-web-user') || '{}'));
  if (!profile.id) {
    return null;
  }

  cachedSingleUserRecord = {
    id: Number(profile.id),
    sso_id: String(profile.ssoId || profile.sso_id || ''),
  };
  return cachedSingleUserRecord;
};

const switchRoleAndRelogin = async ({ page, roleCode }: { page: Page; roleCode: ExtensionRoleCode }) => {
  return runtimeSwitchRoleAndRelogin({
    page,
    roleCode,
    roleByCode: extensionRoleByCode,
    getSingleUserRecord: async () => {
      if (!cachedSingleUserRecord) {
        cachedSingleUserRecord = await getSingleUserRecordForDb();
      }
      return cachedSingleUserRecord;
    },
    setUserRoleById,
    loginPageAs,
    apiBaseUrl: getApiBaseUrl(),
    logE2E,
  });
};

const switchRoleAndFreshLogin = async ({ page, roleCode }: { page: Page; roleCode: ExtensionRoleCode }) => {
  const userRecord = cachedSingleUserRecord || (await getSingleUserRecordForDb());
  cachedSingleUserRecord = userRecord;
  await setUserRoleById({ userId: userRecord.id, roleId: extensionRoleByCode[roleCode] });
  await clearSession(page);
  return loginPageAs({ page, roleCode });
};

const getCurrentUserId = async (): Promise<number> => {
  if (!cachedSingleUserRecord) {
    cachedSingleUserRecord = await getSingleUserRecordForDb();
  }
  return cachedSingleUserRecord.id;
};

const createPlanExtensionSeedByDb = async (
  args: Omit<Parameters<typeof runtimeCreatePlanExtensionSeedByDb>[0], 'singleUserId'>,
) => runtimeCreatePlanExtensionSeedByDb({ ...args, singleUserId: await getCurrentUserId() });

const getExtensionRequestIdsByClient = async ({
  planId,
  clientIds,
}: {
  planId: string;
  clientIds: string[];
}): Promise<number[]> => runtimeGetExtensionRequestIdsByClient({ getDbPool, planId, clientIds });

const readPlanExtensionState = async ({ planId }: { planId: string }): Promise<ExtensionPlanSnapshot> => {
  const snapshot = await runtimeReadPlanExtensionStateByDb({ getDbPool, planId });
  lastPlanSnapshot = snapshot;
  return snapshot;
};

const asRole = async <T>({
  page,
  roleCode,
  run,
}: {
  page: Page;
  roleCode: ExtensionRoleCode;
  run: (token: string) => Promise<T>;
}): Promise<T> => {
  const token = await switchRoleAndFreshLogin({ page, roleCode });
  return run(token);
};

const approveVoteAsAh = async ({
  page,
  planId,
  extensionRequestId,
}: {
  page: Page;
  planId: string;
  extensionRequestId: number;
}) =>
  asRole({
    page,
    roleCode: 'AH',
    run: (token) =>
      approveExtensionVote({
        apiContext,
        token,
        getApiBaseUrl,
        planId,
        extensionRequestId,
      }),
  });

const getPrimaryExtensionRequestId = async ({
  planId,
  clientId,
}: {
  planId: string;
  clientId: string;
}): Promise<number> => {
  const requestIds = await getExtensionRequestIdsByClient({ planId, clientIds: [clientId] });
  if (requestIds.length === 0) {
    throw new Error(`No extension request found for plan=${planId} client=${clientId}`);
  }
  return requestIds[0];
};

const rejectVoteAs = async ({
  page,
  roleCode,
  planId,
  extensionRequestId,
}: {
  page: Page;
  roleCode: ExtensionRoleCode;
  planId: string;
  extensionRequestId: number;
}) =>
  asRole({
    page,
    roleCode,
    run: (token) =>
      rejectExtensionVote({
        apiContext,
        token,
        getApiBaseUrl,
        planId,
        extensionRequestId,
      }),
  });

const forwardAsStaff = async ({ page, planId }: { page: Page; planId: string }) =>
  asRole({
    page,
    roleCode: 'SA',
    run: (token) =>
      forwardExtensionForDecision({
        apiContext,
        token,
        getApiBaseUrl,
        planId,
      }),
  });

const extendAsDm = async ({ page, planId, endDate }: { page: Page; planId: string; endDate: string }) =>
  asRole({
    page,
    roleCode: 'DM',
    run: (token) =>
      extendPlan({
        apiContext,
        token,
        getApiBaseUrl,
        planId,
        endDate,
      }),
  });

const createReplacementAs = async ({ page, roleCode, planId }: { page: Page; roleCode: 'SA' | 'DM'; planId: string }) =>
  asRole({
    page,
    roleCode,
    run: (token) =>
      createReplacementPlan({
        apiContext,
        token,
        getApiBaseUrl,
        planId,
      }),
  });

type ExtensionScenarioContext = {
  seeded: Awaited<ReturnType<typeof createPlanExtensionSeedByDb>>;
  userRecord: Awaited<ReturnType<typeof getSingleUserRecordForDb>>;
  seedRequests: () => ReturnType<typeof simulateExtensionBackgroundJobByDb>;
  getPrimaryRequestId: () => Promise<number>;
  approvePrimaryAsAh: () => Promise<unknown>;
  forwardAsStaff: () => Promise<unknown>;
  readPlan: () => Promise<ExtensionPlanSnapshot>;
};

const createExtensionScenarioContext = async ({
  page,
  testCase,
  eligibility = 'eligible',
  additionalClientCount = 0,
  onAgreementSeeded,
}: {
  page: Page;
  testCase: string;
  eligibility?: 'eligible' | 'ineligible';
  additionalClientCount?: number;
  onAgreementSeeded: (agreementId: string) => void;
}): Promise<ExtensionScenarioContext> => {
  await syncCachedUserRecordFromPage(page);
  const userRecord = cachedSingleUserRecord || (await getSingleUserRecordForDb());
  cachedSingleUserRecord = userRecord;
  const seeded = await createPlanExtensionSeedByDb({
    getDbPool,
    testCase,
    e2ePrefix: 'E2E-EXT',
    singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
    districtCode: getTestDistrictCode(),
    sourceAgreementId: getSeedSourceAgreementId(),
    eligibility,
    additionalClientCount,
  });
  onAgreementSeeded(seeded.agreementId);

  const seedRequests = () =>
    simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

  const getPrimaryRequestId = () =>
    getPrimaryExtensionRequestId({
      planId: seeded.planId,
      clientId: seeded.primaryClientNumber,
    });

  const approvePrimaryAsAh = async () => {
    const extensionRequestId = await getPrimaryRequestId();
    return approveVoteAsAh({ page, planId: seeded.planId, extensionRequestId });
  };

  const forwardAsStaffForScenario = () => forwardAsStaff({ page, planId: seeded.planId });

  const readPlan = () => readPlanExtensionState({ planId: seeded.planId });

  return {
    seeded,
    userRecord,
    seedRequests,
    getPrimaryRequestId,
    approvePrimaryAsAh,
    forwardAsStaff: forwardAsStaffForScenario,
    readPlan,
  };
};

const makeFutureDate = ({
  currentPlanEndDate,
  yearsToAdd,
}: {
  currentPlanEndDate: string;
  yearsToAdd: number;
}): string => {
  const value = new Date(`${currentPlanEndDate}T00:00:00Z`);
  value.setUTCFullYear(value.getUTCFullYear() + yearsToAdd);
  return value.toISOString().slice(0, 10);
};

const loginPageAs = async ({ page, roleCode }: { page: Page; roleCode: ExtensionRoleCode }): Promise<string> => {
  return runtimeLoginPageAs({
    page,
    roleCode,
    username: getSingleUserUsername(),
    password: getSingleUserPassword(),
    loginMode: getSingleUserLoginMode(),
    apiBaseUrl: getApiBaseUrl(),
    logE2E,
  });
};

test.describe('Plan extension workflow harness', () => {
  let cleanupAgreementIds: string[] = [];

  test.beforeAll(async () => {
    apiContext = await request.newContext();
  });

  test.beforeEach(async ({ page }) => {
    await syncCachedUserRecordFromPage(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    void page;
    if (cleanupAgreementIds.length > 0) {
      await cleanupSeedDataByAgreementIds({ getDbPool, agreementIds: cleanupAgreementIds, logE2E });
      cleanupAgreementIds = [];
    }

    try {
      const userRecord = cachedSingleUserRecord || (await getSingleUserRecordForDb());
      await setUserRoleById({ userId: userRecord.id, roleId: extensionRoleByCode.SA });
    } catch (error) {
      logE2E(`could not reset role to SA: ${error instanceof Error ? error.message : 'unknown'}`);
    }

    if (testInfo.status !== testInfo.expectedStatus && lastPlanSnapshot) {
      const safeTitle = testInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const outputPath = path.join('playwright', 'artifacts', `${safeTitle}-last-extension-plan-snapshot.json`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(lastPlanSnapshot, null, 2), 'utf8');
    }

    lastPlanSnapshot = null;
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('boots role-switch harness for SA/AH/DM', async ({ page }) => {
    expect(isSingleUserMode()).toBeTruthy();

    const userRecord = await getSingleUserRecordForDb();
    expect(userRecord.id).toBeGreaterThan(0);

    const roleSequence: ExtensionRoleCode[] = ['SA', 'AH', 'DM', 'SA'];
    for (const roleCode of roleSequence) {
      const token = await switchRoleAndRelogin({ page, roleCode });
      expect(token.length).toBeGreaterThan(20);
      await expect(page).toHaveURL(/select-range-use-plan|home/);
      logE2E(`validated login+landing for role=${roleCode}`);
    }
  });

  test('simulates extension background job artifacts', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'background-job-sim',
      additionalClientCount: 1,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    const result = await scenario.seedRequests();

    expect(result.requiredVotes).toBeGreaterThanOrEqual(2);
    expect(result.extensionRequestIds.length).toBe(result.requiredVotes);

    const pool = getDbPool();
    const planRow = await pool.query(
      'SELECT extension_status, extension_required_votes, extension_received_votes FROM plan WHERE id = $1',
      [scenario.seeded.planId],
    );
    await pool.end();

    expect(planRow.rowCount).toBe(1);
    expect(Number(planRow.rows[0].extension_status)).toBe(1);
    expect(Number(planRow.rows[0].extension_required_votes)).toBe(result.requiredVotes);
    expect(Number(planRow.rows[0].extension_received_votes)).toBe(0);

    const planSnapshot = await readPlanExtensionState({ planId: scenario.seeded.planId });
    expect(planSnapshot.extensionStatus).toBe(PLAN_EXTENSION_STATUS.AWAITING_VOTES);
    expect(planSnapshot.extensionRequiredVotes).toBe(result.requiredVotes);
    expect(planSnapshot.extensionReceivedVotes).toBe(0);
  });

  test('shared extension assertion helpers validate states and role action expectations', async () => {
    const planSnapshot: ExtensionPlanSnapshot = {
      id: 999999,
      planEndDate: '2032-05-01',
      extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_EXTENSION,
      extensionRequiredVotes: 2,
      extensionReceivedVotes: 2,
      extensionDate: null,
      replacementPlanId: null,
      replacementOf: null,
    };

    assertExtensionState({
      plan: planSnapshot,
      expected: {
        extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_EXTENSION,
        extensionRequiredVotes: 2,
        extensionReceivedVotes: 2,
      },
    });

    assertActionVisibilityByRole({
      role: 'AH',
      plan: planSnapshot,
      expected: { canVote: false, canApprove: false, canForward: false, canReject: false },
    });

    assertActionVisibilityByRole({
      role: 'SA',
      plan: {
        ...planSnapshot,
        extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_VOTES,
      },
      isStaffOwner: true,
      expected: { canForward: true, canApprove: false, canVote: false, canReject: true },
    });

    assertActionVisibilityByRole({
      role: 'DM',
      plan: planSnapshot,
      expected: { canApprove: true, canReject: true, canForward: false, canVote: false },
    });
  });

  test('PE-001 eligible plan initializes extension and ineligible plan does not', async ({ page }) => {
    const eligibleScenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe001-eligible',
      eligibility: 'eligible',
      additionalClientCount: 1,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });
    const ineligibleScenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe001-ineligible',
      eligibility: 'ineligible',
      additionalClientCount: 1,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    const eligibleJobResult = await eligibleScenario.seedRequests();
    expect(eligibleJobResult.requiredVotes).toBeGreaterThanOrEqual(2);

    const eligiblePlan = await readPlanExtensionState({ planId: eligibleScenario.seeded.planId });

    assertExtensionState({
      plan: eligiblePlan,
      expected: {
        extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_VOTES,
        extensionRequiredVotes: eligibleJobResult.requiredVotes,
        extensionReceivedVotes: 0,
      },
    });

    const ineligiblePlan = await readPlanExtensionState({ planId: ineligibleScenario.seeded.planId });

    assertExtensionState({
      plan: ineligiblePlan,
      expected: {
        extensionStatus: null,
        extensionRequiredVotes: 0,
        extensionReceivedVotes: 0,
      },
    });
  });

  test('PE-002 AH unanimous yes enables staff forward', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe002',
      additionalClientCount: 0,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    const jobResult = await scenario.seedRequests();
    await scenario.approvePrimaryAsAh();

    const approvedPlan = await scenario.readPlan();

    assertExtensionState({
      plan: approvedPlan,
      expected: {
        extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_VOTES,
        extensionRequiredVotes: jobResult.requiredVotes,
        extensionReceivedVotes: jobResult.requiredVotes,
      },
    });

    assertActionVisibilityByRole({
      role: 'SA',
      plan: approvedPlan,
      isStaffOwner: true,
      expected: { canForward: true },
    });
  });

  test('PE-003 staff forwards to awaiting extension and DM can act', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe003',
      additionalClientCount: 0,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    await scenario.seedRequests();
    await scenario.approvePrimaryAsAh();
    await scenario.forwardAsStaff();

    const planAfterForward = await scenario.readPlan();
    assertExtensionState({
      plan: planAfterForward,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_EXTENSION },
    });
    assertActionVisibilityByRole({
      role: 'DM',
      plan: planAfterForward,
      expected: { canApprove: true, canReject: true },
    });
  });

  test('PE-004 DM extends plan with expected date behavior', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe004',
      additionalClientCount: 0,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    await scenario.seedRequests();
    await scenario.approvePrimaryAsAh();
    await scenario.forwardAsStaff();

    const beforeExtend = await scenario.readPlan();
    const defaultExpectedDate = makeFutureDate({ currentPlanEndDate: beforeExtend.planEndDate, yearsToAdd: 5 });

    const extendResponse = await extendAsDm({ page, planId: scenario.seeded.planId, endDate: defaultExpectedDate });
    expect(String(extendResponse.planId)).toBe(scenario.seeded.planId);

    const afterExtend = await scenario.readPlan();

    assertExtensionState({
      plan: afterExtend,
      expected: {
        extensionStatus: PLAN_EXTENSION_STATUS.EXTENDED,
      },
    });
    expect(afterExtend.planEndDate).toContain(defaultExpectedDate);
    expect(afterExtend.extensionDate).not.toBeNull();
  });

  test('PE-005 AH rejection sets Agreement Holder Rejected and allows replacement plan', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe005',
      additionalClientCount: 0,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    await scenario.seedRequests();

    const primaryRequestId = await scenario.getPrimaryRequestId();
    await rejectVoteAs({ page, roleCode: 'AH', planId: scenario.seeded.planId, extensionRequestId: primaryRequestId });

    const afterReject = await scenario.readPlan();
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED },
    });

    const replacement = await createReplacementAs({ page, roleCode: 'SA', planId: scenario.seeded.planId });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('PE-006 Staff rejection sets Staff Rejected and allows replacement plan', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe006',
      additionalClientCount: 0,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    await scenario.seedRequests();

    const primaryRequestId = await scenario.getPrimaryRequestId();
    await approveVoteAsAh({ page, planId: scenario.seeded.planId, extensionRequestId: primaryRequestId });
    const rejectResult = await rejectVoteAs({
      page,
      roleCode: 'SA',
      planId: scenario.seeded.planId,
      extensionRequestId: primaryRequestId,
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.STAFF_REJECTED);

    const afterReject = await scenario.readPlan();
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.STAFF_REJECTED },
    });

    const replacement = await createReplacementAs({ page, roleCode: 'SA', planId: scenario.seeded.planId });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('PE-007 DM rejection sets District Manager Rejected and allows replacement plan', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'pe007',
      additionalClientCount: 0,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    await scenario.seedRequests();
    const primaryRequestId = await scenario.getPrimaryRequestId();
    await approveVoteAsAh({ page, planId: scenario.seeded.planId, extensionRequestId: primaryRequestId });
    await scenario.forwardAsStaff();

    const rejectResult = await rejectVoteAs({
      page,
      roleCode: 'DM',
      planId: scenario.seeded.planId,
      extensionRequestId: primaryRequestId,
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED);

    const afterReject = await scenario.readPlan();
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED },
    });

    const replacement = await createReplacementAs({ page, roleCode: 'DM', planId: scenario.seeded.planId });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('cross-role matrix validation for core extension stages', async ({ page }) => {
    const scenario = await createExtensionScenarioContext({
      page,
      testCase: 'matrix',
      additionalClientCount: 0,
      onAgreementSeeded: (agreementId) => cleanupAgreementIds.push(agreementId),
    });

    await scenario.seedRequests();

    const awaitingVotes = await scenario.readPlan();
    assertActionVisibilityByRole({ role: 'AH', plan: awaitingVotes, expected: { canVote: true, canReject: true } });
    assertActionVisibilityByRole({
      role: 'SA',
      plan: awaitingVotes,
      isStaffOwner: true,
      expected: { canReject: true, canForward: false },
    });
    assertActionVisibilityByRole({ role: 'DM', plan: awaitingVotes, expected: { canReject: true, canApprove: false } });

    const primaryRequestId = await scenario.getPrimaryRequestId();
    await approveVoteAsAh({ page, planId: scenario.seeded.planId, extensionRequestId: primaryRequestId });

    const allYes = await scenario.readPlan();
    assertActionVisibilityByRole({ role: 'AH', plan: allYes, expected: { canVote: true } });
    assertActionVisibilityByRole({ role: 'SA', plan: allYes, isStaffOwner: true, expected: { canForward: true } });
    assertActionVisibilityByRole({ role: 'DM', plan: allYes, expected: { canApprove: false, canReject: true } });

    await scenario.forwardAsStaff();

    const awaitingExtension = await scenario.readPlan();
    assertActionVisibilityByRole({
      role: 'AH',
      plan: awaitingExtension,
      expected: { canVote: false, canReject: false },
    });
    assertActionVisibilityByRole({
      role: 'SA',
      plan: awaitingExtension,
      isStaffOwner: true,
      expected: { canForward: false, canReject: true },
    });
    assertActionVisibilityByRole({
      role: 'DM',
      plan: awaitingExtension,
      expected: { canApprove: true, canReject: true },
    });

    const rejectResult = await rejectVoteAs({
      page,
      roleCode: 'DM',
      planId: scenario.seeded.planId,
      extensionRequestId: primaryRequestId,
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED);

    const dmRejected = await scenario.readPlan();
    assertActionVisibilityByRole({ role: 'AH', plan: dmRejected, expected: { canVote: false, canReject: false } });
    assertActionVisibilityByRole({
      role: 'SA',
      plan: dmRejected,
      isStaffOwner: true,
      expected: { canForward: false, canReject: false },
    });
    assertActionVisibilityByRole({ role: 'DM', plan: dmRejected, expected: { canApprove: false, canReject: false } });
  });
});
