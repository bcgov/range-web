import fs from 'fs/promises';
import path from 'path';
import { test, request, type APIRequestContext, type Page } from '@playwright/test';
import {
  loginPageAs as runtimeLoginPageAs,
  switchRoleAndRelogin as runtimeSwitchRoleAndRelogin,
  type WorkflowRoleCode,
} from './support/authRuntime';
import {
  createPlanSeedByDb as runtimeCreatePlanSeedByDb,
  cleanupSeedDataByAgreementIds as runtimeCleanupSeedDataByAgreementIds,
  updatePlanStatusViaDb as runtimeUpdatePlanStatusViaDb,
} from './support/dbRuntime';
import { type PlanSnapshot } from './support/actionRuntime';
import { ScenarioContext } from './support/scenarioRuntime';
import {
  extensionRoleByCode as roleByCode,
  getApiBaseUrl,
  getDbPool,
  getSeedSourceAgreementId,
  getSingleUserLoginMode,
  getSingleUserPassword,
  getSingleUserRecordForDb,
  getSingleUserSsoCandidatesForDb,
  getSingleUserUsername,
  getTestDistrictCode,
  isSingleUserMode,
  setUserRoleById,
} from './support/extensionRuntime';

const E2E_PREFIX = 'E2E-AUTO';

const logE2E = (message: string) => {
  console.log(`[E2E] ${message}`);
};

const TEST_CASES = {
  HAPPY_PATH: 'happy-path',
  CHANGE_LOOP: 'change-loop',
  NOT_READY: 'not-ready',
  REVIEW_HAPPY_PATH: 'review-happy-path',
  REVIEW_CHANGE_LOOP: 'review-change-loop',
  NOT_APPROVED: 'not-approved',
} as const;

type RoleCode = WorkflowRoleCode;

let cachedSingleUserRecord: { id: number; sso_id: string } | null = null;

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

const getCurrentUserId = async () => {
  if (!cachedSingleUserRecord) {
    cachedSingleUserRecord = await getSingleUserRecordForDb();
  }
  return cachedSingleUserRecord.id;
};

const createE2ENote = (testCase: string, fromCode: string, toCode: string): string =>
  `E2E:${testCase}:${fromCode}->${toCode}`;

const createPlanSeedByDb = async ({
  testCase,
}: {
  testCase: string;
}): Promise<{ planId: string; agreementId: string; clientNumber: string }> => {
  return runtimeCreatePlanSeedByDb({
    getDbPool,
    testCase,
    e2ePrefix: E2E_PREFIX,
    singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
    singleUserId: await getCurrentUserId(),
    districtCode: getTestDistrictCode(),
    sourceAgreementId: getSeedSourceAgreementId(),
  });
};

const cleanupSeedDataByAgreementIds = async ({ agreementIds }: { agreementIds: string[] }) => {
  await runtimeCleanupSeedDataByAgreementIds({ getDbPool, agreementIds, logE2E });
};

const updatePlanStatusViaDb = async ({
  planId,
  toStatusCode,
  note,
  userId,
}: {
  planId: string;
  toStatusCode: string;
  note: string;
  userId: number;
}) => {
  await runtimeUpdatePlanStatusViaDb({
    getDbPool,
    planId,
    toStatusCode,
    note,
    userId,
    logE2E,
  });
};

const loginPageAs = async ({ page, roleCode }: { page: Page; roleCode: RoleCode }): Promise<string> => {
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

const switchRoleAndRelogin = async ({ page, roleCode }: { page: Page; roleCode: RoleCode }) => {
  return runtimeSwitchRoleAndRelogin({
    page,
    roleCode,
    roleByCode,
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

test.describe('Initial RUP approval workflow', () => {
  test.describe.configure({ timeout: 240000 });

  let apiContext: APIRequestContext;
  let lastPlanSnapshot: PlanSnapshot | null = null;
  let cleanupAgreementId: string | null = null;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
  });

  test.beforeEach(async ({ page }) => {
    await syncCachedUserRecordFromPage(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    void page;
    if (cachedSingleUserRecord) {
      await setUserRoleById({ userId: cachedSingleUserRecord.id, roleId: roleByCode.SA });
    }

    if (testInfo.status !== testInfo.expectedStatus && lastPlanSnapshot) {
      const safeTitle = testInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const outputPath = path.join('playwright', 'artifacts', `${safeTitle}-last-plan-snapshot.json`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(lastPlanSnapshot, null, 2), 'utf8');
    }

    if (cleanupAgreementId) {
      try {
        await cleanupSeedDataByAgreementIds({ agreementIds: [cleanupAgreementId] });
      } finally {
        cleanupAgreementId = null;
      }
    }
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test('covers SD -> C -> SFD -> RR -> A', async ({ page }) => {
    const ctx = await ScenarioContext.create({
      page,
      apiContext,
      getApiBaseUrl,
      logE2E,
      isSingleUserMode,
      switchRoleAndRelogin,
      createPlanSeedByDb,
      testCase: TEST_CASES.HAPPY_PATH,
    });
    cleanupAgreementId = ctx.agreementId;

    await ctx.submitToAh();
    await ctx.waitForStatus('C');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.expectActions('SFD');
    await ctx.runAction('plan-action-recommend-ready', 'RR');
    await ctx.waitForStatus('RR');
    await ctx.as('DM');
    await ctx.expectActions('RR');
    await ctx.runAction('plan-action-approved', 'A');
    await ctx.waitForStatus('A');
    await ctx.as('SA');
    await ctx.takeSnapshot();
    lastPlanSnapshot = ctx.lastSnapshot;

    await ctx.assertTransitions(['SD', 'C', 'SFD', 'RR', 'A']);
    ctx.assertActors(['SA', 'AH', ['SA', 'AH'], ['SA', 'DM']]);
    await ctx.assertHistoryVisible();
  });

  test('covers SD -> C -> SFD -> R -> SFD', async ({ page }) => {
    const ctx = await ScenarioContext.create({
      page,
      apiContext,
      getApiBaseUrl,
      logE2E,
      isSingleUserMode,
      switchRoleAndRelogin,
      createPlanSeedByDb,
      testCase: TEST_CASES.CHANGE_LOOP,
    });
    cleanupAgreementId = ctx.agreementId;

    await ctx.submitToAh();
    await ctx.waitForStatus('C');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.runAction('plan-action-request-changes', 'R');
    await ctx.waitForStatus('R');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.takeSnapshot();
    lastPlanSnapshot = ctx.lastSnapshot;

    await ctx.assertTransitions(['SD', 'C', 'SFD', 'R', 'SFD']);
    ctx.assertActors(['SA', 'AH', 'SA', 'AH']);
    await ctx.assertHistoryVisible();
  });

  test('covers SD -> C -> SFD -> RNR -> NF', async ({ page }) => {
    const ctx = await ScenarioContext.create({
      page,
      apiContext,
      getApiBaseUrl,
      logE2E,
      isSingleUserMode,
      switchRoleAndRelogin,
      createPlanSeedByDb,
      testCase: TEST_CASES.NOT_READY,
    });
    cleanupAgreementId = ctx.agreementId;

    await ctx.submitToAh();
    await ctx.waitForStatus('C');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.runAction('plan-action-recommend-not-ready', 'RNR');
    await ctx.waitForStatus('RNR');
    await ctx.as('DM');
    await ctx.expectActions('RNR');
    await ctx.runAction('plan-action-not-approved-further-work', 'NF');
    await ctx.waitForStatus('NF');
    await ctx.as('SA');
    await ctx.takeSnapshot();
    lastPlanSnapshot = ctx.lastSnapshot;

    await ctx.assertTransitions(['SD', 'C', 'SFD', 'RNR', 'NF']);
    ctx.assertActors(['SA', 'AH', ['SA', 'AH'], ['SA', 'DM']]);
    await ctx.assertHistoryVisible();
  });

  test('covers SD -> C -> SR -> RFS -> SFD -> RR -> A', async ({ page }) => {
    const ctx = await ScenarioContext.create({
      page,
      apiContext,
      getApiBaseUrl,
      logE2E,
      isSingleUserMode,
      switchRoleAndRelogin,
      createPlanSeedByDb,
      testCase: TEST_CASES.REVIEW_HAPPY_PATH,
    });
    cleanupAgreementId = ctx.agreementId;

    await ctx.submitToAh();
    await ctx.waitForStatus('C');
    await ctx.as('AH');
    await ctx.submitFinalDecision('feedback');
    await ctx.waitForStatus('SR');
    await ctx.as('SA');
    await ctx.runAction('plan-action-recommend-for-submission', 'RFS');
    await ctx.waitForStatus('RFS');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.runAction('plan-action-recommend-ready', 'RR');
    await ctx.waitForStatus('RR');
    await ctx.as('DM');
    await ctx.runAction('plan-action-approved', 'A');
    await ctx.waitForStatus('A');
    await ctx.as('SA');
    await ctx.takeSnapshot();
    lastPlanSnapshot = ctx.lastSnapshot;

    await ctx.assertTransitions(['SD', 'C', 'SR', 'RFS', 'SFD', 'RR', 'A']);
    ctx.assertActors(['SA', 'AH', 'SA', 'AH', 'SA', ['SA', 'DM']]);
    await ctx.assertHistoryVisible();
  });

  test('covers SD -> C -> SR -> RFS -> SFD -> R -> SFD', async ({ page }) => {
    const ctx = await ScenarioContext.create({
      page,
      apiContext,
      getApiBaseUrl,
      logE2E,
      isSingleUserMode,
      switchRoleAndRelogin,
      createPlanSeedByDb,
      testCase: TEST_CASES.REVIEW_CHANGE_LOOP,
    });
    cleanupAgreementId = ctx.agreementId;

    await ctx.submitToAh();
    await ctx.waitForStatus('C');
    await ctx.as('AH');
    await ctx.submitFinalDecision('feedback');
    await ctx.waitForStatus('SR');
    await ctx.as('SA');
    await ctx.runAction('plan-action-recommend-for-submission', 'RFS');
    await ctx.waitForStatus('RFS');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.runAction('plan-action-request-changes', 'R');
    await ctx.waitForStatus('R');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.takeSnapshot();
    lastPlanSnapshot = ctx.lastSnapshot;

    await ctx.assertTransitions(['SD', 'C', 'SR', 'RFS', 'SFD', 'R', 'SFD']);
    ctx.assertActors(['SA', 'AH', 'SA', 'AH', 'SA', 'AH']);
    await ctx.assertHistoryVisible();
  });

  test('covers SD -> C -> SFD -> RR -> NA', async ({ page }) => {
    const ctx = await ScenarioContext.create({
      page,
      apiContext,
      getApiBaseUrl,
      logE2E,
      isSingleUserMode,
      switchRoleAndRelogin,
      createPlanSeedByDb,
      testCase: TEST_CASES.NOT_APPROVED,
    });
    cleanupAgreementId = ctx.agreementId;

    await ctx.submitToAh();
    await ctx.waitForStatus('C');
    await ctx.as('AH');
    await ctx.submitFinalDecision();
    await ctx.waitForStatus('SFD');
    await ctx.as('SA');
    await ctx.runAction('plan-action-recommend-ready', 'RR');
    await ctx.waitForStatus('RR');
    await ctx.as('DM');

    if (!cachedSingleUserRecord) {
      cachedSingleUserRecord = await getSingleUserRecordForDb();
    }
    await updatePlanStatusViaDb({
      planId: ctx.planId,
      toStatusCode: 'NA',
      note: createE2ENote(TEST_CASES.NOT_APPROVED, 'RR', 'NA'),
      userId: cachedSingleUserRecord.id,
    });

    await ctx.waitForStatus('NA');
    await ctx.as('SA');
    await ctx.takeSnapshot();
    lastPlanSnapshot = ctx.lastSnapshot;

    await ctx.assertTransitions(['SD', 'C', 'SFD', 'RR', 'NA']);
    ctx.assertActors(['SA', 'AH', 'SA', ['SA', 'DM']]);
    await ctx.assertHistoryVisible();
  });
});
