import { Pool } from 'pg';
import {
  getSingleUserRecordForDb as runtimeGetSingleUserRecordForDb,
  setUserRoleById as runtimeSetUserRoleById,
} from './dbRuntime';

export type ExtensionRoleCode = 'SA' | 'DM' | 'AH';

export const extensionRoleByCode: Record<ExtensionRoleCode, number> = {
  DM: 2,
  SA: 3,
  AH: 4,
};

export const getPrefixedEnv = (suffix: string, required = true): string => {
  const value = process.env[`PLAYWRIGHT_${suffix}`] || process.env[`CYPRESS_${suffix}`];
  if (required && !value) {
    throw new Error(`Missing required env var: PLAYWRIGHT_${suffix} (or CYPRESS_${suffix})`);
  }
  return value || '';
};

export const getApiBaseUrl = (): string => getPrefixedEnv('API_BASE_URL') || 'http://localhost:8000/api';

export const getDbPool = (): Pool => {
  return new Pool({
    host: getPrefixedEnv('DB_HOST'),
    port: Number(getPrefixedEnv('DB_PORT')),
    database: getPrefixedEnv('DB_NAME'),
    user: getPrefixedEnv('DB_USER'),
    password: getPrefixedEnv('DB_PASSWORD'),
    ssl: getPrefixedEnv('DB_SSL', false) === 'true' ? { rejectUnauthorized: false } : false,
  });
};

const uniqueNonEmpty = (values: string[]): string[] => {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
};

const expandSsoCandidates = ({
  username,
  preferredPrefix,
}: {
  username: string;
  preferredPrefix?: 'idir' | 'bceid';
}): string[] => {
  const trimmed = username.trim();
  if (!trimmed) {
    return [];
  }

  const candidates = [trimmed, trimmed.toLowerCase()];
  if (trimmed.includes('\\')) {
    const account = trimmed.split('\\').pop() || '';
    if (account) {
      candidates.push(account, account.toLowerCase(), `idir\\${account}`, `idir\\${account.toLowerCase()}`);
      candidates.push(`bceid\\${account}`, `bceid\\${account.toLowerCase()}`);
    }
  } else {
    candidates.push(`idir\\${trimmed}`, `idir\\${trimmed.toLowerCase()}`);
    candidates.push(`bceid\\${trimmed}`, `bceid\\${trimmed.toLowerCase()}`);
  }

  if (preferredPrefix) {
    candidates.push(`${preferredPrefix}\\${trimmed}`, `${preferredPrefix}\\${trimmed.toLowerCase()}`);
  }

  return uniqueNonEmpty(candidates);
};

export const getSingleUserUsername = (): string => {
  return (
    getPrefixedEnv('E2E_USERNAME', false) || getPrefixedEnv('STAFF_USERNAME', false) || getPrefixedEnv('AH_USERNAME')
  );
};

export const getSingleUserPassword = (): string => {
  return (
    getPrefixedEnv('E2E_PASSWORD', false) || getPrefixedEnv('STAFF_PASSWORD', false) || getPrefixedEnv('AH_PASSWORD')
  );
};

export const getSingleUserLoginMode = (): 'staff' | 'bceid' => {
  const configuredMode = getPrefixedEnv('E2E_LOGIN_MODE', false).trim().toLowerCase();
  if (configuredMode === 'staff') {
    return 'staff';
  }
  if (configuredMode === 'bceid' || configuredMode === 'ah') {
    return 'bceid';
  }

  const explicitSsoId = getPrefixedEnv('E2E_SSO_ID', false).toLowerCase();
  if (explicitSsoId.startsWith('bceid\\')) {
    return 'bceid';
  }
  if (explicitSsoId.startsWith('idir\\')) {
    return 'staff';
  }

  const username = getSingleUserUsername().toLowerCase();
  return username.startsWith('bceid') || username.includes('bceid\\') ? 'bceid' : 'staff';
};

export const getSingleUserSsoCandidatesForDb = (): string[] => {
  const explicitSsoId = getPrefixedEnv('E2E_SSO_ID', false);
  if (explicitSsoId) {
    return expandSsoCandidates({ username: explicitSsoId });
  }

  return expandSsoCandidates({ username: getSingleUserUsername() });
};

export const isSingleUserMode = (): boolean => {
  if (getPrefixedEnv('E2E_USERNAME', false) || getPrefixedEnv('E2E_SSO_ID', false)) {
    return true;
  }

  const staffUsername = getPrefixedEnv('STAFF_USERNAME', false).trim().toLowerCase();
  const ahUsername = getPrefixedEnv('AH_USERNAME', false).trim().toLowerCase();
  return Boolean(staffUsername && ahUsername && staffUsername === ahUsername);
};

export const getSingleUserRecordForDb = async () => {
  return runtimeGetSingleUserRecordForDb({ getDbPool, candidates: getSingleUserSsoCandidatesForDb() });
};

export const setUserRoleById = async ({ userId, roleId }: { userId: number; roleId: number }) => {
  await runtimeSetUserRoleById({ getDbPool, userId, roleId });
};

export const getTestDistrictCode = (): string => getPrefixedEnv('TEST_DISTRICT_CODE', false) || 'TST';
export const getSeedSourceAgreementId = (): string => getPrefixedEnv('SEED_SOURCE_AGREEMENT_ID', false) || 'RAN099915';
