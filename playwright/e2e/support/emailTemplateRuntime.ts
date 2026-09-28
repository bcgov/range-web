import { randomInt } from 'crypto';
import { expect, request, type APIRequestContext, type Page } from '@playwright/test';
import type { Pool } from 'pg';
import type { WorkflowRoleCode } from './authRuntime';

export const MANAGE_EMAIL_TEMPLATES_PERMISSION_ID = 9; // canManageEmails in src/utils/helper/user.ts

// Role ids per src/constants/variables.ts USER_ROLE
export const ROLE_ID = {
  ADMIN: 1,
  STAFF_DECISION_MAKER: 2,
  STAFF_AGROLOGIST: 3,
  AGREEMENT_HOLDER: 4,
  EXTERNAL_AUDITOR: 5,
} as const;

/**
 * The Email Template page is admin-only (`ProtectedRoute` -> `isUserAdmin`, roleId 1),
 * so this suite maps `SA` to Admin instead of Staff Agrologist. `DM` stays a
 * non-admin staff role and is used to assert the route guard. `AH` is unused here.
 */
export const emailTemplateRoleByCode: Record<WorkflowRoleCode, number> = {
  SA: ROLE_ID.ADMIN,
  DM: ROLE_ID.STAFF_DECISION_MAKER,
  AH: ROLE_ID.AGREEMENT_HOLDER,
};

export type SeedEmailTemplate = {
  id: number;
  name: string;
  fromEmail: string;
  subject: string;
  body: string;
};

export type ApiEmailTemplate = {
  id: number;
  name: string;
  fromEmail: string;
  subject: string;
  body: string | null;
};

type GetDbPool = () => Pool;
type LogE2E = (message: string) => void;

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ensureRolePermission / revokeRolePermission intentionally mirror manageUsersRuntime.ts and
// manageClientsRuntime.ts so all e2e specs manage role_permissions the same idempotent way.
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

export const createSeedTemplate = async ({
  getDbPool,
  logE2E,
}: {
  getDbPool: GetDbPool;
  logE2E: LogE2E;
}): Promise<SeedEmailTemplate> => {
  const suffix = randomInt(1_000_000);
  const name = `E2E Auto Template ${suffix}`;
  const seed = {
    name,
    fromEmail: `e2e-auto-${suffix}@example.com`,
    subject: `E2E auto subject ${suffix}`,
    body: `<p>E2E auto body ${suffix}</p>`,
  };
  const pool = getDbPool();
  try {
    const result = await pool.query(
      `INSERT INTO email_template (name, from_email, subject, body)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [seed.name, seed.fromEmail, seed.subject, seed.body],
    );
    const id = Number(result.rows[0].id);
    logE2E(`[E2E] created seed email template id=${id} name=${seed.name}`);
    return { id, ...seed };
  } finally {
    await pool.end();
  }
};

export const deleteSeedTemplate = async ({
  getDbPool,
  templateId,
  logE2E,
}: {
  getDbPool: GetDbPool;
  templateId: number;
  logE2E: LogE2E;
}): Promise<void> => {
  const pool = getDbPool();
  try {
    await pool.query('DELETE FROM email_template WHERE id = $1', [templateId]);
    logE2E(`[E2E] deleted seed email template ${templateId}`);
  } finally {
    await pool.end();
  }
};

export const resetSeedTemplate = async ({
  getDbPool,
  template,
  logE2E,
}: {
  getDbPool: GetDbPool;
  template: SeedEmailTemplate;
  logE2E: LogE2E;
}): Promise<void> => {
  const pool = getDbPool();
  try {
    await pool.query('UPDATE email_template SET name = $2, from_email = $3, subject = $4, body = $5 WHERE id = $1', [
      template.id,
      template.name,
      template.fromEmail,
      template.subject,
      template.body,
    ]);
    logE2E(`[E2E] reset seed email template ${template.id} to its seeded values`);
  } finally {
    await pool.end();
  }
};

export const getTemplatesViaApi = async ({
  apiContext,
  token,
  apiBaseUrl,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
}): Promise<ApiEmailTemplate[]> => {
  const response = await apiContext.get(`${apiBaseUrl}/v1/emailtemplate`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`Failed to load email templates (${response.status()})`);
  }
  return (await response.json()) as ApiEmailTemplate[];
};

export const getTemplateViaApi = async ({
  apiContext,
  token,
  apiBaseUrl,
  templateId,
}: {
  apiContext: APIRequestContext;
  token: string;
  apiBaseUrl: string;
  templateId: number;
}): Promise<ApiEmailTemplate> => {
  const templates = await getTemplatesViaApi({ apiContext, token, apiBaseUrl });
  const template = templates.find((candidate) => Number(candidate.id) === templateId);
  if (!template) {
    throw new Error(`Email template ${templateId} was not returned by the API`);
  }
  return template;
};

/**
 * Resolves the user account the browser session is actually authenticated as.
 *
 * Looking the account up by `sso_id` is unreliable: environments can hold more
 * than one `user_account` row per SSO id (stale duplicates from earlier logins),
 * and the DB helper silently picks the lowest id. Role switches then land on an
 * account the session never uses. Asking the API who the token belongs to is
 * exact; the DB lookup stays as a fallback when no usable token is stored.
 */
export const resolveSessionUser = async ({
  page,
  apiBaseUrl,
  fallback,
  logE2E,
}: {
  page: Page;
  apiBaseUrl: string;
  fallback: () => Promise<{ id: number; sso_id: string }>;
  logE2E: LogE2E;
}): Promise<{ id: number; sso_id: string }> => {
  try {
    await page.goto('/');
    const token = await page.evaluate(() => {
      const raw = window.localStorage.getItem('range-web-auth');
      if (!raw) return null;
      try {
        return (JSON.parse(raw) as { access_token?: string }).access_token || null;
      } catch {
        return null;
      }
    });

    if (token) {
      const apiContext = await request.newContext();
      try {
        const response = await apiContext.get(`${apiBaseUrl}/v1/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok()) {
          const me = (await response.json()) as { id: number; ssoId?: string };
          logE2E(`[E2E] resolved session user id=${me.id} ssoId=${me.ssoId ?? 'unknown'}`);
          return { id: Number(me.id), sso_id: String(me.ssoId ?? '') };
        }
        logE2E(`[E2E] /v1/user/me returned ${response.status()} — falling back to the DB lookup`);
      } finally {
        await apiContext.dispose();
      }
    }
  } catch (error) {
    logE2E(
      `[E2E] could not resolve the session user (${
        error instanceof Error ? error.message.split('\n')[0] : 'unknown'
      }) — falling back to the DB lookup`,
    );
  }

  return fallback();
};

export const expectEmailTemplateNavLink = async (page: Page, { visible }: { visible: boolean }): Promise<void> => {
  const link = page.getByRole('link', { name: 'Email Template' });
  if (visible) {
    await expect(link).toBeVisible();
  } else {
    await expect(link).toHaveCount(0);
  }
};

const templateNameSelect = (page: Page) => page.getByRole('button', { name: /Template Name/ });

export const gotoEmailTemplates = async ({ page, logE2E }: { page: Page; logE2E: LogE2E }): Promise<void> => {
  await page.goto('/home');
  await page.getByRole('link', { name: 'Email Template' }).click();
  await expect(page).toHaveURL(/\/email-template/);
  await expect(templateNameSelect(page)).toBeVisible();
  logE2E('[E2E] opened Email Template page');
};

export const selectTemplateByName = async ({
  page,
  name,
  logE2E,
}: {
  page: Page;
  name: string;
  logE2E: LogE2E;
}): Promise<void> => {
  await templateNameSelect(page).click();
  const option = page.getByRole('option', { name: new RegExp(`^${escapeRegExp(name)}$`) });
  await expect(option.first()).toBeVisible();
  await option.first().click();
  await expect(page.getByRole('listbox')).toHaveCount(0);
  await expect(templateNameSelect(page)).toContainText(name);
  logE2E(`[E2E] selected email template ${name}`);
};

export const expectTemplateOptions = async ({ page, names }: { page: Page; names: string[] }): Promise<void> => {
  await templateNameSelect(page).click();
  for (const name of names) {
    await expect(page.getByRole('option', { name: new RegExp(`^${escapeRegExp(name)}$`) }).first()).toBeVisible();
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
};

const fromEmailField = (page: Page) => page.getByLabel('From Email');
const subjectField = (page: Page) => page.getByLabel('Subject');
const bodyField = (page: Page) => page.getByPlaceholder('Email Body (HTML)');

export const expectTemplateForm = async ({
  page,
  fromEmail,
  subject,
  body,
}: {
  page: Page;
  fromEmail?: string;
  subject?: string;
  body?: string;
}): Promise<void> => {
  if (fromEmail !== undefined) {
    await expect(fromEmailField(page)).toHaveValue(fromEmail);
  }
  if (subject !== undefined) {
    await expect(subjectField(page)).toHaveValue(subject);
  }
  if (body !== undefined) {
    await expect(bodyField(page)).toHaveValue(body);
  }
};

export const fillTemplateForm = async ({
  page,
  fromEmail,
  subject,
  body,
}: {
  page: Page;
  fromEmail?: string;
  subject?: string;
  body?: string;
}): Promise<void> => {
  if (fromEmail !== undefined) {
    await fromEmailField(page).fill(fromEmail);
  }
  if (subject !== undefined) {
    await subjectField(page).fill(subject);
  }
  if (body !== undefined) {
    await bodyField(page).fill(body);
  }
};

export const clickUpdate = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: /^Update/ }).click();
};

export const expectUpdateSuccess = async (page: Page): Promise<void> => {
  await expect(page.getByText('Template updated successfully', { exact: true })).toBeVisible();
};

export const expectUpdateError = async (page: Page): Promise<void> => {
  await expect(page.getByText(/^Error updating template:/)).toBeVisible();
};
