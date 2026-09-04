import { test, expect } from '@playwright/test';
import {
  createPlanSeedByDb as runtimeCreatePlanSeedByDb,
  cleanupSeedDataByAgreementIds as runtimeCleanupSeedDataByAgreementIds,
} from './support/dbRuntime';
import { openPlan } from './support/actionRuntime';
import {
  getDbPool,
  getSeedSourceAgreementId,
  getSingleUserRecordForDb,
  getSingleUserSsoCandidatesForDb,
  getTestDistrictCode,
} from './support/extensionRuntime';
import { GRAZING_CSV_HEADERS, exportScheduleCsv, expandSchedule, sortScheduleBy } from './support/scheduleCsvRuntime';

const E2E_PREFIX = 'E2E-AUTO';
const TEST_CASE = 'schedule-csv-export';

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
    sourceAgreementId: getSeedSourceAgreementId(),
  });

interface SeededSchedule {
  id: number;
  year: number;
  livestockCounts: number[];
}

/**
 * Replaces the cloned schedule's entries with a known set so the ordering
 * assertions below are deterministic. The counts are deliberately unsorted so
 * that insertion (id) order differs from every sorted order.
 */
const SEEDED_LIVESTOCK_COUNTS = [30, 10, 20];

const seedScheduleEntries = async (planId: string): Promise<SeededSchedule | null> => {
  const pool = getDbPool();

  try {
    const scheduleResult = await pool.query(
      'SELECT id, year FROM grazing_schedule WHERE plan_id = $1 ORDER BY id ASC LIMIT 1',
      [Number(planId)],
    );

    if (scheduleResult.rowCount === 0) {
      return null;
    }

    const scheduleId = Number(scheduleResult.rows[0].id);
    const year = Number(scheduleResult.rows[0].year);

    const pastureResult = await pool.query('SELECT id FROM pasture WHERE plan_id = $1 ORDER BY id ASC LIMIT 2', [
      Number(planId),
    ]);

    if (pastureResult.rowCount === 0) {
      return null;
    }

    const pastureIds = pastureResult.rows.map((row: { id: number }) => Number(row.id));
    const livestockResult = await pool.query('SELECT id FROM ref_livestock ORDER BY id ASC LIMIT 1');
    const livestockTypeId = Number(livestockResult.rows[0].id);

    await pool.query('DELETE FROM grazing_schedule_entry WHERE grazing_schedule_id = $1', [scheduleId]);

    for (let index = 0; index < SEEDED_LIVESTOCK_COUNTS.length; index += 1) {
      await pool.query(
        `INSERT INTO grazing_schedule_entry
           (grazing_schedule_id, pasture_id, livestock_type_id, livestock_count,
            date_in, date_out, grace_days, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())`,
        [
          scheduleId,
          pastureIds[index % pastureIds.length],
          livestockTypeId,
          SEEDED_LIVESTOCK_COUNTS[index],
          `${year}-05-0${index + 1}`,
          `${year}-05-1${index + 1}`,
          index,
        ],
      );
    }

    await pool.query('UPDATE grazing_schedule_entry SET canonical_id = id WHERE grazing_schedule_id = $1', [
      scheduleId,
    ]);

    return { id: scheduleId, year, livestockCounts: [...SEEDED_LIVESTOCK_COUNTS] };
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

test.describe('Schedule CSV export', () => {
  let seeded: { planId: string; agreementId: string; clientNumber: string };
  let schedule: SeededSchedule | null;

  test.beforeAll(async () => {
    seeded = await seedPlan();
    schedule = await seedScheduleEntries(seeded.planId);
    logE2E(`[SEED] plan=${seeded.planId} agreement=${seeded.agreementId} schedule=${schedule?.id ?? 'none'}`);
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
    test.skip(!schedule, 'Seed source agreement has no grazing schedule to export.');

    // Authentication comes from the shared storageState created in global-setup.
    await resetScheduleSort(schedule!.id);
    await openPlan({ page, planId: seeded.planId });
  });

  test('downloads a CSV named after the agreement and schedule year', async ({ page }) => {
    const year = schedule!.year;

    await expandSchedule({ page, year });
    await page.getByTestId(`schedule-menu-button-${year}`).click();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByTestId(`export-csv-button-${year}`).click(),
    ]);

    expect(download.suggestedFilename()).toBe(`${seeded.agreementId}_${year}_schedule.csv`);
  });

  test('exports the schedule column headers and one row per entry', async ({ page }) => {
    const rows = await exportScheduleCsv({ page, year: schedule!.year });

    expect(rows[0]).toEqual(GRAZING_CSV_HEADERS);
    expect(rows).toHaveLength(schedule!.livestockCounts.length + 1);

    for (const row of rows.slice(1)) {
      expect(row[0]).toBe(seeded.agreementId);
      expect(row[1]).toBe(String(schedule!.year));
    }
  });

  test('preserves the order of schedule entries', async ({ page }) => {
    const rows = await exportScheduleCsv({ page, year: schedule!.year });
    const exportedCounts = rows.slice(1).map((row) => Number(row[4]));

    expect(exportedCounts).toEqual(schedule!.livestockCounts);
  });

  const sortableColumns = [
    { label: 'Pasture', index: 2, type: 'string' },
    { label: 'Livestock Type', index: 3, type: 'string' },
    { label: '# of Animals', index: 4, type: 'number' },
    { label: 'Date in', index: 5, type: 'date' },
    { label: 'Date out', index: 6, type: 'date' },
    { label: 'Days', index: 7, type: 'number' },
    { label: 'Grace Days', index: 8, type: 'number' },
    { label: 'PLD', index: 9, type: 'number' },
    { label: 'Crown AUMs', index: 10, type: 'number' },
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
        await resetScheduleSort(schedule!.id);
        await openPlan({ page, planId: seeded.planId });

        const defaultRows = (await exportScheduleCsv({ page, year: schedule!.year })).slice(1);
        expect(defaultRows.map((row) => Number(row[4]))).toEqual(schedule!.livestockCounts);

        await openPlan({ page, planId: seeded.planId });
        await expandSchedule({ page, year: schedule!.year });
        await sortScheduleBy({ page, label: column.label, direction });

        const exportedRows = (await exportScheduleCsv({ page, year: schedule!.year })).slice(1);
        expect(exportedRows).toEqual(sortRows(defaultRows, column.index, column.type, direction));
      });
    }
  }
});
