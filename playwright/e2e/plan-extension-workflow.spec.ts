import { expect, request, test, type APIRequestContext, type Page } from '@playwright/test';
import { loginPageAs as runtimeLoginPageAs } from './support/authRuntime';
import {
  extensionRoleByCode,
  getApiBaseUrl,
  getSingleUserLoginMode,
  getSingleUserPassword,
  getSingleUserRecordForDb,
  getSingleUserUsername,
  isSingleUserMode,
  setUserRoleById,
  type ExtensionRoleCode,
} from './support/extensionRuntime';

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

  test.beforeAll(async () => {
    apiContext = await request.newContext();
  });

  test.afterEach(async () => {
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
});
