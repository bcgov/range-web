import { expect, test } from '@playwright/test';
import { createPlanSeedByDb, cleanupSeedDataByAgreementIds, updatePlanStatusViaDb } from './support/dbRuntime';
import {
  getDbPool,
  getSeedSourceAgreementId,
  getSingleUserRecordForDb,
  getSingleUserSsoCandidatesForDb,
  getTestDistrictCode,
  setUserRoleById,
} from './support/extensionRuntime';
import {
  approveAllPlantCommunitiesByDb,
  deleteMapAttachmentsByDb,
  readPersistedPlanByDb,
  seedPlanCreationScheduleByDb,
  updatePlanCreationFixtureByDb,
  updateScheduleEntryByDb,
} from './support/planCreationRuntime';
import {
  addBlankAdditionalRequirement,
  addBlankIndicatorPlant,
  addBlankManagementConsideration,
  addBlankMinisterIssue,
  addBlankMonitoringArea,
  addBlankPlantCommunityAction,
  addBlankPlantCommunity,
  attemptSaveDraft,
  clearFirstHayCuttingTonnes,
  deleteFirstPasture,
  expectValidationMessage,
  expectValidationToast,
  openFirstPasture,
  openPlanAndWait,
  saveDraft,
  submitPlan,
} from './support/planCreationUiRuntime';

const E2E_PREFIX = 'E2E-AUTO';
const GRAZING_AGREEMENT_TYPE_ID = 1;
const HAY_CUTTING_AGREEMENT_TYPE_ID = 3;
const SCHEDULE_ENTRY_DATE_OUT_OF_RANGE = 'Schedule entry date(s) must be within the schedule year.';
const TOTAL_AUMS_EXCEEDS = 'Total AUMs exceeds authorized AUMs.';
const TOTAL_TONNES_EXCEEDS = 'Total tonnes exceeds authorized tonnes.';

type SeededPlan = {
  planId: string;
  agreementId: string;
  scheduleId: number;
  scheduleYear: number;
};

let cachedUserId: number | null = null;

const getCurrentUserId = async (): Promise<number> => {
  if (cachedUserId === null) {
    cachedUserId = Number((await getSingleUserRecordForDb()).id);
  }
  return cachedUserId;
};

const seedPlan = async (testCase: string, agreementTypeId: number): Promise<SeededPlan> => {
  const seeded = await createPlanSeedByDb({
    getDbPool,
    testCase,
    e2ePrefix: E2E_PREFIX,
    singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
    singleUserId: await getCurrentUserId(),
    districtCode: getTestDistrictCode(),
    sourceAgreementId: getSeedSourceAgreementId(),
    agreementTypeId,
    copySchedules: false,
  });
  const schedule = await seedPlanCreationScheduleByDb({
    getDbPool,
    planId: seeded.planId,
    agreementTypeId,
  });
  return {
    planId: seeded.planId,
    agreementId: seeded.agreementId,
    scheduleId: schedule.scheduleId,
    scheduleYear: schedule.scheduleYear,
  };
};

const logE2E = (message: string) => console.log(`[E2E:PLAN-CREATION] ${message}`);

test.describe('Plan creation validations and successful flows', () => {
  test.describe.configure({ timeout: 240000 });

  const seededAgreements: string[] = [];

  test.afterEach(async () => {
    if (seededAgreements.length === 0) return;
    const agreementIds = seededAgreements.splice(0);
    await cleanupSeedDataByAgreementIds({ getDbPool, agreementIds, logE2E });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const profile = await page.evaluate(() => JSON.parse(localStorage.getItem('range-web-user') || '{}'));
    if (!profile.id) {
      throw new Error('Authenticated E2E profile is missing from localStorage');
    }
    cachedUserId = Number(profile.id);
    await setUserRoleById({ userId: cachedUserId, roleId: 3 });
    await page.evaluate(() => {
      const current = JSON.parse(localStorage.getItem('range-web-user') || '{}');
      localStorage.setItem('range-web-user', JSON.stringify({ ...current, roleId: 3 }));
    });
    await page.reload();
  });

  test('blocks a grazing draft with missing basic information', async ({ page }) => {
    const seeded = await seedPlan('grazing-basic-required', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });

    await page.locator('input[name="rangeName"]').fill('');
    await attemptSaveDraft(page);
    await expectValidationMessage(page, /Required field/i);
  });

  test('blocks a grazing draft with a missing plan start date', async ({ page }) => {
    const seeded = await seedPlan('grazing-missing-start-date', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await updatePlanCreationFixtureByDb({
      getDbPool,
      planId: seeded.planId,
      fields: { planStartDate: null },
    });
    await openPlanAndWait({ page, planId: seeded.planId });

    await attemptSaveDraft(page);
    await expectValidationMessage(page, /Required field/i);
  });

  test('blocks a grazing draft with a missing plan end date', async ({ page }) => {
    const seeded = await seedPlan('grazing-missing-end-date', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await updatePlanCreationFixtureByDb({
      getDbPool,
      planId: seeded.planId,
      fields: { planEndDate: null },
    });
    await openPlanAndWait({ page, planId: seeded.planId });

    await attemptSaveDraft(page);
    await expectValidationMessage(page, /Required field/i);
  });

  test('blocks a grazing draft when the plan end date is not after the start date', async ({ page }) => {
    const seeded = await seedPlan('grazing-date-order', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await updatePlanCreationFixtureByDb({
      getDbPool,
      planId: seeded.planId,
      fields: { planStartDate: '2025-01-01', planEndDate: '2025-01-01' },
    });
    await openPlanAndWait({ page, planId: seeded.planId });

    await submitPlan(page);
    await expectValidationMessage(page, /Plan end date should be after start date/i);
  });

  test('blocks a plan with no pasture', async ({ page }) => {
    const seeded = await seedPlan('grazing-empty-pasture', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });

    await deleteFirstPasture(page);
    await submitPlan(page);
    await expectValidationToast(page, /Plan must have at least one pasture/i);
  });

  test('blocks an unapproved plant community', async ({ page }) => {
    const seeded = await seedPlan('grazing-plant-community-validation', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });

    await openFirstPasture(page);
    await addBlankPlantCommunity(page);
    await submitPlan(page);
    await expectValidationToast(page, /plant communities.*not been approved/i);
  });

  test('blocks an unidentified minister issue', async ({ page }) => {
    const seeded = await seedPlan('grazing-minister-issue-validation', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });

    await addBlankMinisterIssue(page);
    await submitPlan(page);
    await expectValidationToast(page, /minister issues.*not been identified/i);
  });

  test('blocks a pasture with an out-of-range private land deduction', async ({ page }) => {
    const seeded = await seedPlan('grazing-pasture-bounds', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });
    await openFirstPasture(page);
    await page.locator('input[name$=".pldPercent"]').first().fill('101');
    await submitPlan(page);
    await expectValidationMessage(page, /Please enter a value between 0 and 100/i);
  });

  test('validates plant community actions, indicator plants, and monitoring areas', async ({ page }) => {
    const seeded = await seedPlan('grazing-plant-community-fields', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });
    await openFirstPasture(page);
    await addBlankPlantCommunity(page);
    await addBlankPlantCommunityAction(page);
    await submitPlan(page);
    await expectValidationMessage(page, /Required field/i);
  });

  test('validates indicator plant required fields', async ({ page }) => {
    const seeded = await seedPlan('grazing-indicator-plant-validation', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });
    await openFirstPasture(page);
    await addBlankPlantCommunity(page);
    await addBlankIndicatorPlant(page);
    await submitPlan(page);
    await expectValidationMessage(page, /Required field/i);
  });

  test('validates monitoring area required fields', async ({ page }) => {
    const seeded = await seedPlan('grazing-monitoring-area-validation', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await approveAllPlantCommunitiesByDb({ getDbPool, planId: seeded.planId });
    await openPlanAndWait({ page, planId: seeded.planId });
    await openFirstPasture(page);
    await addBlankPlantCommunity(page);
    await addBlankMonitoringArea(page);
    await submitPlan(page);
    await expectValidationMessage(page, /Required field/i);
  });

  test('covers grazing schedule required fields, year rules, and AUM limits', async ({ page }) => {
    const seeded = await seedPlan('grazing-schedule-validation', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await updateScheduleEntryByDb({
      getDbPool,
      scheduleId: seeded.scheduleId,
      agreementTypeId: GRAZING_AGREEMENT_TYPE_ID,
      fields: { livestockCount: null },
    });
    await openPlanAndWait({ page, planId: seeded.planId });
    await submitPlan(page);
    await expectValidationMessage(page, /Livestock count is required/i);

    await updateScheduleEntryByDb({
      getDbPool,
      scheduleId: seeded.scheduleId,
      agreementTypeId: GRAZING_AGREEMENT_TYPE_ID,
      fields: { livestockCount: 1, dateIn: `${seeded.scheduleYear - 1}-05-01` },
    });
    await page.reload();
    await submitPlan(page);
    await expectValidationToast(page, SCHEDULE_ENTRY_DATE_OUT_OF_RANGE);

    await updateScheduleEntryByDb({
      getDbPool,
      scheduleId: seeded.scheduleId,
      agreementTypeId: GRAZING_AGREEMENT_TYPE_ID,
      fields: { dateIn: `${seeded.scheduleYear}-05-01`, livestockCount: 100000 },
    });
    await page.reload();
    await submitPlan(page);
    await expectValidationToast(page, TOTAL_AUMS_EXCEEDS);
  });

  test('covers hay-cutting schedule required fields, year rules, and tonne limits', async ({ page }) => {
    const seeded = await seedPlan('hay-cutting-schedule-validation', HAY_CUTTING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });
    await clearFirstHayCuttingTonnes(page);
    await submitPlan(page);
    await expectValidationMessage(page, /Tonnes is required/i);
    await page.locator('input[name$=".tonnes"]').first().fill('1');

    await updateScheduleEntryByDb({
      getDbPool,
      scheduleId: seeded.scheduleId,
      agreementTypeId: HAY_CUTTING_AGREEMENT_TYPE_ID,
      fields: { tonnes: 1, dateIn: `${seeded.scheduleYear - 1}-05-01` },
    });
    await page.reload();
    await submitPlan(page);
    await expectValidationToast(page, SCHEDULE_ENTRY_DATE_OUT_OF_RANGE);

    await updateScheduleEntryByDb({
      getDbPool,
      scheduleId: seeded.scheduleId,
      agreementTypeId: HAY_CUTTING_AGREEMENT_TYPE_ID,
      fields: { dateIn: `${seeded.scheduleYear}-05-01`, tonnes: 100000 },
    });
    await page.reload();
    await submitPlan(page);
    await expectValidationToast(page, TOTAL_TONNES_EXCEEDS);
  });

  test('blocks an incomplete additional requirement', async ({ page }) => {
    const seeded = await seedPlan('additional-requirement-validation', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await openPlanAndWait({ page, planId: seeded.planId });

    await addBlankAdditionalRequirement(page);
    await submitPlan(page);
    await expectValidationMessage(page, /Please choose a category/i);
  });

  test('blocks an incomplete management consideration', async ({ page }) => {
    const seeded = await seedPlan('management-consideration-validation', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await updatePlanStatusViaDb({
      getDbPool,
      planId: seeded.planId,
      toStatusCode: 'D',
      note: 'E2E management consideration validation',
      userId: cachedUserId!,
      logE2E,
    });
    await setUserRoleById({ userId: cachedUserId!, roleId: 4 });
    await page.goto('/');
    await page.evaluate(() => {
      const current = JSON.parse(localStorage.getItem('range-web-user') || '{}');
      localStorage.setItem('range-web-user', JSON.stringify({ ...current, roleId: 4 }));
    });
    await page.reload();
    await openPlanAndWait({ page, planId: seeded.planId });

    await addBlankManagementConsideration(page);
    await submitPlan(page);
    await expectValidationMessage(page, /Required field/i);
  });

  test('requires a map attachment before staff submission', async ({ page }) => {
    const seeded = await seedPlan('missing-map-attachment', GRAZING_AGREEMENT_TYPE_ID);
    seededAgreements.push(seeded.agreementId);
    await deleteMapAttachmentsByDb({ getDbPool, planId: seeded.planId });
    await openPlanAndWait({ page, planId: seeded.planId });

    await submitPlan(page);
    await expectValidationToast(page, /Cannot submit a plan without a map attachment/i);
  });

  for (const [agreementTypeId, label] of [
    [GRAZING_AGREEMENT_TYPE_ID, 'grazing'],
    [HAY_CUTTING_AGREEMENT_TYPE_ID, 'hay-cutting'],
  ] as const) {
    test(`saves and reloads a valid ${label} plan`, async ({ page }) => {
      const seeded = await seedPlan(`${label}-happy-path`, agreementTypeId);
      seededAgreements.push(seeded.agreementId);
      await openPlanAndWait({ page, planId: seeded.planId });

      const rangeName = `E2E ${label} ${Date.now()}`;
      await page.locator('input[name="rangeName"]').fill(rangeName);
      await saveDraft(page);

      const persisted = await readPersistedPlanByDb({ getDbPool, planId: seeded.planId });
      expect(persisted.rangeName).toBe(rangeName);

      await page.reload();
      await expect(page.locator('input[name="rangeName"]')).toHaveValue(rangeName);
    });
  }
});
