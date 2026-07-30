import { expect, request, type Page } from '@playwright/test';

export type WorkflowRoleCode = 'SA' | 'DM' | 'AH';

type AuthData = {
  access_token: string;
  [key: string]: unknown;
};

type LoginMode = 'staff' | 'bceid';

const clickFirstVisible = async (page: Page, selectors: string[]): Promise<boolean> => {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
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
}: {
  popup: Page;
  username: string;
  password: string;
  roleCode: WorkflowRoleCode;
  logE2E: (message: string) => void;
}) => {
  const usernameSelectors = ['#user', '#username', 'input[name="user"]', 'input[name="username"]'];
  const passwordSelectors = ['#password', 'input[name="password"]'];
  const submitSelectors = ['#kc-login', 'button[type="submit"]', 'input[type="submit"]'];

  const deadline = Date.now() + 60000;
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

export const waitForLocalStorageAuth = async (page: Page): Promise<AuthData> => {
  await expect
    .poll(
      async () => {
        try {
          return await page.evaluate(() => {
            const raw = window.localStorage.getItem('range-web-auth');
            if (!raw) return '';
            try {
              const parsed = JSON.parse(raw);
              return parsed?.access_token ? raw : '';
            } catch {
              return '';
            }
          });
        } catch {
          return '';
        }
      },
      { timeout: 90000 },
    )
    .not.toEqual('');

  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    const authData = await page
      .evaluate(() => JSON.parse(window.localStorage.getItem('range-web-auth') || '{}'))
      .catch(() => null as AuthData | null);

    if (authData && typeof authData === 'object' && authData.access_token) {
      return authData;
    }

    await page.waitForTimeout(250);
  }

  throw new Error('Timed out while reading auth data from localStorage after login popup flow.');
};

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

  await page.goto('/');

  const popupPromise = page.waitForEvent('popup');
  if (loginMode === 'bceid') {
    await page.locator('#login_bceid_button').click();
  } else {
    await page.getByRole('button', { name: 'Staff Login' }).click();
  }

  const popup = await popupPromise;
  await fillLoginPopup({ popup, username, password, roleCode, logE2E });

  await popup.waitForEvent('close', { timeout: 90000 }).catch(() => undefined);

  return waitForLocalStorageAuth(page);
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
  const apiContext = await request.newContext();
  const userResponse = await apiContext.get(`${apiBaseUrl}/v1/user/me`, {
    headers: { Authorization: `Bearer ${authData.access_token}` },
  });

  if (!userResponse.ok()) {
    throw new Error(`Failed to load user profile (${userResponse.status()})`);
  }

  const user = await userResponse.json();
  await apiContext.dispose();

  await page.goto('/');
  await page.evaluate(
    ({ auth, profile }) => {
      window.localStorage.setItem('range-web-auth', JSON.stringify(auth));
      window.localStorage.setItem('range-web-user', JSON.stringify(profile));
    },
    { auth: authData, profile: user },
  );
  await page.goto('/select-range-use-plan');

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
  logE2E,
}: {
  page: Page;
  roleCode: WorkflowRoleCode;
  roleByCode: Record<WorkflowRoleCode, number>;
  getSingleUserRecord: () => Promise<{ id: number; sso_id: string }>;
  setUserRoleById: ({ userId, roleId }: { userId: number; roleId: number }) => Promise<void>;
  loginPageAs: ({ page, roleCode }: { page: Page; roleCode: WorkflowRoleCode }) => Promise<string>;
  logE2E: (message: string) => void;
}) => {
  const roleId = roleByCode[roleCode];
  if (!roleId) {
    throw new Error(`switchRoleAndRelogin only supports SA, DM, AH. Received: ${roleCode}`);
  }

  const userRecord = await getSingleUserRecord();
  logE2E(`[AUTH] switching single user to ${roleCode} (roleId=${roleId}) and re-login`);
  await setUserRoleById({ userId: userRecord.id, roleId });
  await clearSession(page);
  return loginPageAs({ page, roleCode });
};
