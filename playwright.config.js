const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { defineConfig } = require('@playwright/test');

const loadEnvFile = () => {
  const candidates = ['.env.playwright.local', '.env.playwright', '.env.cypress.local', '.env.cypress'];

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
  expect: {
    timeout: 15000,
  },
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  outputDir: 'playwright/artifacts',
});
