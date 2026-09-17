import { expect, test, request, type APIRequestContext, type Page } from '@playwright/test';
import {
  loginPageAs as runtimeLoginPageAs,
  switchRoleAndRelogin as runtimeSwitchRoleAndRelogin,
  type WorkflowRoleCode,
} from './support/authRuntime';
import {
  MANAGE_CLIENTS_PERMISSION_ID,
  cleanupSeed,
  clickAddLink,
  createSeedClient,
  createSeedUser,
  deleteLinkedClient,
  ensureRolePermission,
  expectAddLinkDisabled,
  expectLinkedClientRow,
  expectManageClientsNavLink,
  expectNoClientsLinked,
  getUserWithClients,
  gotoManageClients,
  linkClientViaApi,
  linkedClientNumbers,
  revokeRolePermission,
  selectClientFromDropdown,
  selectUserFromDropdown,
  unlinkClientViaApi,
  type SeedClient,
  type SeedUser,
} from './support/manageClientsRuntime';
import {
  extensionRoleByCode as roleByCode,
  getApiBaseUrl,
  getDbPool,
  getSingleUserLoginMode,
  getSingleUserPassword,
  getSingleUserRecordForDb,
  getSingleUserUsername,
  setUserRoleById,
} from './support/extensionRuntime';

const logE2E = (message: string) => {
  console.log(`[E2E] ${message}`);
};

type RoleCode = WorkflowRoleCode;

let cachedSingleUserRecord: { id: number; sso_id: string } | null = null;
let seedUser: SeedUser | null = null;
let seedClient: SeedClient | null = null;

const requireSeed = (): { seedUser: SeedUser; seedClient: SeedClient } => {
  if (!seedUser || !seedClient) {
    throw new Error('Manage-clients seed fixtures are not initialised');
  }
  return { seedUser, seedClient };
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

test.describe('Manage clients', () => {
  test.describe.configure({ timeout: 240000 });

  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    await ensureRolePermission({
      getDbPool,
      roleId: roleByCode.SA,
      permissionId: MANAGE_CLIENTS_PERMISSION_ID,
      logE2E,
    });
    seedUser = await createSeedUser({ getDbPool, roleId: roleByCode.AH, logE2E });
    seedClient = await createSeedClient({ getDbPool, logE2E });
  });

  test.afterEach(async () => {
    if (cachedSingleUserRecord) {
      await setUserRoleById({ userId: cachedSingleUserRecord.id, roleId: roleByCode.SA });
    }
  });

  test.afterAll(async () => {
    if (seedUser && seedClient) {
      await cleanupSeed({ getDbPool, userId: seedUser.id, clientNumber: seedClient.clientNumber, logE2E });
      seedUser = null;
      seedClient = null;
    }
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test('shows the Manage Clients nav link only with the manage-clients permission', async ({ page }) => {
    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await page.goto('/home');
    await expectManageClientsNavLink(page, { visible: true });

    await revokeRolePermission({
      getDbPool,
      roleId: roleByCode.SA,
      permissionId: MANAGE_CLIENTS_PERMISSION_ID,
      logE2E,
    });
    try {
      await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await page.goto('/home');
      await expectManageClientsNavLink(page, { visible: false });
    } finally {
      await ensureRolePermission({
        getDbPool,
        roleId: roleByCode.SA,
        permissionId: MANAGE_CLIENTS_PERMISSION_ID,
        logE2E,
      });
    }

    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await page.goto('/home');
    await expectManageClientsNavLink(page, { visible: true });
  });

  test('shows empty states before selection and for a user with no linked clients', async ({ page }) => {
    const { seedUser: user } = requireSeed();
    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await page.goto('/manage-client');
    await expect(page.getByText('Step 1: Search and select the user', { exact: false })).toBeVisible();
    await expect(page.getByText('Please select a user', { exact: true })).toBeVisible();

    await selectUserFromDropdown({ page, searchText: user.sso_id, optionTextContains: user.sso_id, logE2E });
    await expectNoClientsLinked(page);
    await expectAddLinkDisabled(page);
  });

  test('links and unlinks a client end to end', async ({ page }) => {
    const { seedUser: user, seedClient: client } = requireSeed();
    const token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await gotoManageClients({ page, logE2E });

    await selectUserFromDropdown({ page, searchText: user.sso_id, optionTextContains: user.sso_id, logE2E });
    await selectClientFromDropdown({
      page,
      searchText: client.name,
      optionTextContains: client.clientNumber,
      logE2E,
    });
    await clickAddLink(page);
    await expectLinkedClientRow(page, client.clientNumber);

    const linked = await getUserWithClients({ apiContext, token, apiBaseUrl: getApiBaseUrl(), userId: user.id });
    if (!linkedClientNumbers(linked).includes(client.clientNumber)) {
      throw new Error(`Client ${client.clientNumber} is not linked to user ${user.id} after Add link`);
    }

    await deleteLinkedClient({ page, clientNumber: client.clientNumber, clientName: client.name, confirm: true });
    await expectNoClientsLinked(page);

    const unlinked = await getUserWithClients({ apiContext, token, apiBaseUrl: getApiBaseUrl(), userId: user.id });
    if (linkedClientNumbers(unlinked).includes(client.clientNumber)) {
      throw new Error(`Client ${client.clientNumber} is still linked to user ${user.id} after Delete`);
    }
  });

  test('cancelling the delete dialog keeps the link', async ({ page }) => {
    const { seedUser: user, seedClient: client } = requireSeed();
    const token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await linkClientViaApi({
      apiContext,
      token,
      apiBaseUrl: getApiBaseUrl(),
      userId: user.id,
      clientNumber: client.clientNumber,
    });
    try {
      await gotoManageClients({ page, logE2E });
      await selectUserFromDropdown({ page, searchText: user.sso_id, optionTextContains: user.sso_id, logE2E });
      await expectLinkedClientRow(page, client.clientNumber);
      await deleteLinkedClient({
        page,
        clientNumber: client.clientNumber,
        clientName: client.name,
        confirm: false,
      });
      await expectLinkedClientRow(page, client.clientNumber);
    } finally {
      await unlinkClientViaApi({
        apiContext,
        token,
        apiBaseUrl: getApiBaseUrl(),
        userId: user.id,
        clientNumber: client.clientNumber,
        logE2E,
      });
    }

    const unlinked = await getUserWithClients({ apiContext, token, apiBaseUrl: getApiBaseUrl(), userId: user.id });
    if (linkedClientNumbers(unlinked).includes(client.clientNumber)) {
      throw new Error(`Client ${client.clientNumber} is still linked to user ${user.id} after cleanup`);
    }
  });
});
