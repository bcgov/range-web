import { request, type Page } from '@playwright/test';

export type WorkflowRoleCode = 'SA' | 'DM' | 'AH';

type AuthData = {
  access_token: string;
  [key: string]: unknown;
};

type LoginMode = 'staff' | 'bceid';

const POPUP_STUCK_TIMEOUT_MS = 25000;

const clickFirstVisible = async (page: Page, selectors: string[]): Promise<boolean> => {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if ((await locator.count()) > 0 && (await locator.isVisible().catch(() => false))) {
      await locator.click();
      return true;
    }
  }

  return false;
};

const fillLoginPopup = async ({
  popup,
  username,
  password,
  roleCode,
  logE2E,
  timeoutMs = 60000,
}: {
  popup: Page;
  username: string;
  password: string;
  roleCode: WorkflowRoleCode;
  logE2E: (message: string) => void;
  timeoutMs?: number;
}) => {
  const usernameSelectors = ['#user', '#username', 'input[name="user"]', 'input[name="username"]'];
  const passwordSelectors = ['#password', 'input[name="password"]'];
  const submitSelectors = ['#kc-login', 'button[type="submit"]', 'input[type="submit"]'];

  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (popup.isClosed()) {
      return;
    }

    await popup.waitForLoadState('domcontentloaded');

    let usernameLocator = null;
    for (const selector of usernameSelectors) {
      const locator = popup.locator(selector).first();
      if (await locator.count()) {
        usernameLocator = locator;
        break;
      }
    }

    let passwordLocator = null;
    for (const selector of passwordSelectors) {
      const locator = popup.locator(selector).first();
      if (await locator.count()) {
        passwordLocator = locator;
        break;
      }
    }

    if (usernameLocator && passwordLocator) {
      logE2E(`[SSO][${roleCode}] submitting credentials for username=${username}`);
      await usernameLocator.fill(username);
      await passwordLocator.fill(password);

      const clicked = await clickFirstVisible(popup, submitSelectors);
      if (!clicked) {
        await passwordLocator.press('Enter');
      }

      return;
    }

    await popup.waitForTimeout(500);
  }

  throw new Error('Unable to find login username/password fields in SSO popup.');
};

const storeAuthAndProfile = async ({
  page,
  authData,
  apiBaseUrl,
  roleId,
}: {
  page: Page;
  authData: AuthData;
  apiBaseUrl: string;
  roleId?: number;
}): Promise<void> => {
  const apiContext = await request.newContext();
  try {
    const userResponse = await apiContext.get(`${apiBaseUrl}/v1/user/me`, {
      headers: { Authorization: `Bearer ${authData.access_token}` },
    });

    if (!userResponse.ok()) {
      throw new Error(`Failed to load user profile (${userResponse.status()})`);
    }

    const user = await userResponse.json();
    const profile = roleId ? { ...user, roleId } : user;

    const persistAuthWithRetry = async () => {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          await page.goto('/');
          await page.evaluate(
            ({ auth, profile }) => {
              window.localStorage.setItem('range-web-auth', JSON.stringify(auth));
              window.localStorage.setItem('range-web-user', JSON.stringify(profile));
            },
            { auth: authData, profile },
          );
          return;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'unknown';
          if (attempt === 2 || !message.includes('Execution context was destroyed')) {
            throw error;
          }
        }
      }
    };

    await persistAuthWithRetry();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.goto('/home');
  } finally {
    await apiContext.dispose();
  }
};

const readAuthFromLocalStorage = async (page: Page): Promise<AuthData | null> => {
  try {
    return await page.evaluate(() => {
      const raw = window.localStorage.getItem('range-web-auth');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.access_token ? (parsed as AuthData) : null;
    });
  } catch {
    return null;
  }
};

const pollForAuthOrFail = async ({
  page,
  popup,
  logE2E,
  timeoutMs,
}: {
  page: Page;
  popup: Page;
  logE2E: (message: string) => void;
  timeoutMs: number;
}): Promise<AuthData | null> => {
  const deadline = Date.now() + timeoutMs;
  let lastUrl = '';
  let lastUrlChangedAt = Date.now();
  let closedGraceStart: number | null = null;

  while (Date.now() < deadline) {
    const authData = await readAuthFromLocalStorage(page);
    if (authData) {
      return authData;
    }

    if (popup.isClosed()) {
      if (closedGraceStart === null) {
        closedGraceStart = Date.now();
        logE2E(`[SSO] popup closed, waiting for auth token in localStorage`);
      }
      if (Date.now() - closedGraceStart > 6000) {
        logE2E(`[SSO] popup closed but auth token never appeared in localStorage`);
        return null;
      }
    } else {
      closedGraceStart = null;

      let currentUrl = '';
      try {
        currentUrl = popup.url();
      } catch {
        return null;
      }

      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        lastUrlChangedAt = Date.now();
      } else if (lastUrl && Date.now() - lastUrlChangedAt > POPUP_STUCK_TIMEOUT_MS) {
        logE2E(`[SSO] popup stuck on ${currentUrl.slice(0, 80)} — treating attempt as failed`);
        return null;
      }
    }

    await page.waitForTimeout(1000);
  }

  logE2E(`[SSO] timed out waiting for auth token`);
  return null;
};

const LOGIN_ATTEMPTS = 4;
const LOGIN_ATTEMPT_TIMEOUT_MS = 30000;

export const loginThroughPopup = async ({
  page,
  roleCode,
  username,
  password,
  loginMode,
  logE2E,
}: {
  page: Page;
  roleCode: WorkflowRoleCode;
  username: string;
  password: string;
  loginMode: LoginMode;
  logE2E: (message: string) => void;
}): Promise<AuthData> => {
  logE2E(`[AUTH] starting popup login for role=${roleCode}`);

  for (let attempt = 1; attempt <= LOGIN_ATTEMPTS; attempt++) {
    logE2E(`[AUTH] login attempt ${attempt}/${LOGIN_ATTEMPTS}`);

    try {
      await page.goto('/');
    } catch (error) {
      logE2E(
        `[AUTH] page.goto failed (${error instanceof Error ? error.message.split('\n')[0] : 'unknown'}) — retrying`,
      );
      await page.context().clearCookies();
      continue;
    }

    let popup: Page;
    try {
      const popupPromise = page.waitForEvent('popup', { timeout: LOGIN_ATTEMPT_TIMEOUT_MS });
      if (loginMode === 'bceid') {
        await page.locator('#login_bceid_button').click();
      } else {
        await page.getByRole('button', { name: 'Staff Login' }).click();
      }

      popup = await popupPromise;
    } catch (error) {
      logE2E(
        `[AUTH] login popup did not open (${error instanceof Error ? error.message.split('\n')[0] : 'unknown'}) — retrying`,
      );
      await page.context().clearCookies();
      continue;
    }

    try {
      await fillLoginPopup({
        popup,
        username,
        password,
        roleCode,
        logE2E,
        timeoutMs: LOGIN_ATTEMPT_TIMEOUT_MS,
      });
    } catch (error) {
      logE2E(`[AUTH] login fields not found (${error instanceof Error ? error.message : 'unknown'}) — retrying`);
      await popup.close().catch(() => undefined);
      await page.context().clearCookies();
      continue;
    }

    const authData = await pollForAuthOrFail({
      page,
      popup,
      logE2E,
      timeoutMs: LOGIN_ATTEMPT_TIMEOUT_MS,
    });
    if (authData) {
      return authData;
    }

    await popup.close().catch(() => undefined);
    await page.context().clearCookies();
  }

  throw new Error(
    `SSO login failed after ${LOGIN_ATTEMPTS} attempts. This can happen when the SSO provider intermittently aborts requests; re-run the job to retry.`,
  );
};

export const loginPageAs = async ({
  page,
  roleCode,
  username,
  password,
  loginMode,
  apiBaseUrl,
  logE2E,
}: {
  page: Page;
  roleCode: WorkflowRoleCode;
  username: string;
  password: string;
  loginMode: LoginMode;
  apiBaseUrl: string;
  logE2E: (message: string) => void;
}): Promise<string> => {
  const authData = await loginThroughPopup({ page, roleCode, username, password, loginMode, logE2E });
  await storeAuthAndProfile({ page, authData, apiBaseUrl });

  return authData.access_token;
};

export const clearSession = async (page: Page) => {
  await page.goto('/');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.context().clearCookies();
};

export const switchRoleAndRelogin = async ({
  page,
  roleCode,
  roleByCode,
  getSingleUserRecord,
  setUserRoleById,
  loginPageAs,
  apiBaseUrl,
  logE2E,
}: {
  page: Page;
  roleCode: WorkflowRoleCode;
  roleByCode: Record<WorkflowRoleCode, number>;
  getSingleUserRecord: () => Promise<{ id: number; sso_id: string }>;
  setUserRoleById: ({ userId, roleId }: { userId: number; roleId: number }) => Promise<void>;
  loginPageAs: ({ page, roleCode }: { page: Page; roleCode: WorkflowRoleCode }) => Promise<string>;
  apiBaseUrl: string;
  logE2E: (message: string) => void;
}) => {
  const roleId = roleByCode[roleCode];
  if (!roleId) {
    throw new Error(`switchRoleAndRelogin only supports SA, DM, AH. Received: ${roleCode}`);
  }

  const userRecord = await getSingleUserRecord();
  logE2E(`[AUTH] switching single user to ${roleCode} (roleId=${roleId})`);
  await setUserRoleById({ userId: userRecord.id, roleId });

  const existingAuth = await (async () => {
    try {
      await page.goto('/');
      return await readAuthFromLocalStorage(page);
    } catch (error) {
      logE2E(
        `[AUTH] could not check existing session (${error instanceof Error ? error.message.split('\n')[0] : 'unknown'})`,
      );
      return null;
    }
  })();
  if (existingAuth && existingAuth.access_token) {
    try {
      await storeAuthAndProfile({ page, authData: existingAuth, apiBaseUrl, roleId });
      logE2E(`[AUTH] reused existing session for ${roleCode}`);
      return existingAuth.access_token;
    } catch (error) {
      logE2E(
        `[AUTH] session reuse failed (${error instanceof Error ? error.message : 'unknown'}) — falling back to popup login`,
      );
      await page.context().clearCookies();
    }
  }

  await clearSession(page);
  return loginPageAs({ page, roleCode });
};
