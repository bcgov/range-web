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

const logE2E = (message: string) => {
  console.log(`[E2E:EXT] ${message}`);
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
  });
});
