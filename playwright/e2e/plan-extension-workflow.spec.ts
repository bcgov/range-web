import { expect, request, test, type APIRequestContext, type Page } from '@playwright/test';
import { loginPageAs as runtimeLoginPageAs } from './support/authRuntime';
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
import { createPlanExtensionSeedByDb, simulateExtensionBackgroundJobByDb } from './support/planExtensionSeedRuntime';
import {
  approveExtensionVote,
  createReplacementPlan,
  extendPlan,
  fetchPlanById,
  forwardExtensionForDecision,
  rejectExtensionVote,
  type ApiActor,
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

const loginApiActors = async ({ page }: { page: Page }): Promise<Record<ExtensionRoleCode, ApiActor>> => {
  const roles: ExtensionRoleCode[] = ['SA', 'AH', 'DM'];
  const entries: Array<[ExtensionRoleCode, ApiActor]> = [];
  const userRecord = await getSingleUserRecordForDb();

  for (const roleCode of roles) {
    await setUserRoleById({ userId: userRecord.id, roleId: extensionRoleByCode[roleCode] });
    const token = await loginPageAs({ page, roleCode });
    entries.push([roleCode, { token, roleCode }]);
  }

  await setUserRoleById({ userId: userRecord.id, roleId: extensionRoleByCode.SA });
  return Object.fromEntries(entries) as Record<ExtensionRoleCode, ApiActor>;
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
  let apiContext: APIRequestContext;
  let cleanupAgreementIds: string[] = [];

  test.beforeAll(async () => {
    apiContext = await request.newContext();
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
      await setUserRoleById({ userId: userRecord.id, roleId: extensionRoleByCode[roleCode] });
      const token = await loginPageAs({ page, roleCode });
      expect(token.length).toBeGreaterThan(20);
      await expect(page).toHaveURL(/select-range-use-plan|home/);
      logE2E(`validated login+landing for role=${roleCode}`);
    }
  });

  test('simulates extension background job artifacts', async ({ page }) => {
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

    const planSnapshot = await fetchPlanById({
      apiContext,
      token: await loginPageAs({ page, roleCode: 'SA' }),
      getApiBaseUrl,
      planId: seeded.planId,
    });
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
    const actors = await loginApiActors({ page });
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

    const eligiblePlan = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: eligibleSeed.planId,
    });

    assertExtensionState({
      plan: eligiblePlan,
      expected: {
        extensionStatus: PLAN_EXTENSION_STATUS.AWAITING_VOTES,
        extensionRequiredVotes: eligibleJobResult.requiredVotes,
        extensionReceivedVotes: 0,
      },
    });

    const ineligiblePlan = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: ineligibleSeed.planId,
    });

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
    const actors = await loginApiActors({ page });
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe002',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const jobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    for (const extensionRequestId of jobResult.extensionRequestIds) {
      await approveExtensionVote({
        apiContext,
        token: actors.AH.token,
        getApiBaseUrl,
        planId: seeded.planId,
        extensionRequestId,
      });
    }

    const approvedPlan = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });

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
    const actors = await loginApiActors({ page });
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe003',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const jobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });
    for (const extensionRequestId of jobResult.extensionRequestIds) {
      await approveExtensionVote({
        apiContext,
        token: actors.AH.token,
        getApiBaseUrl,
        planId: seeded.planId,
        extensionRequestId,
      });
    }

    await forwardExtensionForDecision({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });

    const planAfterForward = await fetchPlanById({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
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
    const actors = await loginApiActors({ page });
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe004',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const jobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });
    for (const extensionRequestId of jobResult.extensionRequestIds) {
      await approveExtensionVote({
        apiContext,
        token: actors.AH.token,
        getApiBaseUrl,
        planId: seeded.planId,
        extensionRequestId,
      });
    }
    await forwardExtensionForDecision({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });

    const beforeExtend = await fetchPlanById({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    const defaultExpectedDate = makeFutureDate({ currentPlanEndDate: beforeExtend.planEndDate, yearsToAdd: 5 });

    const extendResponse = await extendPlan({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
      endDate: defaultExpectedDate,
    });
    expect(String(extendResponse.planId)).toBe(seeded.planId);

    const afterExtend = await fetchPlanById({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });

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
    const actors = await loginApiActors({ page });
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe005',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const jobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    await rejectExtensionVote({
      apiContext,
      token: actors.AH.token,
      getApiBaseUrl,
      planId: seeded.planId,
      extensionRequestId: jobResult.extensionRequestIds[0],
    });

    const afterReject = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.AGREEMENT_HOLDER_REJECTED },
    });

    const replacement = await createReplacementPlan({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('PE-006 Staff rejection sets Staff Rejected and allows replacement plan', async ({ page }) => {
    const actors = await loginApiActors({ page });
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe006',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const jobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    const rejectResult = await rejectExtensionVote({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
      extensionRequestId: jobResult.extensionRequestIds[0],
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.STAFF_REJECTED);

    const afterReject = await fetchPlanById({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.STAFF_REJECTED },
    });

    const replacement = await createReplacementPlan({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('PE-007 DM rejection sets District Manager Rejected and allows replacement plan', async ({ page }) => {
    const actors = await loginApiActors({ page });
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'pe007',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const jobResult = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });
    for (const extensionRequestId of jobResult.extensionRequestIds) {
      await approveExtensionVote({
        apiContext,
        token: actors.AH.token,
        getApiBaseUrl,
        planId: seeded.planId,
        extensionRequestId,
      });
    }
    await forwardExtensionForDecision({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });

    const rejectResult = await rejectExtensionVote({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
      extensionRequestId: jobResult.extensionRequestIds[0],
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED);

    const afterReject = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    assertExtensionState({
      plan: afterReject,
      expected: { extensionStatus: PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED },
    });

    const replacement = await createReplacementPlan({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    expect(replacement.replacementPlan.id).toBeGreaterThan(0);
  });

  test('cross-role matrix validation for core extension stages', async ({ page }) => {
    const actors = await loginApiActors({ page });
    const userRecord = await getSingleUserRecordForDb();
    const seeded = await createPlanExtensionSeedByDb({
      getDbPool,
      testCase: 'matrix',
      e2ePrefix: 'E2E-EXT',
      singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
      districtCode: getTestDistrictCode(),
      sourceAgreementId: getSeedSourceAgreementId(),
      eligibility: 'eligible',
      additionalClientCount: 1,
    });
    cleanupAgreementIds.push(seeded.agreementId);

    const seededRequests = await simulateExtensionBackgroundJobByDb({
      getDbPool,
      planId: seeded.planId,
      agreementId: seeded.agreementId,
      fallbackUserId: userRecord.id,
    });

    const awaitingVotes = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    assertActionVisibilityByRole({ role: 'AH', plan: awaitingVotes, expected: { canVote: true, canReject: true } });
    assertActionVisibilityByRole({
      role: 'SA',
      plan: awaitingVotes,
      isStaffOwner: true,
      expected: { canReject: true, canForward: false },
    });
    assertActionVisibilityByRole({ role: 'DM', plan: awaitingVotes, expected: { canReject: true, canApprove: false } });

    for (const extensionRequestId of seededRequests.extensionRequestIds) {
      await approveExtensionVote({
        apiContext,
        token: actors.AH.token,
        getApiBaseUrl,
        planId: seeded.planId,
        extensionRequestId,
      });
    }

    const allYes = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
    assertActionVisibilityByRole({ role: 'AH', plan: allYes, expected: { canVote: true } });
    assertActionVisibilityByRole({ role: 'SA', plan: allYes, isStaffOwner: true, expected: { canForward: true } });
    assertActionVisibilityByRole({ role: 'DM', plan: allYes, expected: { canApprove: false, canReject: true } });

    await forwardExtensionForDecision({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });

    const awaitingExtension = await fetchPlanById({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
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

    const rejectResult = await rejectExtensionVote({
      apiContext,
      token: actors.DM.token,
      getApiBaseUrl,
      planId: seeded.planId,
      extensionRequestId: seededRequests.extensionRequestIds[0],
    });
    expect(rejectResult.extensionStatus).toBe(PLAN_EXTENSION_STATUS.DISTRICT_MANAGER_REJECTED);

    const dmRejected = await fetchPlanById({
      apiContext,
      token: actors.SA.token,
      getApiBaseUrl,
      planId: seeded.planId,
    });
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
