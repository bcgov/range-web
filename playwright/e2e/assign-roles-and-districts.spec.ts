import { expect, test, request, type APIRequestContext, type Page } from '@playwright/test';
import {
  loginPageAs as runtimeLoginPageAs,
  switchRoleAndRelogin as runtimeSwitchRoleAndRelogin,
  type WorkflowRoleCode,
} from './support/authRuntime';
import {
  ASSIGN_ROLES_PERMISSION_ID,
  ROLE_ID,
  assignDistrictsViaApi,
  assignRoleViaApi,
  clickAssignButton,
  createSeedUser,
  cleanupSeed,
  ensureRolePermission,
  expectAhDistrictErrorMessage,
  expectAssignButtonDisabled,
  expectAssignRolesNavLink,
  expectAssignSuccessMessage,
  getDistrictIdByCode,
  getUserRoleAndDistrictsViaApi,
  gotoAssignRolesAndDistricts,
  revokeRolePermission,
  selectDistrictFromDropdown,
  selectRoleFromDropdown,
  selectUserFromDropdown,
  type SeedUser,
} from './support/manageUsersRuntime';
import {
  extensionRoleByCode as roleByCode,
  getApiBaseUrl,
  getDbPool,
  getSingleUserLoginMode,
  getSingleUserPassword,
  getSingleUserRecordForDb,
  getSingleUserUsername,
  getTestDistrictCode,
  setUserRoleById,
} from './support/extensionRuntime';

const logE2E = (message: string) => {
  console.log(`[E2E] ${message}`);
};

type RoleCode = WorkflowRoleCode;

let cachedSingleUserRecord: { id: number; sso_id: string } | null = null;
let testDistrictId: number | null = null;

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

test.describe('Assign Roles and Districts', () => {
  test.describe.configure({ timeout: 240000 });

  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    await ensureRolePermission({
      getDbPool,
      roleId: roleByCode.SA,
      permissionId: ASSIGN_ROLES_PERMISSION_ID,
      logE2E,
    });
    testDistrictId = await getDistrictIdByCode({ getDbPool, districtCode: getTestDistrictCode() });
  });

  test.afterEach(async () => {
    if (cachedSingleUserRecord) {
      await setUserRoleById({ userId: cachedSingleUserRecord.id, roleId: roleByCode.SA });
    }
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test('shows the Assign Roles/Districts nav link only with the assign-roles permission', async ({ page }) => {
    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await page.goto('/home');
    await expectAssignRolesNavLink(page, { visible: true });

    await revokeRolePermission({
      getDbPool,
      roleId: roleByCode.SA,
      permissionId: ASSIGN_ROLES_PERMISSION_ID,
      logE2E,
    });
    try {
      await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await page.goto('/home');
      await expectAssignRolesNavLink(page, { visible: false });
    } finally {
      await ensureRolePermission({
        getDbPool,
        roleId: roleByCode.SA,
        permissionId: ASSIGN_ROLES_PERMISSION_ID,
        logE2E,
      });
    }

    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await page.goto('/home');
    await expectAssignRolesNavLink(page, { visible: true });
  });

  test('shows empty states before selection and for a user with no role assigned', async ({ page }) => {
    const seedUser: SeedUser = await createSeedUser({ getDbPool, roleId: null, logE2E });
    try {
      await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await gotoAssignRolesAndDistricts({ page, logE2E });

      // Before a user is selected: only the user selector is present.
      await expect(page.getByRole('textbox', { name: 'Role' })).toHaveCount(0);
      await expect(page.getByRole('button', { name: 'Assign User Role/Districts' })).toHaveCount(0);

      await selectUserFromDropdown({
        page,
        searchText: seedUser.searchToken,
        optionTextContains: seedUser.searchToken,
        logE2E,
      });

      // After selecting a user with no role/districts: selectors appear. The Role field defaults
      // to a synthetic "No role in database yet" option (see getUserRoleObj), which is a truthy
      // value, so the Assign button is already rendered here even though nothing has been
      // explicitly chosen yet — this is current app behavior, not a bug this test asserts around.
      await expect(page.getByRole('textbox', { name: 'Role' })).toHaveValue('No role in database yet');
      await expect(page.getByRole('textbox', { name: 'Select Districts' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Assign User Role/Districts' })).toBeVisible();
    } finally {
      await cleanupSeed({ getDbPool, userId: seedUser.id, logE2E });
    }
  });

  test('assigns a role and districts end to end, then updates them', async ({ page }) => {
    const seedUser: SeedUser = await createSeedUser({ getDbPool, roleId: null, logE2E });
    const testDistrictCode = getTestDistrictCode();
    try {
      const token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await gotoAssignRolesAndDistricts({ page, logE2E });

      await selectUserFromDropdown({
        page,
        searchText: seedUser.searchToken,
        optionTextContains: seedUser.searchToken,
        logE2E,
      });
      await selectRoleFromDropdown({ page, roleDescription: 'Staff Agrologist', logE2E });
      await selectDistrictFromDropdown({ page, districtCode: testDistrictCode, logE2E });
      await clickAssignButton(page);
      await expectAssignSuccessMessage(page);

      const afterFirstAssign = await getUserRoleAndDistrictsViaApi({
        apiContext,
        token,
        apiBaseUrl: getApiBaseUrl(),
        userId: seedUser.id,
      });
      expect(afterFirstAssign.roleId).toBe(ROLE_ID.STAFF_AGROLOGIST);
      expect(afterFirstAssign.districtIds).toContain(testDistrictId);

      // Re-select the user (page state resets districts to the freshly-fetched value) and
      // change the role to a different non-AH role with the same district, to exercise the
      // update path (replaces existing user_districts rows rather than duplicating them).
      await gotoAssignRolesAndDistricts({ page, logE2E });
      await selectUserFromDropdown({
        page,
        searchText: seedUser.searchToken,
        optionTextContains: seedUser.searchToken,
        logE2E,
      });
      await selectRoleFromDropdown({ page, roleDescription: 'Staff Decision Maker', logE2E });
      await clickAssignButton(page);
      await expectAssignSuccessMessage(page);

      const afterUpdate = await getUserRoleAndDistrictsViaApi({
        apiContext,
        token,
        apiBaseUrl: getApiBaseUrl(),
        userId: seedUser.id,
      });
      expect(afterUpdate.roleId).toBe(ROLE_ID.STAFF_DECISION_MAKER);
      expect(afterUpdate.districtIds).toContain(testDistrictId);
    } finally {
      await cleanupSeed({ getDbPool, userId: seedUser.id, logE2E });
    }
  });

  test('prevents assigning districts to a Range Agreement Holder', async ({ page }) => {
    const seedUser: SeedUser = await createSeedUser({ getDbPool, roleId: null, logE2E });
    const testDistrictCode = getTestDistrictCode();
    try {
      await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await gotoAssignRolesAndDistricts({ page, logE2E });

      await selectUserFromDropdown({
        page,
        searchText: seedUser.searchToken,
        optionTextContains: seedUser.searchToken,
        logE2E,
      });
      await selectDistrictFromDropdown({ page, districtCode: testDistrictCode, logE2E });
      await selectRoleFromDropdown({ page, roleDescription: 'Range Agreement Holder', logE2E });

      await expectAssignButtonDisabled(page);
      await expectAhDistrictErrorMessage(page);

      // Document the current server-side behavior when the UI guard is bypassed: the API
      // rejects the request but as an unhandled 500 (bare `throw` in UserController), not a
      // clean 4xx. This test locks in today's actual behavior so a future fix is a visible,
      // intentional change rather than a silent regression.
      const token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await assignRoleViaApi({
        apiContext,
        token,
        apiBaseUrl: getApiBaseUrl(),
        userId: seedUser.id,
        roleId: ROLE_ID.AGREEMENT_HOLDER,
      });
      const response = await assignDistrictsViaApi({
        apiContext,
        token,
        apiBaseUrl: getApiBaseUrl(),
        userId: seedUser.id,
        districtIds: testDistrictId ? [testDistrictId] : [],
      });
      expect(response.status()).toBe(500);
      const body = (await response.json()) as { error?: string; success?: boolean };
      expect(body.success).toBe(false);
    } finally {
      await cleanupSeed({ getDbPool, userId: seedUser.id, logE2E });
    }
  });

  test('shows an error message when the assign-role request fails', async ({ page }) => {
    const seedUser: SeedUser = await createSeedUser({ getDbPool, roleId: null, logE2E });
    try {
      await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await gotoAssignRolesAndDistricts({ page, logE2E });

      // Force the assignRole call to fail so we can assert the UI's error-state rendering
      // deterministically, without depending on a real backend/data anomaly.
      await page.route('**/v1/user/*/assignRole', (route) =>
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'boom' }) }),
      );

      await selectUserFromDropdown({
        page,
        searchText: seedUser.searchToken,
        optionTextContains: seedUser.searchToken,
        logE2E,
      });
      await selectRoleFromDropdown({ page, roleDescription: 'Staff Agrologist', logE2E });
      await clickAssignButton(page);

      await expect(page.getByText('Error assigning to account:', { exact: false })).toBeVisible();
    } finally {
      await cleanupSeed({ getDbPool, userId: seedUser.id, logE2E });
    }
  });
});
