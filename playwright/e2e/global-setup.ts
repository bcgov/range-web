import os from 'os';
import path from 'path';
import { chromium, type FullConfig } from '@playwright/test';
import { loginThroughPopup } from './support/authRuntime';

const getStorageStatePath = (): string =>
  process.env.PLAYWRIGHT_STORAGE_STATE || path.join(os.tmpdir(), 'range-web-e2e-state.json');

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL;
  const username = getRequiredEnv('PLAYWRIGHT_E2E_USERNAME');
  const password = getRequiredEnv('PLAYWRIGHT_E2E_PASSWORD');
  const loginMode = getRequiredEnv('PLAYWRIGHT_E2E_LOGIN_MODE');

  const browser = await chromium.launch({
    headless: true,
    chromiumSandbox: process.env.PLAYWRIGHT_NO_SANDBOX === '1' ? false : true,
  });
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  const logE2E = (message: string) => console.log(`[global-setup] ${message}`);
  const authData = await loginThroughPopup({
    page,
    roleCode: 'SA',
    username,
    password,
    loginMode: loginMode === 'staff' ? 'staff' : 'bceid',
    logE2E,
  });

  const storageStatePath = getStorageStatePath();
  await context.storageState({ path: storageStatePath });
  await browser.close();
  logE2E(`saved storage state to ${storageStatePath} (token=${authData.access_token.slice(0, 12)}...)`);
}
