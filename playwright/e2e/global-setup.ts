import fs from 'fs';
import os from 'os';
import path from 'path';
import { chromium, type FullConfig } from '@playwright/test';
import { loginThroughPopup } from './support/authRuntime';

const getStorageStatePath = (): string =>
  process.env.PLAYWRIGHT_STORAGE_STATE || path.join(os.tmpdir(), 'range-web-e2e-state.json');

const getArtifactsDir = (): string => process.env.PLAYWRIGHT_ARTIFACTS_DIR || path.join('playwright', 'artifacts');

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

  const logE2E = (message: string) => console.log(`[global-setup] ${message}`);
  // Presence-only: proxy values may embed credentials, so never log them.
  const proxyEnv = ['HTTP_PROXY', 'HTTPS_PROXY', 'NO_PROXY', 'http_proxy', 'https_proxy', 'no_proxy']
    .map((name) => `${name}=${process.env[name] ? 'set' : 'unset'}`)
    .join(' ');
  logE2E(`proxy env: ${proxyEnv}`);

  const browser = await chromium.launch({
    headless: true,
    chromiumSandbox: process.env.PLAYWRIGHT_NO_SANDBOX === '1' ? false : true,
  });
  const context = await browser.newContext({ baseURL });
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();

  try {
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
    await context.tracing.stop();
    logE2E(`saved storage state to ${storageStatePath} (token=${authData.access_token.slice(0, 12)}...)`);
  } catch (error) {
    // Global setup runs outside the test runner, so its failures otherwise
    // leave no trace/screenshot behind. Persist both for the OpenShift
    // artifact sync before rethrowing.
    try {
      const artifactsDir = getArtifactsDir();
      fs.mkdirSync(artifactsDir, { recursive: true });
      await context.tracing.stop({ path: path.join(artifactsDir, 'global-setup-login-trace.zip') });
      const pages = context.pages();
      for (let index = 0; index < pages.length; index += 1) {
        try {
          await pages[index].screenshot({ path: path.join(artifactsDir, `global-setup-login-${index}.png`) });
        } catch {
          // best effort per page
        }
      }
      logE2E(`saved global-setup login failure artifacts to ${artifactsDir}`);
    } catch {
      // artifact capture must never mask the original login error
    }
    throw error;
  } finally {
    await browser.close();
  }
}
