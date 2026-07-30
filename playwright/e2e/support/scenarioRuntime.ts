import { expect, type Page, type APIRequestContext } from '@playwright/test';
import { type WorkflowRoleCode } from './authRuntime';
import {
  type AhSubmissionType,
  type PlanSnapshot,
  submitStaffPlanToAh,
  submitPlanForFinalDecision,
  runPlanAction,
  expectRoleActions,
  waitForPlanSnapshot,
  waitForPlanStatusCode,
  getStatusMap,
  openPlan,
} from './actionRuntime';

export class ScenarioContext {
  private page: Page;
  private apiContext: APIRequestContext;
  private getApiBaseUrl: () => string;
  private logE2E: (message: string) => void;
  private switchRoleAndRelogin: (args: { page: Page; roleCode: WorkflowRoleCode }) => Promise<string>;
  private isSingleUserMode: () => boolean;
  private currentRole: WorkflowRoleCode | null;
  private currentToken: string;
  private cachedUserRecord: { id: number; sso_id: string } | null;

  planId: string;
  agreementId: string;
  testCase: string;
  lastSnapshot: PlanSnapshot | null;

  constructor(deps: {
    page: Page;
    apiContext: APIRequestContext;
    getApiBaseUrl: () => string;
    logE2E: (message: string) => void;
    switchRoleAndRelogin: (args: { page: Page; roleCode: WorkflowRoleCode }) => Promise<string>;
    isSingleUserMode: () => boolean;
    planId: string;
    agreementId: string;
    testCase: string;
    initialToken: string;
  }) {
    this.page = deps.page;
    this.apiContext = deps.apiContext;
    this.getApiBaseUrl = deps.getApiBaseUrl;
    this.logE2E = deps.logE2E;
    this.switchRoleAndRelogin = deps.switchRoleAndRelogin;
    this.isSingleUserMode = deps.isSingleUserMode;
    this.planId = deps.planId;
    this.agreementId = deps.agreementId;
    this.testCase = deps.testCase;
    this.currentToken = deps.initialToken;
    this.currentRole = 'SA';
    this.lastSnapshot = null;
    this.cachedUserRecord = null;
  }

  static async create(deps: {
    page: Page;
    apiContext: APIRequestContext;
    getApiBaseUrl: () => string;
    logE2E: (message: string) => void;
    switchRoleAndRelogin: (args: { page: Page; roleCode: WorkflowRoleCode }) => Promise<string>;
    isSingleUserMode: () => boolean;
    createPlanSeedByDb: (args: {
      testCase: string;
    }) => Promise<{ planId: string; agreementId: string; clientNumber: string }>;
    testCase: string;
  }): Promise<ScenarioContext> {
    const { planId, agreementId } = await deps.createPlanSeedByDb({ testCase: deps.testCase });
    const initialToken = await deps.switchRoleAndRelogin({ page: deps.page, roleCode: 'SA' });
    return new ScenarioContext({
      page: deps.page,
      apiContext: deps.apiContext,
      getApiBaseUrl: deps.getApiBaseUrl,
      logE2E: deps.logE2E,
      switchRoleAndRelogin: deps.switchRoleAndRelogin,
      isSingleUserMode: deps.isSingleUserMode,
      planId,
      agreementId,
      testCase: deps.testCase,
      initialToken,
    });
  }

  private note(from: string, to: string): string {
    return `E2E:${this.testCase}:${from}->${to}`;
  }

  async as(roleCode: WorkflowRoleCode): Promise<this> {
    this.currentToken = await this.switchRoleAndRelogin({ page: this.page, roleCode });
    this.currentRole = roleCode;
    await openPlan({ page: this.page, planId: this.planId });
    return this;
  }

  async submitToAh(noteOverride?: string): Promise<void> {
    await submitStaffPlanToAh({
      page: this.page,
      apiContext: this.apiContext,
      token: this.currentToken,
      planId: this.planId,
      note: noteOverride || this.note('SD', 'C'),
      getApiBaseUrl: this.getApiBaseUrl,
      logE2E: this.logE2E,
    });
  }

  async submitFinalDecision(type?: AhSubmissionType): Promise<void> {
    await submitPlanForFinalDecision({
      page: this.page,
      apiContext: this.apiContext,
      token: this.currentToken,
      planId: this.planId,
      submissionType: type,
      getApiBaseUrl: this.getApiBaseUrl,
      logE2E: this.logE2E,
    });
  }

  async runAction(actionTestId: string, toStatusCode: string, noteOverride?: string): Promise<void> {
    await runPlanAction({
      page: this.page,
      apiContext: this.apiContext,
      token: this.currentToken,
      planId: this.planId,
      actionTestId,
      toStatusCode,
      note: noteOverride || this.note(toStatusCode, toStatusCode),
      getApiBaseUrl: this.getApiBaseUrl,
      logE2E: this.logE2E,
    });
  }

  async expectActions(statusCode: string): Promise<void> {
    if (!this.currentRole) {
      throw new Error('No current role set; call as() first');
    }
    await expectRoleActions({ page: this.page, roleCode: this.currentRole, statusCode });
  }

  async waitForStatus(expectedStatusCode: string, timeoutMs?: number): Promise<PlanSnapshot> {
    return waitForPlanStatusCode({
      apiContext: this.apiContext,
      token: this.currentToken,
      planId: this.planId,
      expectedStatusCode,
      timeoutMs,
      getApiBaseUrl: this.getApiBaseUrl,
      logE2E: this.logE2E,
    });
  }

  async takeSnapshot(): Promise<void> {
    this.lastSnapshot = await waitForPlanSnapshot({
      apiContext: this.apiContext,
      token: this.currentToken,
      planId: this.planId,
      getApiBaseUrl: this.getApiBaseUrl,
    });
  }

  async assertTransitions(expectedStatusCodes: string[]): Promise<void> {
    if (!this.lastSnapshot) {
      throw new Error('No snapshot available; call takeSnapshot() before assertTransitions()');
    }
    const statusMap = await getStatusMap(this.apiContext, this.currentToken, this.getApiBaseUrl);
    const history = this.lastSnapshot.planStatusHistory || [];

    expect(history.length).toBeGreaterThanOrEqual(expectedStatusCodes.length - 1);

    let transitions = history.map((record) => ({
      from: record.fromPlanStatusId ? statusMap.byId[record.fromPlanStatusId] : null,
      to: statusMap.byId[record.toPlanStatusId],
    }));

    transitions = transitions.filter((t) => t.from !== t.to);

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

    const forwardMatch = containsExpectedSequence(transitions);
    const reverseMatch = containsExpectedSequence([...transitions].reverse());
    expect(forwardMatch || reverseMatch).toBe(true);
  }

  assertActors(expectedRoleCodes: Array<string | string[]>): void {
    if (!this.lastSnapshot) {
      throw new Error('No snapshot available; call takeSnapshot() before assertActors()');
    }

    if (this.isSingleUserMode()) {
      return;
    }

    let history = this.lastSnapshot.planStatusHistory || [];
    history = history.filter((record) => record.fromPlanStatusId !== record.toPlanStatusId);
    expect(history.length).toBeGreaterThanOrEqual(expectedRoleCodes.length);

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
  }

  async assertHistoryVisible(): Promise<void> {
    await openPlan({ page: this.page, planId: this.planId });
    await expect(this.page.locator('.rup__history')).toBeVisible();
    await expect(this.page.locator('.rup__history__record').first()).toBeVisible();
  }
}
