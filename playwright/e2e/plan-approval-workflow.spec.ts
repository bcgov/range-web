import fs from 'fs/promises';
import path from 'path';
import { test, expect, request, type APIRequestContext, type Page } from '@playwright/test';
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
import {
  getStatusMap as runtimeGetStatusMap,
  submitStaffPlanToAh as runtimeSubmitStaffPlanToAh,
  submitPlanForFinalDecision as runtimeSubmitPlanForFinalDecision,
  runPlanAction as runtimeRunPlanAction,
  openPlan as runtimeOpenPlan,
  waitForPlanSnapshot as runtimeWaitForPlanSnapshot,
  waitForPlanStatusCode as runtimeWaitForPlanStatusCode,
  expectRoleActions as runtimeExpectRoleActions,
  type PlanSnapshot,
  type AhSubmissionType,
} from './support/actionRuntime';
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

const getStatusMap = async (apiContext: APIRequestContext, token: string) => {
  return runtimeGetStatusMap(apiContext, token, getApiBaseUrl);
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
    logE2E,
  });
};

const openPlan = async (page: Page, planId: string) => {
  await runtimeOpenPlan({ page, planId });
};

const waitForPlanSnapshot = async (args: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
}): Promise<PlanSnapshot> => {
  return runtimeWaitForPlanSnapshot({ ...args, getApiBaseUrl });
};

const waitForPlanStatusCode = async (args: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  expectedStatusCode: string;
  timeoutMs?: number;
}) => {
  return runtimeWaitForPlanStatusCode({ ...args, getApiBaseUrl, logE2E });
};

const submitStaffPlanToAh = async (args: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  note: string;
}) => {
  await runtimeSubmitStaffPlanToAh({ ...args, getApiBaseUrl, logE2E });
};

const submitPlanForFinalDecision = async (args: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  submissionType?: AhSubmissionType;
}) => {
  await runtimeSubmitPlanForFinalDecision({ ...args, getApiBaseUrl, logE2E });
};

const runPlanAction = async (args: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  actionTestId: string;
  toStatusCode: string;
  note?: string;
}) => {
  await runtimeRunPlanAction({ ...args, getApiBaseUrl, logE2E });
};

const expectRoleActions = async (page: Page, roleCode: RoleCode, statusCode: string) => {
  await runtimeExpectRoleActions({ page, roleCode, statusCode });
};

const assertTransitionSequence = async ({
  apiContext,
  token,
  planSnapshot,
  expectedStatusCodes,
}: {
  apiContext: APIRequestContext;
  token: string;
  planSnapshot: PlanSnapshot;
  expectedStatusCodes: string[];
}) => {
  const statusMap = await getStatusMap(apiContext, token);
  const history = planSnapshot.planStatusHistory || [];

  expect(history.length).toBeGreaterThanOrEqual(expectedStatusCodes.length - 1);

  let transitions = history.map((record) => ({
    from: record.fromPlanStatusId ? statusMap.byId[record.fromPlanStatusId] : null,
    to: statusMap.byId[record.toPlanStatusId],
  }));

  transitions = transitions.filter((transition) => transition.from !== transition.to);

  const expectedTransitions: Array<{ from: string; to: string }> = [];
  for (let i = 1; i < expectedStatusCodes.length; i += 1) {
    expectedTransitions.push({ from: expectedStatusCodes[i - 1], to: expectedStatusCodes[i] });
  }

  const containsExpectedSequence = (candidate: Array<{ from: string | null; to: string }>) => {
    for (let i = 0; i <= candidate.length - expectedTransitions.length; i += 1) {
      const window = candidate.slice(i, i + expectedTransitions.length);
      if (JSON.stringify(window) === JSON.stringify(expectedTransitions)) {
        return true;
      }
    }
    return false;
  };

  const reverseTransitions = [...transitions].reverse();
  const forwardMatch = containsExpectedSequence(transitions);
  const reverseMatch = containsExpectedSequence(reverseTransitions);

  expect(forwardMatch || reverseMatch).toBe(true);
};

const assertTransitionActors = ({
  planSnapshot,
  expectedRoleCodes,
}: {
  planSnapshot: PlanSnapshot;
  expectedRoleCodes: Array<string | string[]>;
}) => {
  let history = planSnapshot.planStatusHistory || [];
  history = history.filter((record) => record.fromPlanStatusId !== record.toPlanStatusId);
  expect(history.length).toBeGreaterThanOrEqual(expectedRoleCodes.length);

  if (isSingleUserMode()) {
    return;
  }

  const actualRoleCodes = history.map((record) => {
    const roleId = record.user?.roleId;
    if (roleId === 2) return 'DM';
    if (roleId === 3) return 'SA';
    if (roleId === 4) return 'AH';
    return `UNKNOWN_${roleId}`;
  });

  const roleMatchesAtIndex = (actualRoleCode: string, index: number) => {
    const expectedRole = expectedRoleCodes[index];
    if (Array.isArray(expectedRole)) {
      return expectedRole.includes(actualRoleCode);
    }
    return actualRoleCode === expectedRole;
  };

  const containsExpectedSequence = (candidate: string[]) => {
    for (let i = 0; i <= candidate.length - expectedRoleCodes.length; i += 1) {
      const window = candidate.slice(i, i + expectedRoleCodes.length);
      const matches = window.every((actualRoleCode, index) => roleMatchesAtIndex(actualRoleCode, index));
      if (matches) {
        return true;
      }
    }
    return false;
  };

  const forwardMatch = containsExpectedSequence(actualRoleCodes);
  const reverseMatch = containsExpectedSequence([...actualRoleCodes].reverse());

  expect(forwardMatch || reverseMatch).toBe(true);
};

const assertHistoryVisible = async ({ page, planId }: { page: Page; planId: string }) => {
  await openPlan(page, planId);
  await expect(page.locator('.rup__history')).toBeVisible();
  await expect(page.locator('.rup__history__record').first()).toBeVisible();
};

const runSharedSetupToSfd = async ({
  page,
  apiContext,
  testCase,
}: {
  page: Page;
  apiContext: APIRequestContext;
  testCase: string;
}) => {
  let staffToken = await switchRoleAndRelogin({ page, roleCode: 'SA' });
  const { planId, agreementId } = await createPlanSeedByDb({ testCase });

  await openPlan(page, planId);
  await submitStaffPlanToAh({ page, apiContext, token: staffToken, planId, note: createE2ENote(testCase, 'SD', 'C') });
  await waitForPlanStatusCode({
    apiContext,
    token: staffToken,
    planId,
    expectedStatusCode: 'C',
  });

  const ahToken = await switchRoleAndRelogin({ page, roleCode: 'AH' });
  await openPlan(page, planId);
  await submitPlanForFinalDecision({ page, apiContext, token: ahToken, planId });
  await waitForPlanStatusCode({
    apiContext,
    token: ahToken,
    planId,
    expectedStatusCode: 'SFD',
  });

  staffToken = await switchRoleAndRelogin({ page, roleCode: 'SA' });
  await openPlan(page, planId);
  await expectRoleActions(page, 'SA', 'SFD');

  const planSnapshot = await waitForPlanSnapshot({ apiContext, token: staffToken, planId });
  return { planId, agreementId, planSnapshot, staffToken };
};

const runSharedSetupToC = async ({
  page,
  apiContext,
  testCase,
}: {
  page: Page;
  apiContext: APIRequestContext;
  testCase: string;
}) => {
  const staffToken = await switchRoleAndRelogin({ page, roleCode: 'SA' });
  const { planId, agreementId } = await createPlanSeedByDb({ testCase });

  await openPlan(page, planId);
  await submitStaffPlanToAh({ page, apiContext, token: staffToken, planId, note: createE2ENote(testCase, 'SD', 'C') });
  await waitForPlanStatusCode({
    apiContext,
    token: staffToken,
    planId,
    expectedStatusCode: 'C',
  });

  return { planId, agreementId, staffToken };
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
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.CHANGE_LOOP,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-request-changes',
      toStatusCode: 'R',
      note: createE2ENote(TEST_CASES.CHANGE_LOOP, 'SFD', 'R'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'R',
    });
    const token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId });
    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'SFD',
    });

    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });
    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'R', 'SFD'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', 'AH'],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SFD -> RNR -> NF', async ({ page }) => {
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.NOT_READY,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-recommend-not-ready',
      toStatusCode: 'RNR',
      note: createE2ENote(TEST_CASES.NOT_READY, 'SFD', 'RNR'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'RNR',
    });

    let token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);
    await expectRoleActions(page, 'DM', 'RNR');

    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-not-approved-further-work',
      toStatusCode: 'NF',
      note: createE2ENote(TEST_CASES.NOT_READY, 'RNR', 'NF'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'NF',
    });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'RNR', 'NF'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', ['SA', 'AH'], ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SR -> RFS -> SFD -> RR -> A', async ({ page }) => {
    const { planId, agreementId } = await runSharedSetupToC({
      page,
      apiContext,
      testCase: TEST_CASES.REVIEW_HAPPY_PATH,
    });
    cleanupAgreementId = agreementId;

    let token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'feedback' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SR' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-recommend-for-submission',
      toStatusCode: 'RFS',
      note: createE2ENote(TEST_CASES.REVIEW_HAPPY_PATH, 'SR', 'RFS'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'RFS' });

    token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'final-decision' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SFD' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-recommend-ready',
      toStatusCode: 'RR',
      note: createE2ENote(TEST_CASES.REVIEW_HAPPY_PATH, 'SFD', 'RR'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'RR' });

    token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-approved',
      toStatusCode: 'A',
      note: createE2ENote(TEST_CASES.REVIEW_HAPPY_PATH, 'RR', 'A'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'A' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SR', 'RFS', 'SFD', 'RR', 'A'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', 'AH', 'SA', ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SR -> RFS -> SFD -> R -> SFD', async ({ page }) => {
    const { planId, agreementId } = await runSharedSetupToC({
      page,
      apiContext,
      testCase: TEST_CASES.REVIEW_CHANGE_LOOP,
    });
    cleanupAgreementId = agreementId;

    let token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'feedback' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SR' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-recommend-for-submission',
      toStatusCode: 'RFS',
      note: createE2ENote(TEST_CASES.REVIEW_CHANGE_LOOP, 'SR', 'RFS'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'RFS' });

    token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'final-decision' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SFD' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-request-changes',
      toStatusCode: 'R',
      note: createE2ENote(TEST_CASES.REVIEW_CHANGE_LOOP, 'SFD', 'R'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'R' });

    token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'final-decision' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SFD' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SR', 'RFS', 'SFD', 'R', 'SFD'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', 'AH', 'SA', 'AH'],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SFD -> RR -> NA', async ({ page }) => {
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.NOT_APPROVED,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-recommend-ready',
      toStatusCode: 'RR',
      note: createE2ENote(TEST_CASES.NOT_APPROVED, 'SFD', 'RR'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'RR',
    });

    let token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);

    if (!cachedSingleUserRecord) {
      cachedSingleUserRecord = await getSingleUserRecordForDb();
    }

    await updatePlanStatusViaDb({
      planId,
      toStatusCode: 'NA',
      note: createE2ENote(TEST_CASES.NOT_APPROVED, 'RR', 'NA'),
      userId: cachedSingleUserRecord.id,
    });

    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'NA',
    });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'RR', 'NA'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
  });
});
