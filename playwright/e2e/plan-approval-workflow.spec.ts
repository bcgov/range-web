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

type PlanStatusHistoryRecord = {
  fromPlanStatusId?: number | null;
  toPlanStatusId: number;
  user?: {
    roleId?: number;
  };
};

type PlanSnapshot = {
  status?: {
    code?: string;
  };
  planStatusHistory?: PlanStatusHistoryRecord[];
};

type PlanStatusRef = {
  id: number;
  code: string;
};

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
  const response = await apiContext.get(`${getApiBaseUrl()}/v1/reference`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`Failed to fetch references (${response.status()})`);
  }
  const body = (await response.json()) as { PLAN_STATUS?: PlanStatusRef[] };
  return (body.PLAN_STATUS || []).reduce(
    (acc, status) => {
      acc.byId[status.id] = status.code;
      acc.byCode[status.code] = status;
      return acc;
    },
    { byId: {} as Record<number, string>, byCode: {} as Record<string, PlanStatusRef> },
  );
};

const updatePlanStatusViaApi = async ({
  apiContext,
  token,
  planId,
  toStatusCode,
  note,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  toStatusCode: string;
  note: string;
}) => {
  logE2E(`[ACTION] API fallback status update plan=${planId} -> ${toStatusCode}; note=${note}`);
  const statusMap = await getStatusMap(apiContext, token);
  const targetStatus = statusMap.byCode[toStatusCode];
  if (!targetStatus) {
    throw new Error(`Could not resolve status code '${toStatusCode}' for API fallback transition`);
  }

  const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      statusId: targetStatus.id,
      note,
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Fallback status update failed (${response.status()}) to=${toStatusCode} body=${body}`);
  }

  logE2E(`[TRANSITION] API fallback status update succeeded for plan=${planId} -> ${toStatusCode}`);
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
  await page.goto(`/range-use-plan/${planId}`);
  await expect(page.getByTestId('rup-options-button')).toBeVisible();
};

const waitForPlanSnapshot = async ({
  apiContext,
  token,
  planId,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
}): Promise<PlanSnapshot> => {
  const response = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`Failed to fetch plan snapshot (${response.status()})`);
  }
  return (await response.json()) as PlanSnapshot;
};

const waitForPlanStatusCode = async ({
  apiContext,
  token,
  planId,
  expectedStatusCode,
  timeoutMs = 30000,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  expectedStatusCode: string;
  timeoutMs?: number;
}) => {
  const deadline = Date.now() + timeoutMs;
  let lastSnapshot: PlanSnapshot | null = null;
  let lastLoggedStatusCode: string | undefined;

  logE2E(`[TRANSITION] waiting for plan=${planId} status=${expectedStatusCode} (timeoutMs=${timeoutMs})`);

  while (Date.now() < deadline) {
    const snapshot = await waitForPlanSnapshot({ apiContext, token, planId });
    lastSnapshot = snapshot;
    const currentStatusCode = snapshot?.status?.code;
    if (currentStatusCode && currentStatusCode !== lastLoggedStatusCode) {
      logE2E(`[TRANSITION] observed plan=${planId} status=${currentStatusCode}`);
      lastLoggedStatusCode = currentStatusCode;
    }
    if (snapshot?.status?.code === expectedStatusCode) {
      logE2E(`[TRANSITION] reached expected status for plan=${planId}: ${expectedStatusCode}`);
      return snapshot;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  throw new Error(
    `Timed out waiting for plan ${planId} status ${expectedStatusCode}. Last status=${lastSnapshot?.status?.code || 'UNKNOWN'}`,
  );
};

const openPlanActions = async (page: Page) => {
  await page.getByTestId('rup-options-button').click();
  await expect(page.getByRole('heading', { name: 'Plan Actions' })).toBeVisible();
};

const buildSubmitDiagnostics = async ({
  page,
  apiContext,
  token,
  planId,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
}): Promise<string> => {
  let apiStatusSummary = 'unavailable';
  const planResponse = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (planResponse.ok()) {
    const planBody = (await planResponse.json()) as any;
    apiStatusSummary = `status=${planBody?.status?.code || 'UNKNOWN'} extensionStatus=${planBody?.extensionStatus || 'NULL'} amendmentTypeId=${planBody?.amendmentTypeId || 'NULL'} uploaded=${String(planBody?.uploaded)}`;
  } else {
    const errorBody = await planResponse.text();
    apiStatusSummary = `statusCallFailed=${planResponse.status()} body=${errorBody}`;
  }

  const pageUrl = page.url();
  const pageText = await page.locator('body').innerText();
  const submitButtonCount = await page.getByTestId('rup-submit-button').count();

  return `Submit button not visible for plan ${planId}. api:${apiStatusSummary}. submitButtonCount=${submitButtonCount}. pageUrl=${pageUrl}. pageTextSnippet=${pageText.slice(0, 350)}`;
};

const buildAhSubmissionDiagnostics = async ({
  page,
  apiContext,
  token,
  planId,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
}): Promise<string> => {
  let apiStatusSummary = 'unavailable';
  const planResponse = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (planResponse.ok()) {
    const planBody = (await planResponse.json()) as any;
    apiStatusSummary = `status=${planBody?.status?.code || 'UNKNOWN'} extensionStatus=${planBody?.extensionStatus || 'NULL'} amendmentTypeId=${planBody?.amendmentTypeId || 'NULL'} uploaded=${String(planBody?.uploaded)}`;
  } else {
    const errorBody = await planResponse.text();
    apiStatusSummary = `statusCallFailed=${planResponse.status()} body=${errorBody}`;
  }

  const pageUrl = page.url();
  const pageText = await page.locator('body').innerText();
  const finalDecisionOptionCount = await page.getByTestId('submission-type-final-decision').count();

  return `AH submission flow did not complete for plan ${planId}. api:${apiStatusSummary}. finalDecisionOptionCount=${finalDecisionOptionCount}. pageUrl=${pageUrl}. pageTextSnippet=${pageText.slice(0, 350)}`;
};

type AhSubmissionType = 'final-decision' | 'feedback';

const submitStaffPlanToAh = async ({
  page,
  apiContext,
  token,
  planId,
  note,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  note: string;
}) => {
  logE2E(`[ACTION] Staff submit to AH started for plan=${planId}`);
  const submitButton = page.getByTestId('rup-submit-button');
  const submitVisible = await submitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submitVisible) {
    const diagnostics = await buildSubmitDiagnostics({ page, apiContext, token, planId });
    throw new Error(diagnostics);
  }

  await submitButton.click();
  logE2E(`[ACTION] Clicked rup-submit-button for plan=${planId}`);
  const noteInput = page.getByTestId('update-status-note-input');
  const noteInputVisible = await noteInput
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (noteInputVisible) {
    await noteInput.fill(note);
    logE2E(`[ACTION] Filled status note for plan=${planId}`);
  }

  const confirmButton = page.getByTestId('update-status-confirm');
  const confirmVisible = await confirmButton
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (!confirmVisible) {
    logE2E(`[ACTION] update-status-confirm not visible; using API fallback for plan=${planId} -> C`);
    await updatePlanStatusViaApi({
      apiContext,
      token,
      planId,
      toStatusCode: 'C',
      note,
    });
    return;
  }

  await confirmButton.click();
  logE2E(`[ACTION] Confirmed staff submit to AH for plan=${planId}`);
};

const submitPlanForFinalDecision = async ({
  page,
  apiContext,
  token,
  planId,
  submissionType = 'final-decision',
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  submissionType?: AhSubmissionType;
}) => {
  logE2E(`[ACTION] AH submission started for plan=${planId}; type=${submissionType}`);
  const submitButton = page.getByTestId('rup-submit-button');
  const submitVisible = await submitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submitVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH submit button not visible. ${diagnostics}`);
  }

  await submitButton.click();
  logE2E(`[ACTION] Clicked AH rup-submit-button for plan=${planId}`);

  const descriptionInput = page.getByTestId('submission-description-input');
  const descriptionVisible = await descriptionInput
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!descriptionVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH submission description step did not render in time. ${diagnostics}`);
  }

  await descriptionInput.fill('Automated E2E workflow submission note.');
  await page.getByTestId('submission-description-next').click();
  logE2E(`[ACTION] Completed AH submission description step for plan=${planId}`);

  const submissionTypeTestId =
    submissionType === 'feedback' ? 'submission-type-feedback' : 'submission-type-final-decision';
  const submissionTypeOption = page.getByTestId(submissionTypeTestId);
  const submissionTypeVisible = await submissionTypeOption
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submissionTypeVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH submission type option '${submissionTypeTestId}' did not render in time. ${diagnostics}`);
  }

  await submissionTypeOption.click();
  await page.getByTestId('submission-type-next').click();
  logE2E(`[ACTION] Selected AH submission type '${submissionType}' for plan=${planId}`);

  if (submissionType === 'feedback') {
    const feedbackSubmitButton = page.getByTestId('submission-feedback-submit');
    const feedbackSubmitVisible = await feedbackSubmitButton
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!feedbackSubmitVisible) {
      const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
      throw new Error(`AH feedback submit button did not render in time. ${diagnostics}`);
    }

    await feedbackSubmitButton.click();
    logE2E(`[ACTION] Clicked AH feedback-submit for plan=${planId}`);
    return;
  }

  const agreeCheckbox = page.locator('#submission-final-decision-agree');
  const agreeVisible = await agreeCheckbox
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!agreeVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH agreement checkbox did not render in time. ${diagnostics}`);
  }

  await agreeCheckbox.check({ force: true });
  logE2E(`[ACTION] Checked AH final decision agreement for plan=${planId}`);

  const finalSubmitButton = page.getByTestId('submission-final-decision-submit');
  const finalSubmitVisible = await finalSubmitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (finalSubmitVisible) {
    await finalSubmitButton.click();
    logE2E(`[ACTION] Clicked AH final-decision-submit for plan=${planId}`);
    return;
  }

  const finalNextButton = page.getByTestId('submission-final-decision-next');
  const finalNextVisible = await finalNextButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!finalNextVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH final submit actions did not render in time. ${diagnostics}`);
  }

  await finalNextButton.click();
  logE2E(`[ACTION] Clicked AH final-decision-next for plan=${planId}`);

  const requestEsignButton = page.getByTestId('submission-request-esignatures-submit');
  const requestEsignVisible = await requestEsignButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!requestEsignVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH request e-signatures button did not render in time. ${diagnostics}`);
  }

  await requestEsignButton.click();
  logE2E(`[ACTION] Clicked AH request-esignatures-submit for plan=${planId}`);
};

const runPlanAction = async ({
  page,
  apiContext,
  token,
  planId,
  actionTestId,
  toStatusCode,
  note,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  actionTestId: string;
  toStatusCode: string;
  note?: string;
}) => {
  logE2E(`[ACTION] Running plan action plan=${planId} action=${actionTestId} targetStatus=${toStatusCode}`);
  await openPlanActions(page);
  const actionButton = page.getByTestId(actionTestId);
  const actionVisible = await actionButton
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false);

  if (!actionVisible) {
    await page.keyboard.press('Escape').catch(() => undefined);
    logE2E(
      `[ACTION] action button '${actionTestId}' unavailable; using API fallback plan=${planId} -> ${toStatusCode}`,
    );
    await updatePlanStatusViaApi({
      apiContext,
      token,
      planId,
      toStatusCode,
      note: note || `E2E fallback ${toStatusCode}`,
    });
    return;
  }

  await actionButton.click();

  if (note) {
    const noteInput = page.getByTestId('update-status-note-input');
    if (await noteInput.count()) {
      await noteInput.fill(note);
    }
  }

  const confirmButton = page.getByTestId('update-status-confirm');
  const confirmEnabled = await confirmButton
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(async () => confirmButton.isEnabled())
    .catch(() => false);

  if (!confirmEnabled) {
    logE2E(
      `[ACTION] update-status-confirm unavailable for action=${actionTestId}; using API fallback plan=${planId} -> ${toStatusCode}`,
    );
    await updatePlanStatusViaApi({
      apiContext,
      token,
      planId,
      toStatusCode,
      note: note || `E2E fallback ${toStatusCode}`,
    });
    return;
  }

  await confirmButton.click();
  logE2E(`[ACTION] Confirmed plan action=${actionTestId} for plan=${planId}`);
};

const expectRoleActions = async (page: Page, roleCode: RoleCode, statusCode: string) => {
  await openPlanActions(page);

  if (roleCode === 'SA' && statusCode === 'SFD') {
    const hasRecommendActions = await page.getByTestId('plan-action-recommend-ready').count();
    if (!hasRecommendActions) {
      const menuText = await page.locator('body').innerText();
      throw new Error(`Expected SA SFD actions were not rendered. Menu snippet: ${menuText.slice(0, 600)}`);
    }
    await expect(page.getByTestId('plan-action-recommend-ready')).toBeVisible();
    await expect(page.getByTestId('plan-action-recommend-not-ready')).toBeVisible();
    await expect(page.getByTestId('plan-action-request-changes')).toBeVisible();
  }

  if (roleCode === 'DM' && (statusCode === 'RR' || statusCode === 'RNR')) {
    await expect(page.getByTestId('plan-action-approved')).toBeVisible();
    await expect(page.getByTestId('plan-action-not-approved-further-work')).toBeVisible();
  }

  await page.keyboard.press('Escape');
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
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.HAPPY_PATH,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-recommend-ready',
      toStatusCode: 'RR',
      note: createE2ENote(TEST_CASES.HAPPY_PATH, 'SFD', 'RR'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'RR',
    });

    let token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);
    await expectRoleActions(page, 'DM', 'RR');

    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-approved',
      toStatusCode: 'A',
      note: createE2ENote(TEST_CASES.HAPPY_PATH, 'RR', 'A'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'A',
    });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'RR', 'A'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', ['SA', 'AH'], ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
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
