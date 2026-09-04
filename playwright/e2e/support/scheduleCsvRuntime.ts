import { expect, type Page } from '@playwright/test';

export const GRAZING_CSV_HEADERS = [
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

export const HAY_CUTTING_CSV_HEADERS = [
  'RAN',
  'Year',
  'Area',
  'Average Height (cm)',
  'Period Start',
  'Period End',
  'Tonnes',
];

/**
 * Minimal RFC-4180 parser — enough for the values this export emits (quoted
 * fields containing commas, e.g. pasture names).
 */
export const parseCsv = (text: string): string[][] => {
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

export const expandSchedule = async ({ page, year }: { page: Page; year: number }) => {
  const menuButton = page.getByTestId(`schedule-menu-button-${year}`);

  if (!(await menuButton.isVisible().catch(() => false))) {
    // The action menu is only rendered for the expanded schedule box.
    await page.getByText(`${year} Schedule`).first().click();
  }

  await expect(menuButton).toBeVisible();
};

export const downloadScheduleCsv = async ({ page, year }: { page: Page; year: number }) => {
  await expandSchedule({ page, year });
  await page.getByTestId(`schedule-menu-button-${year}`).click();

  const exportItem = page.getByTestId(`export-csv-button-${year}`);
  await expect(exportItem).toBeVisible();

  const [download] = await Promise.all([page.waitForEvent('download'), exportItem.click()]);

  return download;
};

export const exportScheduleCsv = async ({ page, year }: { page: Page; year: number }): Promise<string[][]> => {
  const download = await downloadScheduleCsv({ page, year });

  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return parseCsv(Buffer.concat(chunks).toString('utf-8'));
};

/**
 * Sorts the schedule table by a column header and waits for the sort to persist.
 *
 * Scoped to the table header specifically — labels like "Area" and "Tonnes"
 * also appear in page headings and usage tables, so a plain text lookup picks
 * the wrong element.
 */
export const sortScheduleBy = async ({
  page,
  label,
  direction = 'asc',
}: {
  page: Page;
  label: string;
  direction?: 'asc' | 'desc';
}) => {
  const header = page.getByRole('columnheader', { name: label, exact: true }).first();
  await expect(header).toBeVisible();

  const ascendingSort = page.waitForResponse(
    (response) => response.url().includes('/sortOrder') && response.request().method() === 'PUT',
  );
  await header.locator('.MuiTableSortLabel-root').first().click();
  await ascendingSort;

  if (direction === 'desc') {
    const descendingSort = page.waitForResponse(
      (response) => response.url().includes('/sortOrder') && response.request().method() === 'PUT',
    );
    await header.locator('.MuiTableSortLabel-root').first().click();
    await descendingSort;
  }
};
