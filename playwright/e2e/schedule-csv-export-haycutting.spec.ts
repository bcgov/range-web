import { test, expect } from '@playwright/test';
import {
  createPlanSeedByDb as runtimeCreatePlanSeedByDb,
  cleanupSeedDataByAgreementIds as runtimeCleanupSeedDataByAgreementIds,
} from './support/dbRuntime';
import { openPlan } from './support/actionRuntime';
import {
  getDbPool,
  getSingleUserRecordForDb,
  getSingleUserSsoCandidatesForDb,
  getTestDistrictCode,
} from './support/extensionRuntime';
import {
  HAY_CUTTING_CSV_HEADERS,
  exportScheduleCsv,
  expandSchedule,
  sortScheduleBy,
} from './support/scheduleCsvRuntime';

const E2E_PREFIX = 'E2E-AUTO';
const TEST_CASE = 'schedule-csv-export-haycutting';

/** Haycutting Licence. Drives the hay cutting schedule UI and CSV column set. */
const HAY_CUTTING_AGREEMENT_TYPE_ID = 3;

/**
 * The source plan is only used as a structural template. The new agreement's
 * type is overridden to hay cutting below, and this spec creates its own
 * pastures, schedule, and entries. Keep the default on the shared source used
 * by the other OpenShift specs; RAN099935 is a local-only fixture and is not
 * present in refreshed dev databases. Environments that provision it can
 * still opt in explicitly.
 */
const HAY_CUTTING_SOURCE_AGREEMENT_ID =
  process.env.PLAYWRIGHT_HAYCUTTING_SEED_AGREEMENT_ID || process.env.PLAYWRIGHT_SEED_SOURCE_AGREEMENT_ID || 'RAN099915';

/**
 * Deliberately unsorted so insertion (id) order differs from every sorted
 * order — otherwise the ordering assertions would pass trivially.
 */
const SEEDED_ENTRIES = [
  { tonnes: 30, stubbleHeight: 15, area: 'Hay Field B' },
  { tonnes: 10, stubbleHeight: 5, area: 'Hay Field A' },
  { tonnes: 20, stubbleHeight: 10, area: 'Hay Field A' },
];

const logE2E = (message: string) => {
  console.log(`[E2E] ${message}`);
};

let cachedUserId: number | null = null;

const getCurrentUserId = async (): Promise<number> => {
  if (cachedUserId === null) {
    const record = await getSingleUserRecordForDb();
    cachedUserId = Number(record.id);
  }
  return cachedUserId;
};

const seedPlan = async () =>
  runtimeCreatePlanSeedByDb({
    getDbPool,
    testCase: TEST_CASE,
    e2ePrefix: E2E_PREFIX,
    singleUserSsoCandidates: getSingleUserSsoCandidatesForDb(),
    singleUserId: await getCurrentUserId(),
    districtCode: getTestDistrictCode(),
    sourceAgreementId: HAY_CUTTING_SOURCE_AGREEMENT_ID,
    agreementTypeId: HAY_CUTTING_AGREEMENT_TYPE_ID,
    copySchedules: false,
  });

interface SeededHayCuttingSchedule {
  id: number;
  year: number;
  tonnes: number[];
  areas: string[];
}

/**
 * The hay cutting source plan carries no pastures or schedule of its own, so
 * the whole structure is created here. This keeps the assertions deterministic
 * regardless of what the source plan happens to contain.
 */
const seedHayCuttingSchedule = async (planId: string): Promise<SeededHayCuttingSchedule> => {
  const pool = getDbPool();
  const year = new Date().getFullYear();

  try {
    const scheduleResult = await pool.query(
      `INSERT INTO grazing_schedule (plan_id, year, narative, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now())
       RETURNING id`,
      [Number(planId), year, `${E2E_PREFIX} hay cutting schedule`],
    );
    const scheduleId = Number(scheduleResult.rows[0].id);
    await pool.query('UPDATE grazing_schedule SET canonical_id = id WHERE id = $1', [scheduleId]);

    const pastureIdsByName = new Map<string, number>();
    for (const area of new Set(SEEDED_ENTRIES.map((entry) => entry.area))) {
      const pastureResult = await pool.query(
        `INSERT INTO pasture (plan_id, name, allowable_aum, grace_days, pld_percent, created_at, updated_at)
         VALUES ($1, $2, 100, 10, 0.5, now(), now())
         RETURNING id`,
        [Number(planId), area],
      );
      const pastureId = Number(pastureResult.rows[0].id);
      await pool.query('UPDATE pasture SET canonical_id = id WHERE id = $1', [pastureId]);
      pastureIdsByName.set(area, pastureId);
    }

    for (let index = 0; index < SEEDED_ENTRIES.length; index += 1) {
      const entry = SEEDED_ENTRIES[index];
      await pool.query(
        `INSERT INTO haycutting_schedule_entry
           (haycutting_schedule_id, pasture_id, stubble_height, tonnes,
            date_in, date_out, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, now(), now())`,
        [
          scheduleId,
          pastureIdsByName.get(entry.area),
          entry.stubbleHeight,
          entry.tonnes,
          `${year}-05-0${index + 1}`,
          `${year}-05-1${index + 1}`,
        ],
      );
    }

    await pool.query('UPDATE haycutting_schedule_entry SET canonical_id = id WHERE haycutting_schedule_id = $1', [
      scheduleId,
    ]);

    return {
      id: scheduleId,
      year,
      tonnes: SEEDED_ENTRIES.map((entry) => entry.tonnes),
      areas: SEEDED_ENTRIES.map((entry) => entry.area),
    };
  } finally {
    await pool.end();
  }
};

/** Clears any persisted sort so each test starts from the seeded entry order. */
const resetScheduleSort = async (scheduleId: number): Promise<void> => {
  const pool = getDbPool();

  try {
    await pool.query('UPDATE grazing_schedule SET sort_by = NULL, sort_order = NULL WHERE id = $1', [scheduleId]);
  } finally {
    await pool.end();
  }
};

const TONNES_COLUMN = 6;

test.describe('Hay cutting schedule CSV export', () => {
  let seeded: { planId: string; agreementId: string; clientNumber: string };
  let schedule: SeededHayCuttingSchedule;

  test.beforeAll(async () => {
    seeded = await seedPlan();
    schedule = await seedHayCuttingSchedule(seeded.planId);
    logE2E(`[SEED] hay cutting plan=${seeded.planId} agreement=${seeded.agreementId} schedule=${schedule.id}`);
  });

  test.afterAll(async () => {
    if (seeded?.agreementId) {
      await runtimeCleanupSeedDataByAgreementIds({
        getDbPool,
        agreementIds: [seeded.agreementId],
        logE2E,
      });
    }
  });

  test.beforeEach(async ({ page }) => {
    // Authentication comes from the shared storageState created in global-setup.
    await resetScheduleSort(schedule.id);
    await openPlan({ page, planId: seeded.planId });
  });

  test('downloads a CSV named after the agreement and schedule year', async ({ page }) => {
    const { year } = schedule;

    await expandSchedule({ page, year });
    await page.getByTestId(`schedule-menu-button-${year}`).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId(`export-csv-button-${year}`).click(),
    ]);

    expect(download.suggestedFilename()).toBe(`${seeded.agreementId}_${year}_schedule.csv`);
  });

  test('exports the hay cutting column headers rather than the grazing ones', async ({ page }) => {
    const rows = await exportScheduleCsv({ page, year: schedule.year });

    expect(rows[0]).toEqual(HAY_CUTTING_CSV_HEADERS);
    expect(rows).toHaveLength(SEEDED_ENTRIES.length + 1);

    for (const row of rows.slice(1)) {
      expect(row[0]).toBe(seeded.agreementId);
      expect(row[1]).toBe(String(schedule.year));
    }
  });

  test('exports the seeded hay cutting entry values', async ({ page }) => {
    const rows = await exportScheduleCsv({ page, year: schedule.year });

    expect(rows[1]).toEqual([
      seeded.agreementId,
      String(schedule.year),
      SEEDED_ENTRIES[0].area,
      String(SEEDED_ENTRIES[0].stubbleHeight),
      `${schedule.year}-05-01`,
      `${schedule.year}-05-11`,
      String(SEEDED_ENTRIES[0].tonnes),
    ]);
  });

  test('preserves the order of hay cutting schedule entries', async ({ page }) => {
    const rows = await exportScheduleCsv({ page, year: schedule.year });
    const exportedTonnes = rows.slice(1).map((row) => Number(row[TONNES_COLUMN]));

    expect(exportedTonnes).toEqual(schedule.tonnes);
  });

  const sortableColumns = [
    { label: 'Area', index: 2, type: 'string' },
    { label: 'Stubble Height (cm)', index: 3, type: 'number' },
    { label: 'Period Start', index: 4, type: 'date' },
    { label: 'Period End', index: 5, type: 'date' },
    { label: 'Tonnes', index: 6, type: 'number' },
  ] as const;

  const sortRows = (
    rows: string[][],
    index: number,
    type: (typeof sortableColumns)[number]['type'],
    direction: 'asc' | 'desc',
  ) =>
    rows
      .map((row, originalIndex) => ({ row, originalIndex }))
      .sort((a, b) => {
        const left =
          type === 'number' ? Number(a.row[index]) : type === 'date' ? Date.parse(a.row[index]) : a.row[index];
        const right =
          type === 'number' ? Number(b.row[index]) : type === 'date' ? Date.parse(b.row[index]) : b.row[index];
        const comparison = left < right ? -1 : left > right ? 1 : 0;
        return comparison === 0 ? a.originalIndex - b.originalIndex : direction === 'asc' ? comparison : -comparison;
      })
      .map(({ row }) => row);

  for (const column of sortableColumns) {
    for (const direction of ['asc', 'desc'] as const) {
      test(`exports ${column.label} ${direction} sort order`, async ({ page }) => {
        await resetScheduleSort(schedule.id);
        await openPlan({ page, planId: seeded.planId });

        const defaultRows = (await exportScheduleCsv({ page, year: schedule.year })).slice(1);
        expect(defaultRows.map((row) => Number(row[TONNES_COLUMN]))).toEqual(schedule.tonnes);

        await openPlan({ page, planId: seeded.planId });
        await expandSchedule({ page, year: schedule.year });
        await sortScheduleBy({ page, label: column.label, direction });

        const exportedRows = (await exportScheduleCsv({ page, year: schedule.year })).slice(1);
        expect(exportedRows).toEqual(sortRows(defaultRows, column.index, column.type, direction));
      });
    }
  }
});
