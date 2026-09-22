import { randomInt } from 'crypto';
import { expect, type APIRequestContext, type APIResponse, type Page } from '@playwright/test';
import type { Pool } from 'pg';

export const ASSIGN_ROLES_PERMISSION_ID = 11;

// Role ids per src/constants/variables.ts USER_ROLE
export const ROLE_ID = {
  ADMIN: 1,
  STAFF_DECISION_MAKER: 2,
  STAFF_AGROLOGIST: 3,
  AGREEMENT_HOLDER: 4,
  EXTERNAL_AUDITOR: 5,
} as const;

export type SeedUser = {
  id: number;
  username: string;
  sso_id: string;
  // Unique token also embedded in family_name. The "Select user" Autocomplete on the
  // Assign Roles/Districts page filters options by full name (given + family name), not by
  // sso_id, so tests must search using this token rather than sso_id/username.
  searchToken: string;
};

type GetDbPool = () => Pool;
type LogE2E = (message: string) => void;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ensureRolePermission / revokeRolePermission intentionally mirror manageClientsRuntime.ts so
// both specs manage role_permissions the same idempotent way.
export const ensureRolePermission = async ({
  getDbPool,
  roleId,
  permissionId,
  logE2E,
}: {
  getDbPool: GetDbPool;
  roleId: number;
  permissionId: number;
  logE2E: LogE2E;
}): Promise<void> => {
  const pool = getDbPool();
  try {
    const existing = await pool.query(
      'SELECT id FROM role_permissions WHERE role_id = $1 AND permission_id = $2 LIMIT 1',
      [roleId, permissionId],
    );
    if ((existing.rowCount ?? 0) > 0) {
      logE2E(`[E2E] role ${roleId} already carries permission ${permissionId}`);
      return;
    }
    await pool.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [roleId, permissionId]);
    logE2E(`[E2E] granted permission ${permissionId} to role ${roleId}`);
  } finally {
    await pool.end();
  }
};

export const revokeRolePermission = async ({
  getDbPool,
  roleId,
  permissionId,
  logE2E,
}: {
  getDbPool: GetDbPool;
  roleId: number;
  permissionId: number;
  logE2E: LogE2E;
}): Promise<boolean> => {
  const pool = getDbPool();
  try {
    const result = await pool.query('DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2', [
      roleId,
      permissionId,
    ]);
    const hadPermission = (result.rowCount ?? 0) > 0;
    logE2E(`[E2E] revoked permission ${permissionId} from role ${roleId} (hadPermission=${hadPermission})`);
    return hadPermission;
  } finally {
    await pool.end();
  }
};

// Seeds a user with no role assigned yet (role_id NULL), matching a freshly onboarded
// BCeID/IDIR account that hasn't been triaged by a Staff Admin. The Assign Roles/Districts
// page treats a null roleId as "No role in database yet" (see getUserRoleObj / getUserRole).
export const createSeedUser = async ({
  getDbPool,
  roleId = null,
  logE2E,
}: {
  getDbPool: GetDbPool;
  roleId?: number | null;
  logE2E: LogE2E;
}): Promise<SeedUser> => {
  const suffix = randomInt(1_000_000);
  const username = `e2e-auto-mu-user-${suffix}`;
  const searchToken = `AutoMu${suffix}`;
  const pool = getDbPool();
  try {
    const result = await pool.query(
      `INSERT INTO user_account (username, email, given_name, family_name, sso_id, role_id, active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, username, sso_id`,
      [username, `${username}@example.com`, 'E2e', searchToken, `bceid\\${username}`, roleId],
    );
    const seedUser = { ...(result.rows[0] as Omit<SeedUser, 'searchToken'>), searchToken };
    logE2E(
      `[E2E] created seed manage-users user id=${seedUser.id} sso_id=${seedUser.sso_id} roleId=${roleId ?? 'null'}`,
    );
    return seedUser;
  } finally {
    await pool.end();
  }
};

export const getDistrictIdByCode = async ({
  getDbPool,
  districtCode,
}: {
  getDbPool: GetDbPool;
  districtCode: string;
}): Promise<number> => {
  const pool = getDbPool();
  try {
    const result = await pool.query('SELECT id FROM ref_district WHERE code = $1', [districtCode]);
    if (result.rowCount !== 1) {
      throw new Error(`Could not find district by code='${districtCode}'`);
    }
    return result.rows[0].id;
  } finally {
    await pool.end();
  }
};

export const cleanupSeed = async ({
  getDbPool,
  userId,
  logE2E,
}: {
  getDbPool: GetDbPool;
  userId: number;
  logE2E: LogE2E;
}): Promise<void> => {
  const pool = getDbPool();
  try {
    await pool.query('DELETE FROM user_districts WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM user_account WHERE id = $1', [userId]);
    logE2E(`[E2E] cleaned up seed user ${userId}`);
  } finally {
    await pool.end();
  }
};

export const getUserRoleAndDistrictsViaApi = async ({
  apiContext,
  token,
  apiBaseUrl,
  userId,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
  userId: number;
}): Promise<{ roleId: number | null; districtIds: number[] }> => {
  const userResponse = await apiContext.get(`${apiBaseUrl}/v1/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!userResponse.ok()) {
    throw new Error(`Failed to load seeded user ${userId} (${userResponse.status()})`);
  }
  const user = (await userResponse.json()) as { roleId?: number | null };

  const districtsResponse = await apiContext.get(`${apiBaseUrl}/v1/user/${userId}/districts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!districtsResponse.ok()) {
    // Agreement Holders are rejected outright by getAssociatedDistricts; treat as no districts.
    return { roleId: user.roleId ?? null, districtIds: [] };
  }
  const districts = (await districtsResponse.json()) as Array<{ id: number }>;
  return { roleId: user.roleId ?? null, districtIds: districts.map((d) => d.id) };
};

export const assignRoleViaApi = async ({
  apiContext,
  token,
  apiBaseUrl,
  userId,
  roleId,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
  userId: number;
  roleId: number;
}): Promise<void> => {
  const response = await apiContext.post(`${apiBaseUrl}/v1/user/${userId}/assignRole`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { roleId },
  });
  if (!response.ok()) {
    throw new Error(`Failed to assign role ${roleId} to user ${userId} (${response.status()})`);
  }
};

export const assignDistrictsViaApi = async ({
  apiContext,
  token,
  apiBaseUrl,
  userId,
  districtIds,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
  userId: number;
  districtIds: number[];
}): Promise<APIResponse> => {
  return apiContext.post(`${apiBaseUrl}/v1/user/${userId}/assignDistricts`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { districts: districtIds.map((id) => ({ id })) },
  });
};

export const gotoAssignRolesAndDistricts = async ({ page, logE2E }: { page: Page; logE2E: LogE2E }): Promise<void> => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'Assign Roles/Districts' }).click();
  await expect(page).toHaveURL(/\/assign-roles-and-districts/);
  await expect(page.getByText("Select the user who you'd like to edit", { exact: false })).toBeVisible();
  logE2E('[E2E] opened Assign Roles/Districts page');
};

export const expectAssignRolesNavLink = async (page: Page, { visible }: { visible: boolean }): Promise<void> => {
  const link = page.getByRole('link', { name: 'Assign Roles/Districts' });
  if (visible) {
    await expect(link).toBeVisible();
  } else {
    await expect(link).toHaveCount(0);
  }
};

const selectFromAutocomplete = async ({
  page,
  inputLabel,
  searchText,
  optionTextContains,
}: {
  page: Page;
  inputLabel: string;
  searchText: string;
  optionTextContains: string;
}): Promise<void> => {
  const input = page.getByRole('textbox', { name: inputLabel });
  await input.click();
  await input.fill(searchText);
  const option = page.getByRole('option', { name: new RegExp(escapeRegExp(optionTextContains)) });
  await expect(option.first()).toBeVisible({ timeout: 15000 });
  await option.first().click();
};

export const selectUserFromDropdown = async ({
  page,
  searchText,
  optionTextContains,
  logE2E,
}: {
  page: Page;
  searchText: string;
  optionTextContains: string;
  logE2E: LogE2E;
}): Promise<void> => {
  await selectFromAutocomplete({ page, inputLabel: 'Select user', searchText, optionTextContains });
  logE2E(`[E2E] selected assign-roles user matching ${optionTextContains}`);
};

export const selectRoleFromDropdown = async ({
  page,
  roleDescription,
  logE2E,
}: {
  page: Page;
  roleDescription: string;
  logE2E: LogE2E;
}): Promise<void> => {
  await selectFromAutocomplete({
    page,
    inputLabel: 'Role',
    searchText: roleDescription,
    optionTextContains: roleDescription,
  });
  logE2E(`[E2E] selected role ${roleDescription}`);
};

export const selectDistrictFromDropdown = async ({
  page,
  districtCode,
  logE2E,
}: {
  page: Page;
  districtCode: string;
  logE2E: LogE2E;
}): Promise<void> => {
  await selectFromAutocomplete({
    page,
    inputLabel: 'Select Districts',
    searchText: districtCode,
    optionTextContains: districtCode,
  });
  logE2E(`[E2E] selected district ${districtCode}`);
};

export const clickAssignButton = async (page: Page): Promise<void> => {
  const button = page.getByRole('button', { name: 'Assign User Role/Districts' });
  await expect(button).toBeEnabled();
  await button.click();
};

export const expectAssignButtonDisabled = async (page: Page): Promise<void> => {
  await expect(page.getByRole('button', { name: 'Assign User Role/Districts' })).toBeDisabled();
};

export const expectAssignSuccessMessage = async (page: Page): Promise<void> => {
  await expect(page.getByText('Role and Districts assigned to account successfully', { exact: true })).toBeVisible();
};

export const expectAhDistrictErrorMessage = async (page: Page): Promise<void> => {
  await expect(page.getByText('Range Agreement Holders cannot be assigned districts.', { exact: true })).toBeVisible();
};
