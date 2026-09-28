import { expect, test, request, type APIRequestContext, type Page } from '@playwright/test';
import {
  loginPageAs as runtimeLoginPageAs,
  switchRoleAndRelogin as runtimeSwitchRoleAndRelogin,
  type WorkflowRoleCode,
} from './support/authRuntime';
import {
  MANAGE_EMAIL_TEMPLATES_PERMISSION_ID,
  ROLE_ID,
  clickUpdate,
  createSeedTemplate,
  deleteSeedTemplate,
  emailTemplateRoleByCode as roleByCode,
  ensureRolePermission,
  expectEmailTemplateNavLink,
  expectTemplateForm,
  expectTemplateOptions,
  expectUpdateError,
  expectUpdateSuccess,
  fillTemplateForm,
  getTemplateViaApi,
  gotoEmailTemplates,
  resetSeedTemplate,
  resolveSessionUser,
  revokeRolePermission,
  selectTemplateByName,
  type SeedEmailTemplate,
} from './support/emailTemplateRuntime';
import {
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
let seedTemplate: SeedEmailTemplate | null = null;

const requireSeedTemplate = (): SeedEmailTemplate => {
  if (!seedTemplate) {
    throw new Error('Email template seed fixture is not initialised');
  }
  return seedTemplate;
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
        cachedSingleUserRecord = await resolveSessionUser({
          page,
          apiBaseUrl: getApiBaseUrl(),
          fallback: getSingleUserRecordForDb,
          logE2E,
        });
      }
      return cachedSingleUserRecord;
    },
    setUserRoleById,
    loginPageAs,
    apiBaseUrl: getApiBaseUrl(),
    logE2E,
  });
};

test.describe('Email templates', () => {
  test.describe.configure({ timeout: 240000 });

  let apiContext: APIRequestContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    await ensureRolePermission({
      getDbPool,
      roleId: ROLE_ID.ADMIN,
      permissionId: MANAGE_EMAIL_TEMPLATES_PERMISSION_ID,
      logE2E,
    });
    seedTemplate = await createSeedTemplate({ getDbPool, logE2E });
  });

  test.afterEach(async () => {
    if (seedTemplate) {
      await resetSeedTemplate({ getDbPool, template: seedTemplate, logE2E });
    }
    if (cachedSingleUserRecord) {
      await setUserRoleById({ userId: cachedSingleUserRecord.id, roleId: ROLE_ID.ADMIN });
    }
  });

  test.afterAll(async () => {
    // Fail-safe: the nav-link test revokes this permission mid-suite and re-grants it in a
    // finally, but re-ensure here so a worker dying mid-test can't leak a permission-less Admin.
    await ensureRolePermission({
      getDbPool,
      roleId: ROLE_ID.ADMIN,
      permissionId: MANAGE_EMAIL_TEMPLATES_PERMISSION_ID,
      logE2E,
    });
    if (seedTemplate) {
      await deleteSeedTemplate({ getDbPool, templateId: seedTemplate.id, logE2E });
      seedTemplate = null;
    }
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test('shows the Email Template nav link only with the manage-email-templates permission', async ({ page }) => {
    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await page.goto('/home');
    await expectEmailTemplateNavLink(page, { visible: true });

    await revokeRolePermission({
      getDbPool,
      roleId: ROLE_ID.ADMIN,
      permissionId: MANAGE_EMAIL_TEMPLATES_PERMISSION_ID,
      logE2E,
    });
    try {
      await switchRoleAndRelogin({ page, roleCode: 'SA' });
      await page.goto('/home');
      await expectEmailTemplateNavLink(page, { visible: false });
    } finally {
      await ensureRolePermission({
        getDbPool,
        roleId: ROLE_ID.ADMIN,
        permissionId: MANAGE_EMAIL_TEMPLATES_PERMISSION_ID,
        logE2E,
      });
    }

    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await page.goto('/home');
    await expectEmailTemplateNavLink(page, { visible: true });
  });

  test('keeps the email template route admin-only', async ({ page }) => {
    await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await page.goto('/email-template');
    // Non-admins are bounced by ProtectedRoute; an authenticated user is then
    // sent on to /home by PublicRoute, so assert on leaving the page instead of
    // on a single landing route.
    await expect(page).not.toHaveURL(/\/email-template/);
    await expect(page.getByRole('button', { name: /Template Name/ })).toHaveCount(0);
    await expectEmailTemplateNavLink(page, { visible: false });
  });

  test('lists templates and loads the selected template into the form', async ({ page }) => {
    const template = requireSeedTemplate();
    await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await gotoEmailTemplates({ page, logE2E });

    await expectTemplateOptions({ page, names: ['Plan Status Change', template.name] });

    await selectTemplateByName({ page, name: template.name, logE2E });
    await expectTemplateForm({
      page,
      fromEmail: template.fromEmail,
      subject: template.subject,
      body: template.body,
    });
  });

  test('saves template edits and persists them across a reload', async ({ page }) => {
    const template = requireSeedTemplate();
    const token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await gotoEmailTemplates({ page, logE2E });
    await selectTemplateByName({ page, name: template.name, logE2E });

    const updated = {
      fromEmail: `updated-${template.fromEmail}`,
      subject: `${template.subject} (updated)`,
      body: `${template.body}<p>updated</p>`,
    };
    await fillTemplateForm({ page, ...updated });
    await clickUpdate(page);
    await expectUpdateSuccess(page);

    const persisted = await getTemplateViaApi({
      apiContext,
      token,
      apiBaseUrl: getApiBaseUrl(),
      templateId: template.id,
    });
    expect(persisted.fromEmail).toBe(updated.fromEmail);
    expect(persisted.subject).toBe(updated.subject);
    expect(persisted.body).toBe(updated.body);
    expect(persisted.name).toBe(template.name);

    await page.reload();
    await selectTemplateByName({ page, name: template.name, logE2E });
    await expectTemplateForm({ page, ...updated });
  });

  test('discards unsaved edits when another template is selected', async ({ page }) => {
    const template = requireSeedTemplate();
    const token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await gotoEmailTemplates({ page, logE2E });
    await selectTemplateByName({ page, name: template.name, logE2E });

    await fillTemplateForm({ page, subject: 'Never saved subject' });
    await selectTemplateByName({ page, name: 'Plan Status Change', logE2E });
    await selectTemplateByName({ page, name: template.name, logE2E });

    await expectTemplateForm({ page, subject: template.subject });

    const unchanged = await getTemplateViaApi({
      apiContext,
      token,
      apiBaseUrl: getApiBaseUrl(),
      templateId: template.id,
    });
    expect(unchanged.subject).toBe(template.subject);
  });

  test('surfaces an error when the update request fails', async ({ page }) => {
    const template = requireSeedTemplate();
    const token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await gotoEmailTemplates({ page, logE2E });
    await selectTemplateByName({ page, name: template.name, logE2E });

    await page.route(`**/v1/emailtemplate/${template.id}`, async (route) => {
      if (route.request().method() !== 'PUT') {
        await route.fallback();
        return;
      }
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await fillTemplateForm({ page, subject: `${template.subject} (failed save)` });
    await clickUpdate(page);
    await expectUpdateError(page);
    await expect(page.getByText('Template updated successfully', { exact: true })).toHaveCount(0);

    await page.unroute(`**/v1/emailtemplate/${template.id}`);

    const unchanged = await getTemplateViaApi({
      apiContext,
      token,
      apiBaseUrl: getApiBaseUrl(),
      templateId: template.id,
    });
    expect(unchanged.subject).toBe(template.subject);
  });
});
