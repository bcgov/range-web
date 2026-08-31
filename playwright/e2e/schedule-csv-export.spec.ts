import { test, expect, type Page } from '@playwright/test';
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

const E2E_PREFIX = 'E2E-AUTO';
const TEST_CASE = 'schedule-csv-export';

const GRAZING_CSV_HEADERS = [
  'RAN',
  'Year',
  'Pasture',
  'Livestock Type',
  'Number of Animals',
  'Date In',
  'Date Out',
  'Days',
  'Grace Days',
  'PLD AUMs',
  'Crown AUMs',
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

/**
 * Minimal RFC-4180 parser — enough for the values this export emits (quoted
 * fields containing commas, e.g. pasture names).
 */
const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char !== '\r') {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

const expandSchedule = async ({ page, year }: { page: Page; year: number }) => {
  const menuButton = page.getByTestId(`schedule-menu-button-${year}`);

  if (!(await menuButton.isVisible().catch(() => false))) {
    // The action menu is only rendered for the expanded schedule box.
    await page.getByText(`${year} Schedule`).first().click();
  }

  await expect(menuButton).toBeVisible();
};

const exportScheduleCsv = async ({ page, year }: { page: Page; year: number }): Promise<string[][]> => {
  await expandSchedule({ page, year });
  await page.getByTestId(`schedule-menu-button-${year}`).click();

  const exportItem = page.getByTestId(`export-csv-button-${year}`);
  await expect(exportItem).toBeVisible();

  const [download] = await Promise.all([page.waitForEvent('download'), exportItem.click()]);

  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return parseCsv(Buffer.concat(chunks).toString('utf-8'));
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

  test('reflects a re-sorted table in the exported row order', async ({ page }) => {
    const year = schedule!.year;
    await expandSchedule({ page, year });

    // Sorting the table persists sortBy/sortOrder, which the export must honour.
    await page.getByText('# of Animals', { exact: false }).first().click();
    await page.waitForResponse(
      (response) => response.url().includes('/sortOrder') && response.request().method() === 'PUT',
    );

    const rows = await exportScheduleCsv({ page, year });
    const exportedCounts = rows.slice(1).map((row) => Number(row[4]));

    expect(exportedCounts).toEqual([...schedule!.livestockCounts].sort((a, b) => a - b));
  });
});
