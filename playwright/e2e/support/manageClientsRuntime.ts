import { randomInt } from 'crypto';
import { expect, type APIRequestContext, type Page } from '@playwright/test';
import type { Pool } from 'pg';

export const MANAGE_CLIENTS_PERMISSION_ID = 8;

export type SeedUser = {
  id: number;
  username: string;
  sso_id: string;
};

export type SeedClient = {
  clientNumber: string;
  name: string;
};

type GetDbPool = () => Pool;
type LogE2E = (message: string) => void;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

export const createSeedUser = async ({
  getDbPool,
  roleId,
  logE2E,
}: {
  getDbPool: GetDbPool;
  roleId: number;
  logE2E: LogE2E;
}): Promise<SeedUser> => {
  const suffix = randomInt(1_000_000);
  const username = `e2e-auto-mc-user-${suffix}`;
  const pool = getDbPool();
  try {
    const result = await pool.query(
      `INSERT INTO user_account (username, email, given_name, family_name, sso_id, role_id, active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, username, sso_id`,
      [username, `${username}@example.com`, 'E2e', `Auto Mc ${suffix}`, `bceid\\${username}`, roleId],
    );
    const seedUser = result.rows[0] as SeedUser;
    logE2E(`[E2E] created seed manage-clients user id=${seedUser.id} sso_id=${seedUser.sso_id}`);
    return seedUser;
  } finally {
    await pool.end();
  }
};

export const createSeedClient = async ({
  getDbPool,
  logE2E,
}: {
  getDbPool: GetDbPool;
  logE2E: LogE2E;
}): Promise<SeedClient> => {
  const pool = getDbPool();
  try {
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      const clientNumber = `E${String(randomInt(10_000_000)).padStart(7, '0')}`;
      const name = `E2E-AUTO-MC ${clientNumber}`;
      try {
        await pool.query(
          `INSERT INTO ref_client (client_number, name, location_codes)
           VALUES ($1, $2, $3)`,
          [clientNumber, name, ['01']],
        );
        logE2E(`[E2E] created seed client ${clientNumber}`);
        return { clientNumber, name };
      } catch (error) {
        const code = (error as { code?: string }).code;
        if (code === '23505' && attempt < 5) {
          continue;
        }
        throw error;
      }
    }
    throw new Error('Could not generate a unique seed client_number after 5 attempts');
  } finally {
    await pool.end();
  }
};

export const cleanupSeed = async ({
  getDbPool,
  userId,
  clientNumber,
  logE2E,
}: {
  getDbPool: GetDbPool;
  userId: number;
  clientNumber: string;
  logE2E: LogE2E;
}): Promise<void> => {
  const pool = getDbPool();
  try {
    await pool.query('DELETE FROM user_client_link WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM user_account WHERE id = $1', [userId]);
    await pool.query('DELETE FROM ref_client WHERE client_number = $1', [clientNumber]);
    logE2E(`[E2E] cleaned up seed user ${userId} and client ${clientNumber}`);
  } finally {
    await pool.end();
  }
};

export const getUserWithClients = async ({
  apiContext,
  token,
  apiBaseUrl,
  userId,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
  userId: number;
}): Promise<{ clients?: Array<{ clientNumber: string }> }> => {
  const response = await apiContext.get(`${apiBaseUrl}/v1/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`Failed to load seeded user ${userId} (${response.status()})`);
  }
  return (await response.json()) as { clients?: Array<{ clientNumber: string }> };
};

export const linkedClientNumbers = (user: { clients?: Array<{ clientNumber: string }> }): string[] =>
  (user.clients || []).map((client) => client.clientNumber);

export const linkClientViaApi = async ({
  apiContext,
  token,
  apiBaseUrl,
  userId,
  clientNumber,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
  userId: number;
  clientNumber: string;
}): Promise<void> => {
  const response = await apiContext.post(`${apiBaseUrl}/v1/user/${userId}/client`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { clientId: clientNumber },
  });
  if (!response.ok()) {
    throw new Error(`Failed to link client ${clientNumber} to user ${userId} (${response.status()})`);
  }
};

export const unlinkClientViaApi = async ({
  apiContext,
  token,
  apiBaseUrl,
  userId,
  clientNumber,
  logE2E,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
  userId: number;
  clientNumber: string;
  logE2E: LogE2E;
}): Promise<void> => {
  const response = await apiContext.delete(`${apiBaseUrl}/v1/user/${userId}/client/${clientNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status() === 404) {
    logE2E(`[E2E] link ${userId}/${clientNumber} already gone (404 on cleanup delete)`);
    return;
  }
  if (!response.ok()) {
    throw new Error(`Failed to unlink client ${clientNumber} from user ${userId} (${response.status()})`);
  }
};

export const gotoManageClients = async ({ page, logE2E }: { page: Page; logE2E: LogE2E }): Promise<void> => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'Manage Clients' }).click();
  await expect(page).toHaveURL(/\/manage-client/);
  await expect(page.getByText('Step 1: Search and select the user', { exact: false })).toBeVisible();
  logE2E('[E2E] opened Manage Clients page');
};

export const expectManageClientsNavLink = async (page: Page, { visible }: { visible: boolean }): Promise<void> => {
  const link = page.getByRole('link', { name: 'Manage Clients' });
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
  logE2E(`[E2E] selected manage-clients user matching ${optionTextContains}`);
};

export const selectClientFromDropdown = async ({
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
  await selectFromAutocomplete({ page, inputLabel: 'Select client', searchText, optionTextContains });
  logE2E(`[E2E] selected client matching ${optionTextContains}`);
};

export const clickAddLink = async (page: Page): Promise<void> => {
  const button = page.getByRole('button', { name: 'Add link' });
  await expect(button).toBeEnabled();
  await button.click();
};

export const expectAddLinkDisabled = async (page: Page): Promise<void> => {
  await expect(page.getByRole('button', { name: 'Add link' })).toBeDisabled();
};

export const expectLinkedClientRow = async (page: Page, clientNumber: string): Promise<void> => {
  await expect(page.getByText(`Client # ${clientNumber}`, { exact: false })).toBeVisible();
};

export const expectNoClientsLinked = async (page: Page): Promise<void> => {
  await expect(page.getByText('No clients linked', { exact: true })).toBeVisible();
};

export const deleteLinkedClient = async ({
  page,
  clientNumber,
  clientName,
  confirm,
}: {
  page: Page;
  clientNumber: string;
  clientName: string;
  confirm: boolean;
}): Promise<void> => {
  const row = page.locator('section.manage-client').locator('li', { hasText: `Client # ${clientNumber}` });
  await row.getByRole('button', { name: 'delete' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Delete client link?', { exact: true })).toBeVisible();
  await expect(dialog.locator('#alert-dialog-description')).toContainText(clientName);
  await expect(dialog.locator('#alert-dialog-description')).toContainText(clientNumber);
  if (confirm) {
    await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
  } else {
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  }
};
