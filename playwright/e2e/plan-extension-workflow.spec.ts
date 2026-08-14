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

const getExtensionRequestIdsByClient = async ({
  planId,
  clientIds,
}: {
  planId: string;
  clientIds: string[];
}): Promise<number[]> => {
  const pool = getDbPool();
  const result = await pool.query(
    `
      SELECT id
      FROM plan_extension_requests
      WHERE plan_id = $1
        AND client_id = ANY($2::text[])
      ORDER BY id ASC
    `,
    [planId, clientIds],
  );
  await pool.end();
  return result.rows.map((row: { id: number }) => Number(row.id));
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

const readPlanExtensionStateByDb = async ({ planId }: { planId: string }): Promise<ExtensionPlanSnapshot> => {
  const pool = getDbPool();
  const result = await pool.query(
    `
      SELECT
        id,
        to_char(plan_end_date::date, 'YYYY-MM-DD') AS plan_end_date,
        extension_status,
        extension_required_votes,
        extension_received_votes,
        to_char(extension_date::date, 'YYYY-MM-DD') AS extension_date,
        replacement_plan_id,
        replacement_of
      FROM plan
      WHERE id = $1
    `,
    [planId],
  );
  await pool.end();

  if (result.rowCount !== 1) {
    throw new Error(`Could not load plan ${planId} from DB`);
  }

  const row = result.rows[0];
  return {
    id: Number(row.id),
    planEndDate: row.plan_end_date,
    extensionStatus: row.extension_status === null ? null : Number(row.extension_status),
    extensionRequiredVotes: row.extension_required_votes === null ? null : Number(row.extension_required_votes),
    extensionReceivedVotes: row.extension_received_votes === null ? null : Number(row.extension_received_votes),
    extensionDate: row.extension_date,
    replacementPlanId: row.replacement_plan_id === null ? null : Number(row.replacement_plan_id),
    replacementOf: row.replacement_of === null ? null : Number(row.replacement_of),
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
    await page.goto('/');
    const profile = await page.evaluate(() => JSON.parse(localStorage.getItem('range-web-user') || '{}'));
    if (profile.id) {
      cachedSingleUserRecord = { id: Number(profile.id), sso_id: profile.ssoId || profile.sso_id || '' };
    }
  });

  test.afterEach(async () => {
    if (cleanupAgreementIds.length > 0) {
      await cleanupSeedDataByAgreementIds({ getDbPool, agreementIds: cleanupAgreementIds, logE2E });
      cleanupAgreementIds = [];
    }

    try {
      const userRecord = await getSingleUserRecordForDb();
      await setUserRoleById({ userId: userRecord.id, roleId: extensionRoleByCode.SA });
    } catch (error) {
      logE2E(`could not reset role to SA: ${error instanceof Error ? error.message : 'unknown'}`);
    }
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

  test('simulates extension background job artifacts', async () => {
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'background-job-sim',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const result = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    expect(result.requiredVotes).toBeGreaterThanOrEqual(2);
    expect(result.extensionRequestIds.length).toBe(result.requiredVotes);

    const pool = getDbPool();
    const planRow = await pool.query(
      'SELECT extension_status, extension_required_votes, extension_received_votes FROM plan WHERE id = $1',
      [seeded.planId],
    );
    await pool.end();

    expect(planRow.rowCount).toBe(1);
    expect(Number(planRow.rows[0].extension_status)).toBe(1);
    expect(Number(planRow.rows[0].extension_required_votes)).toBe(result.requiredVotes);
    expect(Number(planRow.rows[0].extension_received_votes)).toBe(0);

    const planSnapshot = await readPlanExtensionStateByDb({ planId: seeded.planId });
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

  test('PE-001 eligible plan initializes extension and ineligible plan does not', async () => {
    const userRecord = await getSingleUserRecordForDb();

    const eligibleSeed = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe001-eligible',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    const ineligibleSeed = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe001-ineligible',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'ineligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(eligibleSeed.agreementId, ineligibleSeed.agreementId);

    const eligibleJobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: eligibleSeed.planId,
      agreementId: eligibleSeed.agreementId,
      fallbackUserId: userRecord.id,
    });
    expect(eligibleJobResult.requiredVotes).toBeGreaterThanOrEqual(2);

    const eligiblePlan = await readPlanExtensionStateByDb({ planId: eligibleSeed.planId });

    assertExtensionState({
      plan: eligiblePlan,
      expected: {
        extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_VOTES,
        extensionRequiredVotes: eligibleJobResult.requiredVotes,
        extensionReceivedVotes: 0,
      },
    });

    const ineligiblePlan = await readPlanExtensionStateByDb({ planId: ineligibleSeed.planId });

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
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe002',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 0,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const jobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    const ahRequestIds = await getExtensionRequestIdsByClient({
      planId: seeded.planId,
      clientIds: [seeded.primaryClientNumber],
    });
    await approveVoteAsAh({ page, planId: seeded.planId, extensionRequestId: ahRequestIds[0] });

    const approvedPlan = await readPlanExtensionStateByDb({ planId: seeded.planId });

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
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe003',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 0,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });
    const ahRequestIds = await getExtensionRequestIdsByClient({
      planId: seeded.planId,
      clientIds: [seeded.primaryClientNumber],
    });
    await approveVoteAsAh({ page, planId: seeded.planId, extensionRequestId: ahRequestIds[0] });

    await forwardAsStaff({ page, planId: seeded.planId });

    const planAfterForward = await readPlanExtensionStateByDb({ planId: seeded.planId });
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
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe004',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 0,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });
    const ahRequestIds = await getExtensionRequestIdsByClient({
      planId: seeded.planId,
      clientIds: [seeded.primaryClientNumber],
    });
    await approveVoteAsAh({ page, planId: seeded.planId, extensionRequestId: ahRequestIds[0] });
    await forwardAsStaff({ page, planId: seeded.planId });

    const beforeExtend = await readPlanExtensionStateByDb({ planId: seeded.planId });
    const defaultExpectedDate = makeFutureDate({ currentPlanEndDate: beforeExtend.planEndDate, yearsToAdd: 5 });

    const extendResponse = await extendAsDm({ page, planId: seeded.planId, endDate: defaultExpectedDate });
    expect(String(extendResponse.planId)).toBe(seeded.planId);

    const afterExtend = await readPlanExtensionStateByDb({ planId: seeded.planId });

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
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe005',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 0,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    const ahRequestIds = await getExtensionRequestIdsByClient({
      planId: seeded.planId,
      clientIds: [seeded.primaryClientNumber],
    });
    await rejectVoteAs({ page, roleCode: 'AH', planId: seeded.planId, extensionRequestId: ahRequestIds[0] });

    const afterReject = await readPlanExtensionStateByDb({ planId: seeded.planId });
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED },
    });

    const replacement = await createReplacementAs({ page, roleCode: 'SA', planId: seeded.planId });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('PE-006 Staff rejection sets Staff Rejected and allows replacement plan', async ({ page }) => {
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe006',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 0,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    const ahRequestIds = await getExtensionRequestIdsByClient({
      planId: seeded.planId,
      clientIds: [seeded.primaryClientNumber],
    });
    await approveVoteAsAh({ page, planId: seeded.planId, extensionRequestId: ahRequestIds[0] });
    const rejectResult = await rejectVoteAs({
      page,
      roleCode: 'SA',
      planId: seeded.planId,
      extensionRequestId: ahRequestIds[0],
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.STAFF_REJECTED);

    const afterReject = await readPlanExtensionStateByDb({ planId: seeded.planId });
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.STAFF_REJECTED },
    });

    const replacement = await createReplacementAs({ page, roleCode: 'SA', planId: seeded.planId });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('PE-007 DM rejection sets District Manager Rejected and allows replacement plan', async ({ page }) => {
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe007',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 0,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });
    const ahRequestIds = await getExtensionRequestIdsByClient({
      planId: seeded.planId,
      clientIds: [seeded.primaryClientNumber],
    });
    await approveVoteAsAh({ page, planId: seeded.planId, extensionRequestId: ahRequestIds[0] });
    await forwardAsStaff({ page, planId: seeded.planId });

    const rejectResult = await rejectVoteAs({
      page,
      roleCode: 'DM',
      planId: seeded.planId,
      extensionRequestId: ahRequestIds[0],
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED);

    const afterReject = await readPlanExtensionStateByDb({ planId: seeded.planId });
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED },
    });

    const replacement = await createReplacementAs({ page, roleCode: 'DM', planId: seeded.planId });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('cross-role matrix validation for core extension stages', async ({ page }) => {
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'matrix',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 0,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    const awaitingVotes = await readPlanExtensionStateByDb({ planId: seeded.planId });
    assertActionVisibilityByRole({ role: 'AH', plan: awaitingVotes, expected: { canVote: true, canReject: true } });
    assertActionVisibilityByRole({
      role: 'SA',
      plan: awaitingVotes,
      isStaffOwner: true,
      expected: { canReject: true, canForward: false },
    });
    assertActionVisibilityByRole({ role: 'DM', plan: awaitingVotes, expected: { canReject: true, canApprove: false } });

    const ahRequestIds = await getExtensionRequestIdsByClient({
      planId: seeded.planId,
      clientIds: [seeded.primaryClientNumber],
    });
    await approveVoteAsAh({ page, planId: seeded.planId, extensionRequestId: ahRequestIds[0] });

    const allYes = await readPlanExtensionStateByDb({ planId: seeded.planId });
    assertActionVisibilityByRole({ role: 'AH', plan: allYes, expected: { canVote: true } });
    assertActionVisibilityByRole({ role: 'SA', plan: allYes, isStaffOwner: true, expected: { canForward: true } });
    assertActionVisibilityByRole({ role: 'DM', plan: allYes, expected: { canApprove: false, canReject: true } });

    await forwardAsStaff({ page, planId: seeded.planId });

    const awaitingExtension = await readPlanExtensionStateByDb({ planId: seeded.planId });
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
      planId: seeded.planId,
      extensionRequestId: ahRequestIds[0],
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED);

    const dmRejected = await readPlanExtensionStateByDb({ planId: seeded.planId });
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
