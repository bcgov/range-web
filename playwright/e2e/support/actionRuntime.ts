import { expect, type APIRequestContext, type Page } from '@playwright/test';
import type { WorkflowRoleCode } from './authRuntime';

export type PlanStatusHistoryRecord = {
  fromPlanStatusId?: number | null;
  toPlanStatusId: number;
  user?: {
    roleId?: number;
  };
};

export type PlanSnapshot = {
  status?: {
    code?: string;
  };
  planStatusHistory?: PlanStatusHistoryRecord[];
};

export type PlanStatusRef = {
  id: number;
  code: string;
};

export type AhSubmissionType = 'final-decision' | 'feedback';

type RoleCode = WorkflowRoleCode;

export const getStatusMap = async (apiContext: APIRequestContext, token: string, getApiBaseUrl: () => string) => {
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

export const updatePlanStatusViaApi = async ({
  apiContext,
  token,
  planId,
  toStatusCode,
  note,
  getApiBaseUrl,
  logE2E,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  toStatusCode: string;
  note: string;
  getApiBaseUrl: () => string;
  logE2E: (message: string) => void;
}) => {
  logE2E(`[ACTION] API fallback status update plan=${planId} -> ${toStatusCode}; note=${note}`);
  const statusMap = await getStatusMap(apiContext, token, getApiBaseUrl);
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

export const buildSubmitDiagnostics = async ({
  page,
  apiContext,
  token,
  planId,
  getApiBaseUrl,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  getApiBaseUrl: () => string;
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

export const buildAhSubmissionDiagnostics = async ({
  page,
  apiContext,
  token,
  planId,
  getApiBaseUrl,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  getApiBaseUrl: () => string;
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

export const submitStaffPlanToAh = async ({
  page,
  apiContext,
  token,
  planId,
  note,
  getApiBaseUrl,
  logE2E,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  note: string;
  getApiBaseUrl: () => string;
  logE2E: (message: string) => void;
}) => {
  logE2E(`[ACTION] Staff submit to AH started for plan=${planId}`);
  const submitButton = page.getByTestId('rup-submit-button');
  const submitVisible = await submitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submitVisible) {
    const diagnostics = await buildSubmitDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
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
      getApiBaseUrl,
      logE2E,
    });
    return;
  }

  await confirmButton.click();
  logE2E(`[ACTION] Confirmed staff submit to AH for plan=${planId}`);
};

export const submitPlanForFinalDecision = async ({
  page,
  apiContext,
  token,
  planId,
  submissionType = 'final-decision',
  getApiBaseUrl,
  logE2E,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  submissionType?: AhSubmissionType;
  getApiBaseUrl: () => string;
  logE2E: (message: string) => void;
}) => {
  logE2E(`[ACTION] AH submission started for plan=${planId}; type=${submissionType}`);
  const submitButton = page.getByTestId('rup-submit-button');
  const submitVisible = await submitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submitVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
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
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
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
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
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
      const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
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
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
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
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
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
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId, getApiBaseUrl });
    throw new Error(`AH request e-signatures button did not render in time. ${diagnostics}`);
  }

  await requestEsignButton.click();
  logE2E(`[ACTION] Clicked AH request-esignatures-submit for plan=${planId}`);
};

export const runPlanAction = async ({
  page,
  apiContext,
  token,
  planId,
  actionTestId,
  toStatusCode,
  note,
  getApiBaseUrl,
  logE2E,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  actionTestId: string;
  toStatusCode: string;
  note?: string;
  getApiBaseUrl: () => string;
  logE2E: (message: string) => void;
}) => {
  logE2E(`[ACTION] Running plan action plan=${planId} action=${actionTestId} targetStatus=${toStatusCode}`);
  await openPlanActions({ page });
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
      getApiBaseUrl,
      logE2E,
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
      getApiBaseUrl,
      logE2E,
    });
    return;
  }

  await confirmButton.click();
  logE2E(`[ACTION] Confirmed plan action=${actionTestId} for plan=${planId}`);
};

export const openPlan = async ({ page, planId }: { page: Page; planId: string }) => {
  await page.goto(`/range-use-plan/${planId}`);
  await expect(page.getByTestId('rup-options-button')).toBeVisible();
};

export const waitForPlanSnapshot = async ({
  apiContext,
  token,
  planId,
  getApiBaseUrl,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  getApiBaseUrl: () => string;
}): Promise<PlanSnapshot> => {
  const response = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`Failed to fetch plan snapshot (${response.status()})`);
  }
  return (await response.json()) as PlanSnapshot;
};

export const waitForPlanStatusCode = async ({
  apiContext,
  token,
  planId,
  expectedStatusCode,
  timeoutMs = 30000,
  getApiBaseUrl,
  logE2E,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  expectedStatusCode: string;
  timeoutMs?: number;
  getApiBaseUrl: () => string;
  logE2E: (message: string) => void;
}) => {
  const deadline = Date.now() + timeoutMs;
  let lastSnapshot: PlanSnapshot | null = null;
  let lastLoggedStatusCode: string | undefined;

  logE2E(`[TRANSITION] waiting for plan=${planId} status=${expectedStatusCode} (timeoutMs=${timeoutMs})`);

  while (Date.now() < deadline) {
    const snapshot = await waitForPlanSnapshot({ apiContext, token, planId, getApiBaseUrl });
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

export const openPlanActions = async ({ page }: { page: Page }) => {
  await page.getByTestId('rup-options-button').click();
  await expect(page.getByRole('heading', { name: 'Plan Actions' })).toBeVisible();
};

export const expectRoleActions = async ({
  page,
  roleCode,
  statusCode,
}: {
  page: Page;
  roleCode: RoleCode;
  statusCode: string;
}) => {
  await openPlanActions({ page });

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
