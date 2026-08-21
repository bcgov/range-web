const fs = require('fs');
const path = require('path');
const os = require('os');
const dotenv = require('dotenv');
const { defineConfig } = require('@playwright/test');

const getStorageStatePath = () =>
  process.env.PLAYWRIGHT_STORAGE_STATE || path.join(os.tmpdir(), 'range-web-e2e-state.json');

const loadEnvFile = () => {
  const candidates = ['.env.playwright.local', '.env.playwright', '.env.cypress.local', '.env.cypress', '.env'];

  candidates.forEach((fileName) => {
    const fullPath = path.resolve(__dirname, fileName);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath, override: false });
    }
  });
};

loadEnvFile();

module.exports = defineConfig({
  testDir: './playwright/e2e',
  timeout: 120000,
  globalSetup: './playwright/e2e/global-setup.ts',
  expect: {
    timeout: 15000,
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: process.env.PLAYWRIGHT_REPORT_DIR || 'playwright-report' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: getStorageStatePath(),
    ...(process.env.PLAYWRIGHT_NO_SANDBOX === '1' ? { chromiumSandbox: false } : {}),
  },
  outputDir: process.env.PLAYWRIGHT_ARTIFACTS_DIR || 'playwright/artifacts',
});
