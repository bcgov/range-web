import type { Page } from '@playwright/test';

const getActionDelayMs = (): number => {
  const configuredDelay = process.env.PLAYWRIGHT_ACTION_DELAY_MS;
  if (!configuredDelay) {
    return 0;
  }

  const delayMs = Number.parseInt(configuredDelay, 10);
  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new Error('PLAYWRIGHT_ACTION_DELAY_MS must be a non-negative number of milliseconds.');
  }

  return delayMs;
};

export const waitForUiAction = async (page: Page): Promise<void> => {
  const delayMs = getActionDelayMs();
  if (delayMs > 0) {
    await page.waitForTimeout(delayMs);
  }
};
