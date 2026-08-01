import fs from 'fs/promises';
import path from 'path';
import { test, request, type APIRequestContext, type Page } from '@playwright/test';
import { Pool } from 'pg';
import {
  loginPageAs as runtimeLoginPageAs,
  switchRoleAndRelogin as runtimeSwitchRoleAndRelogin,
  type WorkflowRoleCode,
} from './support/authRuntime';
import {
  createPlanSeedByDb as runtimeCreatePlanSeedByDb,
  cleanupSeedDataByAgreementIds as runtimeCleanupSeedDataByAgreementIds,
  getSingleUserRecordForDb as runtimeGetSingleUserRecordForDb,
  setUserRoleById as runtimeSetUserRoleById,
  updatePlanStatusViaDb as runtimeUpdatePlanStatusViaDb,
} from './support/dbRuntime';
import { type PlanSnapshot } from './support/actionRuntime';
import { ScenarioContext } from './support/scenarioRuntime';

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

const roleByCode = {
  DM: 2,
  SA: 3,
  AH: 4,
} as const;

type RoleCode = WorkflowRoleCode;

const getPrefixedEnv = (suffix: string, required = true): string => {
  const value = process.env[`PLAYWRIGHT_${suffix}`] || process.env[`CYPRESS_${suffix}`];
  if (required && !value) {
    throw new Error(`Missing required env var: PLAYWRIGHT_${suffix} (or CYPRESS_${suffix})`);
  }
  return value || '';
};

const getApiBaseUrl = (): string => getPrefixedEnv('API_BASE_URL') || 'http://localhost:8000/api';
const getTestDistrictCode = (): string => getPrefixedEnv('TEST_DISTRICT_CODE', false) || 'TST';
const isSingleUserMode = (): boolean => {
  if (getPrefixedEnv('E2E_USERNAME', false) || getPrefixedEnv('E2E_SSO_ID', false)) {
    return true;
  }

  const staffUsername = getPrefixedEnv('STAFF_USERNAME', false).trim().toLowerCase();
  const ahUsername = getPrefixedEnv('AH_USERNAME', false).trim().toLowerCase();
  return Boolean(staffUsername && ahUsername && staffUsername === ahUsername);
};

const uniqueNonEmpty = (values: string[]): string[] => {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
};

const expandSsoCandidates = ({
  username,
  preferredPrefix,
}: {
  username: string;
  preferredPrefix?: 'idir' | 'bceid';
}): string[] => {
  const trimmed = username.trim();
  if (!trimmed) {
    return [];
  }

  const candidates = [trimmed, trimmed.toLowerCase()];
  if (trimmed.includes('\\')) {
    const account = trimmed.split('\\').pop() || '';
    if (account) {
      candidates.push(account, account.toLowerCase(), `idir\\${account}`, `idir\\${account.toLowerCase()}`);
      candidates.push(`bceid\\${account}`, `bceid\\${account.toLowerCase()}`);
    }
  } else {
    candidates.push(`idir\\${trimmed}`, `idir\\${trimmed.toLowerCase()}`);
    candidates.push(`bceid\\${trimmed}`, `bceid\\${trimmed.toLowerCase()}`);
  }

  if (preferredPrefix) {
    candidates.push(`${preferredPrefix}\\${trimmed}`, `${preferredPrefix}\\${trimmed.toLowerCase()}`);
  }

  return uniqueNonEmpty(candidates);
};

const getSingleUserUsername = (): string => {
  return (
    getPrefixedEnv('E2E_USERNAME', false) || getPrefixedEnv('STAFF_USERNAME', false) || getPrefixedEnv('AH_USERNAME')
  );
};

const getSingleUserPassword = (): string => {
  return (
    getPrefixedEnv('E2E_PASSWORD', false) || getPrefixedEnv('STAFF_PASSWORD', false) || getPrefixedEnv('AH_PASSWORD')
  );
};

const getSingleUserSsoCandidatesForDb = (): string[] => {
  const explicitSsoId = getPrefixedEnv('E2E_SSO_ID', false);
  if (explicitSsoId) {
    return expandSsoCandidates({ username: explicitSsoId });
  }

  return expandSsoCandidates({ username: getSingleUserUsername() });
};

let cachedSingleUserRecord: { id: number; sso_id: string } | null = null;

const getSingleUserLoginMode = (): 'staff' | 'bceid' => {
  const configuredMode = getPrefixedEnv('E2E_LOGIN_MODE', false).trim().toLowerCase();
  if (configuredMode === 'staff') {
    return 'staff';
  }
  if (configuredMode === 'bceid' || configuredMode === 'ah') {
    return 'bceid';
  }

  const explicitSsoId = getPrefixedEnv('E2E_SSO_ID', false).toLowerCase();
  if (explicitSsoId.startsWith('bceid\\')) {
    return 'bceid';
  }
  if (explicitSsoId.startsWith('idir\\')) {
    return 'staff';
  }

  const username = getSingleUserUsername().toLowerCase();
  return username.startsWith('bceid') || username.includes('bceid\\') ? 'bceid' : 'staff';
};

const createE2ENote = (testCase: string, fromCode: string, toCode: string): string =>
  `E2E:${testCase}:${fromCode}->${toCode}`;

const getDbPool = (): Pool => {
  return new Pool({
    host: getPrefixedEnv('DB_HOST'),
    port: Number(getPrefixedEnv('DB_PORT')),
    database: getPrefixedEnv('DB_NAME'),
    user: getPrefixedEnv('DB_USER'),
    password: getPrefixedEnv('DB_PASSWORD'),
    ssl: getPrefixedEnv('DB_SSL', false) === 'true' ? { rejectUnauthorized: false } : false,
  });
};

const getSingleUserRecordForDb = async () => {
  return runtimeGetSingleUserRecordForDb({ getDbPool, candidates: getSingleUserSsoCandidatesForDb() });
};

const setUserRoleById = async ({ userId, roleId }: { userId: number; roleId: number }) => {
  await runtimeSetUserRoleById({ getDbPool, userId, roleId });
};

const getSeedSourceAgreementId = (): string => getPrefixedEnv('SEED_SOURCE_AGREEMENT_ID', false) || 'RAN099915';

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
  let apiContext: APIRequestContext;
  let lastPlanSnapshot: PlanSnapshot | null = null;
  let cleanupAgreementId: string | null = null;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
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
