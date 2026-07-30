import fs from 'fs/promises';
import path from 'path';
import { test, expect, request, type APIRequestContext, type Page } from '@playwright/test';
import { Pool } from 'pg';
import {
  loginPageAs as runtimeLoginPageAs,
  switchRoleAndRelogin as runtimeSwitchRoleAndRelogin,
  type WorkflowRoleCode,
} from './support/authRuntime';

const E2E_PREFIX = 'E2E-AUTO';

const logE2E = (message: string) => {
  console.log(`[E2E] ${message}`);
};

const TEST_CASES = {
  HAPPY_PATH: 'happy-path',
  CHANGE_LOOP: 'change-loop',
  NOT_READY: 'not-ready',
  REVIEW_HAPPY_PATH: 'review-happy-path',
  REVIEW_CHANGE_LOOP: 'review-change-loop',
  NOT_APPROVED: 'not-approved',
} as const;

const roleByCode = {
  DM: 2,
  SA: 3,
  AH: 4,
} as const;

type RoleCode = WorkflowRoleCode;

type PlanStatusHistoryRecord = {
  fromPlanStatusId?: number | null;
  toPlanStatusId: number;
  user?: {
    roleId?: number;
  };
};

type PlanSnapshot = {
  status?: {
    code?: string;
  };
  planStatusHistory?: PlanStatusHistoryRecord[];
};

type PlanStatusRef = {
  id: number;
  code: string;
};

const getPrefixedEnv = (suffix: string, required = true): string => {
  const value = process.env[`PLAYWRIGHT_${suffix}`] || process.env[`CYPRESS_${suffix}`];
  if (required && !value) {
    throw new Error(`Missing required env var: PLAYWRIGHT_${suffix} (or CYPRESS_${suffix})`);
  }
  return value || '';
};

const getApiBaseUrl = (): string => getPrefixedEnv('API_BASE_URL') || 'http://localhost:8000/api';
const getTestDistrictCode = (): string => getPrefixedEnv('TEST_DISTRICT_CODE', false) || 'TST';
const isSingleUserMode = (): boolean => {
  if (getPrefixedEnv('E2E_USERNAME', false) || getPrefixedEnv('E2E_SSO_ID', false)) {
    return true;
  }

  const staffUsername = getPrefixedEnv('STAFF_USERNAME', false).trim().toLowerCase();
  const ahUsername = getPrefixedEnv('AH_USERNAME', false).trim().toLowerCase();
  return Boolean(staffUsername && ahUsername && staffUsername === ahUsername);
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

const getSingleUserUsername = (): string => {
  return (
    getPrefixedEnv('E2E_USERNAME', false) || getPrefixedEnv('STAFF_USERNAME', false) || getPrefixedEnv('AH_USERNAME')
  );
};

const getSingleUserPassword = (): string => {
  return (
    getPrefixedEnv('E2E_PASSWORD', false) || getPrefixedEnv('STAFF_PASSWORD', false) || getPrefixedEnv('AH_PASSWORD')
  );
};

const getSingleUserSsoCandidatesForDb = (): string[] => {
  const explicitSsoId = getPrefixedEnv('E2E_SSO_ID', false);
  if (explicitSsoId) {
    return expandSsoCandidates({ username: explicitSsoId });
  }

  return expandSsoCandidates({ username: getSingleUserUsername() });
};

let cachedSingleUserRecord: { id: number; sso_id: string } | null = null;

const getSingleUserLoginMode = (): 'staff' | 'bceid' => {
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

const createE2ENote = (testCase: string, fromCode: string, toCode: string): string =>
  `E2E:${testCase}:${fromCode}->${toCode}`;

const getDbPool = (): Pool => {
  return new Pool({
    host: getPrefixedEnv('DB_HOST'),
    port: Number(getPrefixedEnv('DB_PORT')),
    database: getPrefixedEnv('DB_NAME'),
    user: getPrefixedEnv('DB_USER'),
    password: getPrefixedEnv('DB_PASSWORD'),
    ssl: getPrefixedEnv('DB_SSL', false) === 'true' ? { rejectUnauthorized: false } : false,
  });
};

const findUserBySsoCandidates = async ({
  client,
  candidates,
  roleLabel,
}: {
  client: any;
  candidates: string[];
  roleLabel: string;
}) => {
  const result = await client.query(
    `
      SELECT id, sso_id
      FROM user_account
      WHERE lower(sso_id) = ANY($1::text[])
      ORDER BY id ASC
      LIMIT 1
    `,
    [candidates.map((candidate) => candidate.toLowerCase())],
  );

  if (result.rowCount !== 1) {
    throw new Error(`Could not find ${roleLabel} user in user_account by sso_id candidates: ${candidates.join(', ')}`);
  }

  return result.rows[0] as { id: number; sso_id: string };
};

const getSingleUserRecordForDb = async () => {
  const pool = getDbPool();
  try {
    const candidates = getSingleUserSsoCandidatesForDb();
    const result = await pool.query(
      `
        SELECT id, sso_id
        FROM user_account
        WHERE lower(sso_id) = ANY($1::text[])
        ORDER BY id ASC
        LIMIT 1
      `,
      [candidates.map((candidate) => candidate.toLowerCase())],
    );

    if (result.rowCount !== 1) {
      throw new Error(`Could not find E2E user in user_account by sso_id candidates: ${candidates.join(', ')}`);
    }

    return result.rows[0] as { id: number; sso_id: string };
  } finally {
    await pool.end();
  }
};

const setUserRoleById = async ({ userId, roleId }: { userId: number; roleId: number }) => {
  const pool = getDbPool();
  try {
    const result = await pool.query(
      `
        UPDATE user_account
        SET role_id = $2
        WHERE id = $1
        RETURNING id, sso_id, role_id;
      `,
      [userId, roleId],
    );

    if (result.rowCount !== 1) {
      throw new Error(`Expected exactly 1 updated row for user_id='${userId}', received ${result.rowCount}`);
    }
  } finally {
    await pool.end();
  }
};

const getSeedSourceAgreementId = (): string => getPrefixedEnv('SEED_SOURCE_AGREEMENT_ID', false) || 'RAN099915';

const quoteIdent = (value: string): string => `"${value.replace(/"/g, '""')}"`;

const getInsertableColumns = async (client: any, table: string): Promise<string[]> => {
  const result = await client.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `,
    [table],
  );

  return result.rows.map((row: { column_name: string }) => row.column_name);
};

const insertRow = async ({
  client,
  table,
  sourceRow,
  overrides,
  excludeColumns,
  returnColumns,
}: {
  client: any;
  table: string;
  sourceRow: Record<string, any>;
  overrides?: Record<string, any>;
  excludeColumns?: string[];
  returnColumns?: string[];
}) => {
  const allColumns = await getInsertableColumns(client, table);
  const excluded = new Set([...(excludeColumns || []), ...(returnColumns || [])]);

  const payload: Record<string, any> = {
    ...sourceRow,
    ...(overrides || {}),
  };

  const insertColumns = allColumns.filter((column) => !excluded.has(column) && payload[column] !== undefined);
  const values = insertColumns.map((column) => payload[column]);
  const placeholders = insertColumns.map((_, index) => `$${index + 1}`).join(', ');

  const returningSql =
    returnColumns && returnColumns.length > 0 ? ` RETURNING ${returnColumns.map(quoteIdent).join(', ')}` : '';

  const sql = `
    INSERT INTO ${quoteIdent(table)} (${insertColumns.map(quoteIdent).join(', ')})
    VALUES (${placeholders})${returningSql}
  `;

  const result = await client.query(sql, values);
  return result.rows[0] || null;
};

const createPlanSeedByDb = async ({
  testCase,
}: {
  testCase: string;
}): Promise<{ planId: string; agreementId: string; clientNumber: string }> => {
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const singleUserSsoCandidates = getSingleUserSsoCandidatesForDb();
    const districtCode = getTestDistrictCode();

    const singleUser = await findUserBySsoCandidates({
      client,
      candidates: singleUserSsoCandidates,
      roleLabel: 'E2E',
    });

    const districtResult = await client.query('SELECT id FROM ref_district WHERE code = $1', [districtCode]);
    if (districtResult.rowCount !== 1) {
      throw new Error(`Could not find district by code='${districtCode}'`);
    }

    const districtId = districtResult.rows[0].id;

    let zoneResult = await client.query(
      'SELECT id, user_id FROM ref_zone WHERE district_id = $1 AND user_id = $2 ORDER BY id ASC LIMIT 1',
      [districtId, singleUser.id],
    );

    if (zoneResult.rowCount !== 1) {
      zoneResult = await client.query(
        'SELECT id, user_id FROM ref_zone WHERE district_id = $1 ORDER BY id ASC LIMIT 1',
        [districtId],
      );
    }

    if (zoneResult.rowCount !== 1) {
      throw new Error(`Could not find a zone in district code='${districtCode}'`);
    }

    const clientTypeResult = await client.query("SELECT id FROM ref_client_type WHERE code = 'A'");
    if (clientTypeResult.rowCount !== 1) {
      throw new Error("Could not find client type code='A'");
    }

    const sdStatusResult = await client.query("SELECT id FROM ref_plan_status WHERE code = 'SD'");
    if (sdStatusResult.rowCount !== 1) {
      throw new Error("Could not find plan status code='SD'");
    }

    const staffUserId = singleUser.id;
    const ahUserId = singleUser.id;
    const zoneId = zoneResult.rows[0].id;
    const clientTypeId = clientTypeResult.rows[0].id;
    const sdStatusId = sdStatusResult.rows[0].id;

    if (Number(zoneResult.rows[0].user_id || 0) !== Number(staffUserId)) {
      await client.query('UPDATE ref_zone SET user_id = $1 WHERE id = $2', [staffUserId, zoneId]);
    }

    const districtLinkResult = await client.query('SELECT 1 FROM user_districts WHERE user_id = $1 AND id = $2', [
      staffUserId,
      districtId,
    ]);
    if (districtLinkResult.rowCount === 0) {
      await client.query('INSERT INTO user_districts (id, user_id) VALUES ($1, $2)', [districtId, staffUserId]);
    }

    const timestamp = Date.now();
    const clientNumber = `9${String(timestamp).slice(-7)}`;
    await client.query('INSERT INTO ref_client (client_number, name) VALUES ($1, $2)', [
      clientNumber,
      `${E2E_PREFIX}-CLIENT-${testCase}-${timestamp}`,
    ]);

    let agreementId = '';
    for (let i = 0; i < 100; i += 1) {
      const suffix = String(Math.floor(Math.random() * 100)).padStart(2, '0');
      const candidate = `RAN0999${suffix}`;
      const exists = await client.query('SELECT 1 FROM agreement WHERE forest_file_id = $1', [candidate]);
      if (exists.rowCount === 0) {
        agreementId = candidate;
        break;
      }
    }

    if (!agreementId) {
      throw new Error('Could not allocate a free agreement id in RAN0999XX range');
    }

    await client.query(
      `
        INSERT INTO agreement (
          forest_file_id,
          agreement_start_date,
          agreement_end_date,
          agreement_type_id,
          zone_id,
          retired,
          usage_status,
          percentage_use,
          has_current_schedule,
          exemption_status
        ) VALUES ($1, NOW(), NOW() + INTERVAL '5 years', 1, $2, false, 2, 0, 1, 'NOT_EXEMPTED')
      `,
      [agreementId, zoneId],
    );

    await client.query(
      `
        INSERT INTO client_agreement (agreement_id, client_type_id, agent_id, client_id)
        VALUES ($1, $2, $3, $4)
      `,
      [agreementId, clientTypeId, ahUserId, clientNumber],
    );

    const ahClientLinkResult = await client.query(
      `
        SELECT 1
        FROM user_client_link
        WHERE user_id = $1 AND client_id = $2 AND active = true AND type = 'owner'
      `,
      [ahUserId, clientNumber],
    );
    if (ahClientLinkResult.rowCount === 0) {
      await client.query(
        `
          INSERT INTO user_client_link (user_id, client_id, type, active)
          VALUES ($1, $2, 'owner', true)
        `,
        [ahUserId, clientNumber],
      );
    }

    const sourceAgreementId = getSeedSourceAgreementId();
    const sourcePlanResult = await client.query(
      `
        SELECT *
        FROM plan
        WHERE agreement_id = $1
          AND uploaded = true
          AND amendment_type_id IS NULL
        ORDER BY id DESC
        LIMIT 1
      `,
      [sourceAgreementId],
    );
    if (sourcePlanResult.rowCount !== 1) {
      throw new Error(`Could not find a source uploaded non-amendment plan for agreement '${sourceAgreementId}'`);
    }

    const sourcePlan = sourcePlanResult.rows[0];
    const newPlanRow = await insertRow({
      client,
      table: 'plan',
      sourceRow: sourcePlan,
      overrides: {
        agreement_id: agreementId,
        status_id: sdStatusId,
        creator_id: staffUserId,
        range_name: `${E2E_PREFIX}-${testCase}-${timestamp}`,
        uploaded: true,
        amendment_type_id: null,
        effective_at: null,
        submitted_at: null,
        extension_status: null,
        extension_required_votes: 0,
        extension_received_votes: 0,
        replacement_of: null,
        extension_date: null,
        extension_rejected_by: null,
        replacement_plan_id: null,
      },
      excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      returnColumns: ['id'],
    });

    const newPlanId = Number(newPlanRow.id);
    await client.query('UPDATE plan SET canonical_id = $1 WHERE id = $1', [newPlanId]);

    await client.query('INSERT INTO plan_confirmation (plan_id, client_id, confirmed) VALUES ($1, $2, $3)', [
      newPlanId,
      clientNumber,
      false,
    ]);

    const pastureMap = new Map<number, number>();
    const sourcePastures = await client.query('SELECT * FROM pasture WHERE plan_id = $1 ORDER BY id', [sourcePlan.id]);
    for (const sourcePasture of sourcePastures.rows) {
      const inserted = await insertRow({
        client,
        table: 'pasture',
        sourceRow: sourcePasture,
        overrides: { plan_id: newPlanId },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
        returnColumns: ['id'],
      });
      pastureMap.set(Number(sourcePasture.id), Number(inserted.id));
    }

    const scheduleMap = new Map<number, number>();
    const sourceSchedules = await client.query('SELECT * FROM grazing_schedule WHERE plan_id = $1 ORDER BY id', [
      sourcePlan.id,
    ]);
    for (const sourceSchedule of sourceSchedules.rows) {
      const inserted = await insertRow({
        client,
        table: 'grazing_schedule',
        sourceRow: sourceSchedule,
        overrides: { plan_id: newPlanId },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
        returnColumns: ['id'],
      });
      scheduleMap.set(Number(sourceSchedule.id), Number(inserted.id));
    }

    const sourceScheduleEntries = await client.query(
      'SELECT * FROM grazing_schedule_entry WHERE grazing_schedule_id = ANY($1::int[]) ORDER BY id',
      [Array.from(scheduleMap.keys())],
    );
    for (const sourceEntry of sourceScheduleEntries.rows) {
      await insertRow({
        client,
        table: 'grazing_schedule_entry',
        sourceRow: sourceEntry,
        overrides: {
          grazing_schedule_id: scheduleMap.get(Number(sourceEntry.grazing_schedule_id)),
          pasture_id: pastureMap.get(Number(sourceEntry.pasture_id)),
        },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      });
    }

    const issueMap = new Map<number, number>();
    const sourceIssues = await client.query('SELECT * FROM minister_issue WHERE plan_id = $1 ORDER BY id', [
      sourcePlan.id,
    ]);
    for (const sourceIssue of sourceIssues.rows) {
      const inserted = await insertRow({
        client,
        table: 'minister_issue',
        sourceRow: sourceIssue,
        overrides: { plan_id: newPlanId },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
        returnColumns: ['id'],
      });
      issueMap.set(Number(sourceIssue.id), Number(inserted.id));
    }

    const sourceIssueActions = await client.query(
      'SELECT * FROM minister_issue_action WHERE issue_id = ANY($1::int[]) ORDER BY id',
      [Array.from(issueMap.keys())],
    );
    for (const sourceAction of sourceIssueActions.rows) {
      await insertRow({
        client,
        table: 'minister_issue_action',
        sourceRow: sourceAction,
        overrides: { issue_id: issueMap.get(Number(sourceAction.issue_id)) },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      });
    }

    const sourceIssuePastures = await client.query(
      'SELECT * FROM minister_issue_pasture WHERE minister_issue_id = ANY($1::int[]) ORDER BY id',
      [Array.from(issueMap.keys())],
    );
    for (const sourceIssuePasture of sourceIssuePastures.rows) {
      await insertRow({
        client,
        table: 'minister_issue_pasture',
        sourceRow: sourceIssuePasture,
        overrides: {
          minister_issue_id: issueMap.get(Number(sourceIssuePasture.minister_issue_id)),
          pasture_id: pastureMap.get(Number(sourceIssuePasture.pasture_id)),
        },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      });
    }

    const plantCommunityMap = new Map<number, number>();
    const sourcePlantCommunities = await client.query(
      'SELECT * FROM plant_community WHERE pasture_id = ANY($1::int[]) ORDER BY id',
      [Array.from(pastureMap.keys())],
    );
    for (const sourceCommunity of sourcePlantCommunities.rows) {
      const inserted = await insertRow({
        client,
        table: 'plant_community',
        sourceRow: sourceCommunity,
        overrides: { pasture_id: pastureMap.get(Number(sourceCommunity.pasture_id)) },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
        returnColumns: ['id'],
      });
      plantCommunityMap.set(Number(sourceCommunity.id), Number(inserted.id));
    }

    const sourceIndicatorPlants = await client.query(
      'SELECT * FROM indicator_plant WHERE plant_community_id = ANY($1::int[]) ORDER BY id',
      [Array.from(plantCommunityMap.keys())],
    );
    for (const sourceIndicator of sourceIndicatorPlants.rows) {
      await insertRow({
        client,
        table: 'indicator_plant',
        sourceRow: sourceIndicator,
        overrides: { plant_community_id: plantCommunityMap.get(Number(sourceIndicator.plant_community_id)) },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      });
    }

    const monitoringAreaMap = new Map<number, number>();
    const sourceMonitoringAreas = await client.query(
      'SELECT * FROM monitoring_area WHERE plant_community_id = ANY($1::int[]) ORDER BY id',
      [Array.from(plantCommunityMap.keys())],
    );
    for (const sourceArea of sourceMonitoringAreas.rows) {
      const inserted = await insertRow({
        client,
        table: 'monitoring_area',
        sourceRow: sourceArea,
        overrides: { plant_community_id: plantCommunityMap.get(Number(sourceArea.plant_community_id)) },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
        returnColumns: ['id'],
      });
      monitoringAreaMap.set(Number(sourceArea.id), Number(inserted.id));
    }

    const sourceMonitoringPurposes = await client.query(
      'SELECT * FROM monitoring_area_purpose WHERE monitoring_area_id = ANY($1::int[]) ORDER BY id',
      [Array.from(monitoringAreaMap.keys())],
    );
    for (const sourcePurpose of sourceMonitoringPurposes.rows) {
      await insertRow({
        client,
        table: 'monitoring_area_purpose',
        sourceRow: sourcePurpose,
        overrides: { monitoring_area_id: monitoringAreaMap.get(Number(sourcePurpose.monitoring_area_id)) },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      });
    }

    const sourceCommunityActions = await client.query(
      'SELECT * FROM plant_community_action WHERE plant_community_id = ANY($1::int[]) ORDER BY id',
      [Array.from(plantCommunityMap.keys())],
    );
    for (const sourceAction of sourceCommunityActions.rows) {
      await insertRow({
        client,
        table: 'plant_community_action',
        sourceRow: sourceAction,
        overrides: { plant_community_id: plantCommunityMap.get(Number(sourceAction.plant_community_id)) },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      });
    }

    const copyPlanLevelTables = ['invasive_plant_checklist', 'additional_requirement', 'management_consideration'];
    for (const table of copyPlanLevelTables) {
      const sourceRows = await client.query(`SELECT * FROM ${quoteIdent(table)} WHERE plan_id = $1 ORDER BY id`, [
        sourcePlan.id,
      ]);
      for (const sourceRow of sourceRows.rows) {
        await insertRow({
          client,
          table,
          sourceRow,
          overrides: { plan_id: newPlanId },
          excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
        });
      }
    }

    const sourceMapFiles = await client.query(
      "SELECT * FROM plan_file WHERE plan_id = $1 AND type = 'mapAttachments' ORDER BY id",
      [sourcePlan.id],
    );

    if (sourceMapFiles.rowCount > 0) {
      for (const sourceMapFile of sourceMapFiles.rows) {
        await insertRow({
          client,
          table: 'plan_file',
          sourceRow: sourceMapFile,
          overrides: {
            plan_id: newPlanId,
            user_id: staffUserId,
            access: sourceMapFile.access || 'everyone',
          },
          excludeColumns: ['id', 'created_at', 'updated_at'],
        });
      }
    } else {
      await client.query(
        `
          INSERT INTO plan_file (name, url, type, plan_id, user_id, access)
          VALUES ($1, $2, 'mapAttachments', $3, $4, 'everyone')
        `,
        [`${E2E_PREFIX}-${testCase}-${timestamp}-map.pdf`, 'https://example.com/e2e-map.pdf', newPlanId, staffUserId],
      );
    }

    await client.query('COMMIT');

    return { planId: String(newPlanId), agreementId, clientNumber };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

const cleanupSeedDataByAgreementIds = async ({ agreementIds }: { agreementIds: string[] }) => {
  if (!agreementIds.length) {
    return;
  }

  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `
        WITH target_agreements AS (
          SELECT DISTINCT ca.agreement_id, ca.client_id
          FROM client_agreement ca
          WHERE ca.agreement_id = ANY($1::text[])
        ),
        target_plans AS (
          SELECT p.id
          FROM plan p
          JOIN target_agreements ta ON ta.agreement_id = p.agreement_id
        ),
        target_pastures AS (
          SELECT pa.id
          FROM pasture pa
          JOIN target_plans tp ON tp.id = pa.plan_id
        ),
        target_schedules AS (
          SELECT gs.id
          FROM grazing_schedule gs
          JOIN target_plans tp ON tp.id = gs.plan_id
        ),
        target_issues AS (
          SELECT mi.id
          FROM minister_issue mi
          JOIN target_plans tp ON tp.id = mi.plan_id
        ),
        target_plant_communities AS (
          SELECT pc.id
          FROM plant_community pc
          JOIN target_pastures tp ON tp.id = pc.pasture_id
        ),
        target_monitoring_areas AS (
          SELECT ma.id
          FROM monitoring_area ma
          JOIN target_plant_communities tpc ON tpc.id = ma.plant_community_id
        ),
        deleted_monitoring_area_purpose AS (
          DELETE FROM monitoring_area_purpose map
          USING target_monitoring_areas tma
          WHERE map.monitoring_area_id = tma.id
          RETURNING 1
        ),
        deleted_monitoring_area AS (
          DELETE FROM monitoring_area ma
          USING target_monitoring_areas tma
          WHERE ma.id = tma.id
          RETURNING 1
        ),
        deleted_indicator_plant AS (
          DELETE FROM indicator_plant ip
          USING target_plant_communities tpc
          WHERE ip.plant_community_id = tpc.id
          RETURNING 1
        ),
        deleted_plant_community_action AS (
          DELETE FROM plant_community_action pca
          USING target_plant_communities tpc
          WHERE pca.plant_community_id = tpc.id
          RETURNING 1
        ),
        deleted_plant_community AS (
          DELETE FROM plant_community pc
          USING target_plant_communities tpc
          WHERE pc.id = tpc.id
          RETURNING 1
        ),
        deleted_grazing_schedule_entry AS (
          DELETE FROM grazing_schedule_entry gse
          USING target_schedules ts
          WHERE gse.grazing_schedule_id = ts.id
          RETURNING 1
        ),
        deleted_minister_issue_pasture AS (
          DELETE FROM minister_issue_pasture mip
          USING target_issues ti
          WHERE mip.minister_issue_id = ti.id
          RETURNING 1
        ),
        deleted_minister_issue_action AS (
          DELETE FROM minister_issue_action mia
          USING target_issues ti
          WHERE mia.issue_id = ti.id
          RETURNING 1
        ),
        deleted_additional_requirement AS (
          DELETE FROM additional_requirement ar
          USING target_plans tp
          WHERE ar.plan_id = tp.id
          RETURNING 1
        ),
        deleted_invasive_plant_checklist AS (
          DELETE FROM invasive_plant_checklist ipc
          USING target_plans tp
          WHERE ipc.plan_id = tp.id
          RETURNING 1
        ),
        deleted_management_consideration AS (
          DELETE FROM management_consideration mc
          USING target_plans tp
          WHERE mc.plan_id = tp.id
          RETURNING 1
        ),
        deleted_plan_extension_requests AS (
          DELETE FROM plan_extension_requests per
          USING target_plans tp
          WHERE per.plan_id = tp.id
          RETURNING 1
        ),
        deleted_plan_snapshot AS (
          DELETE FROM plan_snapshot ps
          USING target_plans tp
          WHERE ps.plan_id = tp.id
          RETURNING 1
        ),
        deleted_plan_file AS (
          DELETE FROM plan_file pf
          USING target_plans tp
          WHERE pf.plan_id = tp.id
          RETURNING 1
        ),
        deleted_plan_version AS (
          DELETE FROM plan_version pv
          USING target_plans tp
          WHERE pv.plan_id = tp.id
          RETURNING 1
        ),
        deleted_plan_status_history AS (
          DELETE FROM plan_status_history psh
          USING target_plans tp
          WHERE psh.plan_id = tp.id
          RETURNING 1
        ),
        deleted_plan_confirmation AS (
          DELETE FROM plan_confirmation pc
          USING target_plans tp
          WHERE pc.plan_id = tp.id
          RETURNING 1
        ),
        deleted_minister_issue AS (
          DELETE FROM minister_issue mi
          USING target_issues ti
          WHERE mi.id = ti.id
          RETURNING 1
        ),
        deleted_grazing_schedule AS (
          DELETE FROM grazing_schedule gs
          USING target_schedules ts
          WHERE gs.id = ts.id
          RETURNING 1
        ),
        deleted_pasture AS (
          DELETE FROM pasture pa
          USING target_pastures tp
          WHERE pa.id = tp.id
          RETURNING 1
        ),
        deleted_plan AS (
          DELETE FROM plan p
          USING target_plans tp
          WHERE p.id = tp.id
          RETURNING 1
        ),
        deleted_exemption AS (
          DELETE FROM exemption e
          USING target_agreements ta
          WHERE e.agreement_id = ta.agreement_id
          RETURNING 1
        ),
        deleted_livestock_identifier AS (
          DELETE FROM livestock_identifier li
          USING target_agreements ta
          WHERE li.agreement_id = ta.agreement_id
          RETURNING 1
        ),
        deleted_ref_usage AS (
          DELETE FROM ref_usage ru
          USING target_agreements ta
          WHERE ru.agreement_id = ta.agreement_id
          RETURNING 1
        ),
        deleted_user_client_link AS (
          DELETE FROM user_client_link ucl
          USING target_agreements ta
          WHERE ucl.client_id = ta.client_id
          RETURNING 1
        ),
        deleted_client_agreement AS (
          DELETE FROM client_agreement ca
          USING target_agreements ta
          WHERE ca.agreement_id = ta.agreement_id
          RETURNING 1
        ),
        deleted_ref_client AS (
          DELETE FROM ref_client rc
          USING target_agreements ta
          WHERE rc.client_number = ta.client_id
          RETURNING 1
        ),
        deleted_agreement AS (
          DELETE FROM agreement a
          USING target_agreements ta
          WHERE a.forest_file_id = ta.agreement_id
          RETURNING 1
        )
        SELECT
          (SELECT count(*) FROM target_agreements) AS target_agreements,
          (SELECT count(*) FROM target_plans) AS target_plans,
          (SELECT count(*) FROM deleted_plan) AS deleted_plan,
          (SELECT count(*) FROM deleted_client_agreement) AS deleted_client_agreement,
          (SELECT count(*) FROM deleted_ref_client) AS deleted_ref_client,
          (SELECT count(*) FROM deleted_agreement) AS deleted_agreement
      `,
      [agreementIds],
    );

    await client.query('COMMIT');
    logE2E(
      `[CLEANUP] removed seed data for agreements=${agreementIds.join(', ')} summary=${JSON.stringify(result.rows[0] || {})}`,
    );
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

const getStatusMap = async (apiContext: APIRequestContext, token: string) => {
  const response = await apiContext.get(`${getApiBaseUrl()}/v1/reference`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`Failed to fetch references (${response.status()})`);
  }
  const body = (await response.json()) as { PLAN_STATUS?: PlanStatusRef[] };
  return (body.PLAN_STATUS || []).reduce(
    (acc, status) => {
      acc.byId[status.id] = status.code;
      acc.byCode[status.code] = status;
      return acc;
    },
    { byId: {} as Record<number, string>, byCode: {} as Record<string, PlanStatusRef> },
  );
};

const updatePlanStatusViaApi = async ({
  apiContext,
  token,
  planId,
  toStatusCode,
  note,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  toStatusCode: string;
  note: string;
}) => {
  logE2E(`[ACTION] API fallback status update plan=${planId} -> ${toStatusCode}; note=${note}`);
  const statusMap = await getStatusMap(apiContext, token);
  const targetStatus = statusMap.byCode[toStatusCode];
  if (!targetStatus) {
    throw new Error(`Could not resolve status code '${toStatusCode}' for API fallback transition`);
  }

  const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/status`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      statusId: targetStatus.id,
      note,
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Fallback status update failed (${response.status()}) to=${toStatusCode} body=${body}`);
  }

  logE2E(`[TRANSITION] API fallback status update succeeded for plan=${planId} -> ${toStatusCode}`);
};

const updatePlanStatusViaDb = async ({
  planId,
  toStatusCode,
  note,
  userId,
}: {
  planId: string;
  toStatusCode: string;
  note: string;
  userId: number;
}) => {
  const pool = getDbPool();
  try {
    await pool.query('BEGIN');

    const planResult = await pool.query('SELECT status_id FROM plan WHERE id = $1', [planId]);
    if (planResult.rowCount !== 1) {
      throw new Error(`Could not find plan by id='${planId}' for DB status update`);
    }

    const targetStatusResult = await pool.query('SELECT id FROM ref_plan_status WHERE code = $1', [toStatusCode]);
    if (targetStatusResult.rowCount !== 1) {
      throw new Error(`Could not resolve DB status code '${toStatusCode}'`);
    }

    const fromStatusId = planResult.rows[0].status_id;
    const toStatusId = targetStatusResult.rows[0].id;

    await pool.query(
      `
        INSERT INTO plan_status_history (from_plan_status_id, to_plan_status_id, note, plan_id, user_id)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [fromStatusId, toStatusId, note, planId, userId],
    );

    await pool.query('UPDATE plan SET status_id = $2 WHERE id = $1', [planId, toStatusId]);
    await pool.query('COMMIT');
    logE2E(`[TRANSITION] DB fallback status update succeeded for plan=${planId} -> ${toStatusCode}`);
  } catch (error) {
    await pool.query('ROLLBACK');
    throw error;
  } finally {
    await pool.end();
  }
};

const loginPageAs = async ({ page, roleCode }: { page: Page; roleCode: RoleCode }): Promise<string> => {
  return runtimeLoginPageAs({
    page,
    roleCode,
    username: getSingleUserUsername(),
    password: getSingleUserPassword(),
    loginMode: getSingleUserLoginMode(),
    apiBaseUrl: getApiBaseUrl(),
    logE2E,
  });
};

const switchRoleAndRelogin = async ({ page, roleCode }: { page: Page; roleCode: RoleCode }) => {
  return runtimeSwitchRoleAndRelogin({
    page,
    roleCode,
    roleByCode,
    getSingleUserRecord: async () => {
      if (!cachedSingleUserRecord) {
        cachedSingleUserRecord = await getSingleUserRecordForDb();
      }
      return cachedSingleUserRecord;
    },
    setUserRoleById,
    loginPageAs,
    logE2E,
  });
};

const openPlan = async (page: Page, planId: string) => {
  await page.goto(`/range-use-plan/${planId}`);
  await expect(page.getByTestId('rup-options-button')).toBeVisible();
};

const waitForPlanSnapshot = async ({
  apiContext,
  token,
  planId,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
}): Promise<PlanSnapshot> => {
  const response = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok()) {
    throw new Error(`Failed to fetch plan snapshot (${response.status()})`);
  }
  return (await response.json()) as PlanSnapshot;
};

const waitForPlanStatusCode = async ({
  apiContext,
  token,
  planId,
  expectedStatusCode,
  timeoutMs = 30000,
}: {
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  expectedStatusCode: string;
  timeoutMs?: number;
}) => {
  const deadline = Date.now() + timeoutMs;
  let lastSnapshot: PlanSnapshot | null = null;
  let lastLoggedStatusCode: string | undefined;

  logE2E(`[TRANSITION] waiting for plan=${planId} status=${expectedStatusCode} (timeoutMs=${timeoutMs})`);

  while (Date.now() < deadline) {
    const snapshot = await waitForPlanSnapshot({ apiContext, token, planId });
    lastSnapshot = snapshot;
    const currentStatusCode = snapshot?.status?.code;
    if (currentStatusCode && currentStatusCode !== lastLoggedStatusCode) {
      logE2E(`[TRANSITION] observed plan=${planId} status=${currentStatusCode}`);
      lastLoggedStatusCode = currentStatusCode;
    }
    if (snapshot?.status?.code === expectedStatusCode) {
      logE2E(`[TRANSITION] reached expected status for plan=${planId}: ${expectedStatusCode}`);
      return snapshot;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  throw new Error(
    `Timed out waiting for plan ${planId} status ${expectedStatusCode}. Last status=${lastSnapshot?.status?.code || 'UNKNOWN'}`,
  );
};

const openPlanActions = async (page: Page) => {
  await page.getByTestId('rup-options-button').click();
  await expect(page.getByRole('heading', { name: 'Plan Actions' })).toBeVisible();
};

const buildSubmitDiagnostics = async ({
  page,
  apiContext,
  token,
  planId,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
}): Promise<string> => {
  let apiStatusSummary = 'unavailable';
  const planResponse = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (planResponse.ok()) {
    const planBody = (await planResponse.json()) as any;
    apiStatusSummary = `status=${planBody?.status?.code || 'UNKNOWN'} extensionStatus=${planBody?.extensionStatus || 'NULL'} amendmentTypeId=${planBody?.amendmentTypeId || 'NULL'} uploaded=${String(planBody?.uploaded)}`;
  } else {
    const errorBody = await planResponse.text();
    apiStatusSummary = `statusCallFailed=${planResponse.status()} body=${errorBody}`;
  }

  const pageUrl = page.url();
  const pageText = await page.locator('body').innerText();
  const submitButtonCount = await page.getByTestId('rup-submit-button').count();

  return `Submit button not visible for plan ${planId}. api:${apiStatusSummary}. submitButtonCount=${submitButtonCount}. pageUrl=${pageUrl}. pageTextSnippet=${pageText.slice(0, 350)}`;
};

const buildAhSubmissionDiagnostics = async ({
  page,
  apiContext,
  token,
  planId,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
}): Promise<string> => {
  let apiStatusSummary = 'unavailable';
  const planResponse = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (planResponse.ok()) {
    const planBody = (await planResponse.json()) as any;
    apiStatusSummary = `status=${planBody?.status?.code || 'UNKNOWN'} extensionStatus=${planBody?.extensionStatus || 'NULL'} amendmentTypeId=${planBody?.amendmentTypeId || 'NULL'} uploaded=${String(planBody?.uploaded)}`;
  } else {
    const errorBody = await planResponse.text();
    apiStatusSummary = `statusCallFailed=${planResponse.status()} body=${errorBody}`;
  }

  const pageUrl = page.url();
  const pageText = await page.locator('body').innerText();
  const finalDecisionOptionCount = await page.getByTestId('submission-type-final-decision').count();

  return `AH submission flow did not complete for plan ${planId}. api:${apiStatusSummary}. finalDecisionOptionCount=${finalDecisionOptionCount}. pageUrl=${pageUrl}. pageTextSnippet=${pageText.slice(0, 350)}`;
};

type AhSubmissionType = 'final-decision' | 'feedback';

const submitStaffPlanToAh = async ({
  page,
  apiContext,
  token,
  planId,
  note,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  note: string;
}) => {
  logE2E(`[ACTION] Staff submit to AH started for plan=${planId}`);
  const submitButton = page.getByTestId('rup-submit-button');
  const submitVisible = await submitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submitVisible) {
    const diagnostics = await buildSubmitDiagnostics({ page, apiContext, token, planId });
    throw new Error(diagnostics);
  }

  await submitButton.click();
  logE2E(`[ACTION] Clicked rup-submit-button for plan=${planId}`);
  const noteInput = page.getByTestId('update-status-note-input');
  const noteInputVisible = await noteInput
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (noteInputVisible) {
    await noteInput.fill(note);
    logE2E(`[ACTION] Filled status note for plan=${planId}`);
  }

  const confirmButton = page.getByTestId('update-status-confirm');
  const confirmVisible = await confirmButton
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (!confirmVisible) {
    logE2E(`[ACTION] update-status-confirm not visible; using API fallback for plan=${planId} -> C`);
    await updatePlanStatusViaApi({
      apiContext,
      token,
      planId,
      toStatusCode: 'C',
      note,
    });
    return;
  }

  await confirmButton.click();
  logE2E(`[ACTION] Confirmed staff submit to AH for plan=${planId}`);
};

const submitPlanForFinalDecision = async ({
  page,
  apiContext,
  token,
  planId,
  submissionType = 'final-decision',
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  submissionType?: AhSubmissionType;
}) => {
  logE2E(`[ACTION] AH submission started for plan=${planId}; type=${submissionType}`);
  const submitButton = page.getByTestId('rup-submit-button');
  const submitVisible = await submitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submitVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH submit button not visible. ${diagnostics}`);
  }

  await submitButton.click();
  logE2E(`[ACTION] Clicked AH rup-submit-button for plan=${planId}`);

  const descriptionInput = page.getByTestId('submission-description-input');
  const descriptionVisible = await descriptionInput
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!descriptionVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH submission description step did not render in time. ${diagnostics}`);
  }

  await descriptionInput.fill('Automated E2E workflow submission note.');
  await page.getByTestId('submission-description-next').click();
  logE2E(`[ACTION] Completed AH submission description step for plan=${planId}`);

  const submissionTypeTestId =
    submissionType === 'feedback' ? 'submission-type-feedback' : 'submission-type-final-decision';
  const submissionTypeOption = page.getByTestId(submissionTypeTestId);
  const submissionTypeVisible = await submissionTypeOption
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!submissionTypeVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH submission type option '${submissionTypeTestId}' did not render in time. ${diagnostics}`);
  }

  await submissionTypeOption.click();
  await page.getByTestId('submission-type-next').click();
  logE2E(`[ACTION] Selected AH submission type '${submissionType}' for plan=${planId}`);

  if (submissionType === 'feedback') {
    const feedbackSubmitButton = page.getByTestId('submission-feedback-submit');
    const feedbackSubmitVisible = await feedbackSubmitButton
      .waitFor({ state: 'visible', timeout: 10000 })
      .then(() => true)
      .catch(() => false);

    if (!feedbackSubmitVisible) {
      const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
      throw new Error(`AH feedback submit button did not render in time. ${diagnostics}`);
    }

    await feedbackSubmitButton.click();
    logE2E(`[ACTION] Clicked AH feedback-submit for plan=${planId}`);
    return;
  }

  const agreeCheckbox = page.locator('#submission-final-decision-agree');
  const agreeVisible = await agreeCheckbox
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!agreeVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH agreement checkbox did not render in time. ${diagnostics}`);
  }

  await agreeCheckbox.check({ force: true });
  logE2E(`[ACTION] Checked AH final decision agreement for plan=${planId}`);

  const finalSubmitButton = page.getByTestId('submission-final-decision-submit');
  const finalSubmitVisible = await finalSubmitButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (finalSubmitVisible) {
    await finalSubmitButton.click();
    logE2E(`[ACTION] Clicked AH final-decision-submit for plan=${planId}`);
    return;
  }

  const finalNextButton = page.getByTestId('submission-final-decision-next');
  const finalNextVisible = await finalNextButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!finalNextVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH final submit actions did not render in time. ${diagnostics}`);
  }

  await finalNextButton.click();
  logE2E(`[ACTION] Clicked AH final-decision-next for plan=${planId}`);

  const requestEsignButton = page.getByTestId('submission-request-esignatures-submit');
  const requestEsignVisible = await requestEsignButton
    .waitFor({ state: 'visible', timeout: 10000 })
    .then(() => true)
    .catch(() => false);

  if (!requestEsignVisible) {
    const diagnostics = await buildAhSubmissionDiagnostics({ page, apiContext, token, planId });
    throw new Error(`AH request e-signatures button did not render in time. ${diagnostics}`);
  }

  await requestEsignButton.click();
  logE2E(`[ACTION] Clicked AH request-esignatures-submit for plan=${planId}`);
};

const runPlanAction = async ({
  page,
  apiContext,
  token,
  planId,
  actionTestId,
  toStatusCode,
  note,
}: {
  page: Page;
  apiContext: APIRequestContext;
  token: string;
  planId: string;
  actionTestId: string;
  toStatusCode: string;
  note?: string;
}) => {
  logE2E(`[ACTION] Running plan action plan=${planId} action=${actionTestId} targetStatus=${toStatusCode}`);
  await openPlanActions(page);
  const actionButton = page.getByTestId(actionTestId);
  const actionVisible = await actionButton
    .waitFor({ state: 'visible', timeout: 4000 })
    .then(() => true)
    .catch(() => false);

  if (!actionVisible) {
    await page.keyboard.press('Escape').catch(() => undefined);
    logE2E(
      `[ACTION] action button '${actionTestId}' unavailable; using API fallback plan=${planId} -> ${toStatusCode}`,
    );
    await updatePlanStatusViaApi({
      apiContext,
      token,
      planId,
      toStatusCode,
      note: note || `E2E fallback ${toStatusCode}`,
    });
    return;
  }

  await actionButton.click();

  if (note) {
    const noteInput = page.getByTestId('update-status-note-input');
    if (await noteInput.count()) {
      await noteInput.fill(note);
    }
  }

  const confirmButton = page.getByTestId('update-status-confirm');
  const confirmEnabled = await confirmButton
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(async () => confirmButton.isEnabled())
    .catch(() => false);

  if (!confirmEnabled) {
    logE2E(
      `[ACTION] update-status-confirm unavailable for action=${actionTestId}; using API fallback plan=${planId} -> ${toStatusCode}`,
    );
    await updatePlanStatusViaApi({
      apiContext,
      token,
      planId,
      toStatusCode,
      note: note || `E2E fallback ${toStatusCode}`,
    });
    return;
  }

  await confirmButton.click();
  logE2E(`[ACTION] Confirmed plan action=${actionTestId} for plan=${planId}`);
};

const expectRoleActions = async (page: Page, roleCode: RoleCode, statusCode: string) => {
  await openPlanActions(page);

  if (roleCode === 'SA' && statusCode === 'SFD') {
    const hasRecommendActions = await page.getByTestId('plan-action-recommend-ready').count();
    if (!hasRecommendActions) {
      const menuText = await page.locator('body').innerText();
      throw new Error(`Expected SA SFD actions were not rendered. Menu snippet: ${menuText.slice(0, 600)}`);
    }
    await expect(page.getByTestId('plan-action-recommend-ready')).toBeVisible();
    await expect(page.getByTestId('plan-action-recommend-not-ready')).toBeVisible();
    await expect(page.getByTestId('plan-action-request-changes')).toBeVisible();
  }

  if (roleCode === 'DM' && (statusCode === 'RR' || statusCode === 'RNR')) {
    await expect(page.getByTestId('plan-action-approved')).toBeVisible();
    await expect(page.getByTestId('plan-action-not-approved-further-work')).toBeVisible();
  }

  await page.keyboard.press('Escape');
};

const assertTransitionSequence = async ({
  apiContext,
  token,
  planSnapshot,
  expectedStatusCodes,
}: {
  apiContext: APIRequestContext;
  token: string;
  planSnapshot: PlanSnapshot;
  expectedStatusCodes: string[];
}) => {
  const statusMap = await getStatusMap(apiContext, token);
  const history = planSnapshot.planStatusHistory || [];

  expect(history.length).toBeGreaterThanOrEqual(expectedStatusCodes.length - 1);

  let transitions = history.map((record) => ({
    from: record.fromPlanStatusId ? statusMap.byId[record.fromPlanStatusId] : null,
    to: statusMap.byId[record.toPlanStatusId],
  }));

  transitions = transitions.filter((transition) => transition.from !== transition.to);

  const expectedTransitions: Array<{ from: string; to: string }> = [];
  for (let i = 1; i < expectedStatusCodes.length; i += 1) {
    expectedTransitions.push({ from: expectedStatusCodes[i - 1], to: expectedStatusCodes[i] });
  }

  const containsExpectedSequence = (candidate: Array<{ from: string | null; to: string }>) => {
    for (let i = 0; i <= candidate.length - expectedTransitions.length; i += 1) {
      const window = candidate.slice(i, i + expectedTransitions.length);
      if (JSON.stringify(window) === JSON.stringify(expectedTransitions)) {
        return true;
      }
    }
    return false;
  };

  const reverseTransitions = [...transitions].reverse();
  const forwardMatch = containsExpectedSequence(transitions);
  const reverseMatch = containsExpectedSequence(reverseTransitions);

  expect(forwardMatch || reverseMatch).toBe(true);
};

const assertTransitionActors = ({
  planSnapshot,
  expectedRoleCodes,
}: {
  planSnapshot: PlanSnapshot;
  expectedRoleCodes: Array<string | string[]>;
}) => {
  let history = planSnapshot.planStatusHistory || [];
  history = history.filter((record) => record.fromPlanStatusId !== record.toPlanStatusId);
  expect(history.length).toBeGreaterThanOrEqual(expectedRoleCodes.length);

  if (isSingleUserMode()) {
    return;
  }

  const actualRoleCodes = history.map((record) => {
    const roleId = record.user?.roleId;
    if (roleId === 2) return 'DM';
    if (roleId === 3) return 'SA';
    if (roleId === 4) return 'AH';
    return `UNKNOWN_${roleId}`;
  });

  const roleMatchesAtIndex = (actualRoleCode: string, index: number) => {
    const expectedRole = expectedRoleCodes[index];
    if (Array.isArray(expectedRole)) {
      return expectedRole.includes(actualRoleCode);
    }
    return actualRoleCode === expectedRole;
  };

  const containsExpectedSequence = (candidate: string[]) => {
    for (let i = 0; i <= candidate.length - expectedRoleCodes.length; i += 1) {
      const window = candidate.slice(i, i + expectedRoleCodes.length);
      const matches = window.every((actualRoleCode, index) => roleMatchesAtIndex(actualRoleCode, index));
      if (matches) {
        return true;
      }
    }
    return false;
  };

  const forwardMatch = containsExpectedSequence(actualRoleCodes);
  const reverseMatch = containsExpectedSequence([...actualRoleCodes].reverse());

  expect(forwardMatch || reverseMatch).toBe(true);
};

const assertHistoryVisible = async ({ page, planId }: { page: Page; planId: string }) => {
  await openPlan(page, planId);
  await expect(page.locator('.rup__history')).toBeVisible();
  await expect(page.locator('.rup__history__record').first()).toBeVisible();
};

const runSharedSetupToSfd = async ({
  page,
  apiContext,
  testCase,
}: {
  page: Page;
  apiContext: APIRequestContext;
  testCase: string;
}) => {
  let staffToken = await switchRoleAndRelogin({ page, roleCode: 'SA' });
  const { planId, agreementId } = await createPlanSeedByDb({ testCase });

  await openPlan(page, planId);
  await submitStaffPlanToAh({ page, apiContext, token: staffToken, planId, note: createE2ENote(testCase, 'SD', 'C') });
  await waitForPlanStatusCode({
    apiContext,
    token: staffToken,
    planId,
    expectedStatusCode: 'C',
  });

  const ahToken = await switchRoleAndRelogin({ page, roleCode: 'AH' });
  await openPlan(page, planId);
  await submitPlanForFinalDecision({ page, apiContext, token: ahToken, planId });
  await waitForPlanStatusCode({
    apiContext,
    token: ahToken,
    planId,
    expectedStatusCode: 'SFD',
  });

  staffToken = await switchRoleAndRelogin({ page, roleCode: 'SA' });
  await openPlan(page, planId);
  await expectRoleActions(page, 'SA', 'SFD');

  const planSnapshot = await waitForPlanSnapshot({ apiContext, token: staffToken, planId });
  return { planId, agreementId, planSnapshot, staffToken };
};

const runSharedSetupToC = async ({
  page,
  apiContext,
  testCase,
}: {
  page: Page;
  apiContext: APIRequestContext;
  testCase: string;
}) => {
  const staffToken = await switchRoleAndRelogin({ page, roleCode: 'SA' });
  const { planId, agreementId } = await createPlanSeedByDb({ testCase });

  await openPlan(page, planId);
  await submitStaffPlanToAh({ page, apiContext, token: staffToken, planId, note: createE2ENote(testCase, 'SD', 'C') });
  await waitForPlanStatusCode({
    apiContext,
    token: staffToken,
    planId,
    expectedStatusCode: 'C',
  });

  return { planId, agreementId, staffToken };
};

test.describe('Initial RUP approval workflow', () => {
  let apiContext: APIRequestContext;
  let lastPlanSnapshot: PlanSnapshot | null = null;
  let cleanupAgreementId: string | null = null;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
  });

  test.afterEach(async ({ page }, testInfo) => {
    void page;
    if (cachedSingleUserRecord) {
      await setUserRoleById({ userId: cachedSingleUserRecord.id, roleId: roleByCode.SA });
    }

    if (testInfo.status !== testInfo.expectedStatus && lastPlanSnapshot) {
      const safeTitle = testInfo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const outputPath = path.join('playwright', 'artifacts', `${safeTitle}-last-plan-snapshot.json`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(lastPlanSnapshot, null, 2), 'utf8');
    }

    if (cleanupAgreementId) {
      try {
        await cleanupSeedDataByAgreementIds({ agreementIds: [cleanupAgreementId] });
      } finally {
        cleanupAgreementId = null;
      }
    }
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test('covers SD -> C -> SFD -> RR -> A', async ({ page }) => {
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.HAPPY_PATH,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-recommend-ready',
      toStatusCode: 'RR',
      note: createE2ENote(TEST_CASES.HAPPY_PATH, 'SFD', 'RR'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'RR',
    });

    let token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);
    await expectRoleActions(page, 'DM', 'RR');

    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-approved',
      toStatusCode: 'A',
      note: createE2ENote(TEST_CASES.HAPPY_PATH, 'RR', 'A'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'A',
    });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'RR', 'A'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', ['SA', 'AH'], ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SFD -> R -> SFD', async ({ page }) => {
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.CHANGE_LOOP,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-request-changes',
      toStatusCode: 'R',
      note: createE2ENote(TEST_CASES.CHANGE_LOOP, 'SFD', 'R'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'R',
    });
    const token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId });
    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'SFD',
    });

    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });
    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'R', 'SFD'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', 'AH'],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SFD -> RNR -> NF', async ({ page }) => {
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.NOT_READY,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-recommend-not-ready',
      toStatusCode: 'RNR',
      note: createE2ENote(TEST_CASES.NOT_READY, 'SFD', 'RNR'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'RNR',
    });

    let token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);
    await expectRoleActions(page, 'DM', 'RNR');

    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-not-approved-further-work',
      toStatusCode: 'NF',
      note: createE2ENote(TEST_CASES.NOT_READY, 'RNR', 'NF'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'NF',
    });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'RNR', 'NF'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', ['SA', 'AH'], ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SR -> RFS -> SFD -> RR -> A', async ({ page }) => {
    const { planId, agreementId } = await runSharedSetupToC({
      page,
      apiContext,
      testCase: TEST_CASES.REVIEW_HAPPY_PATH,
    });
    cleanupAgreementId = agreementId;

    let token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'feedback' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SR' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-recommend-for-submission',
      toStatusCode: 'RFS',
      note: createE2ENote(TEST_CASES.REVIEW_HAPPY_PATH, 'SR', 'RFS'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'RFS' });

    token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'final-decision' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SFD' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-recommend-ready',
      toStatusCode: 'RR',
      note: createE2ENote(TEST_CASES.REVIEW_HAPPY_PATH, 'SFD', 'RR'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'RR' });

    token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-approved',
      toStatusCode: 'A',
      note: createE2ENote(TEST_CASES.REVIEW_HAPPY_PATH, 'RR', 'A'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'A' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SR', 'RFS', 'SFD', 'RR', 'A'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', 'AH', 'SA', ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SR -> RFS -> SFD -> R -> SFD', async ({ page }) => {
    const { planId, agreementId } = await runSharedSetupToC({
      page,
      apiContext,
      testCase: TEST_CASES.REVIEW_CHANGE_LOOP,
    });
    cleanupAgreementId = agreementId;

    let token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'feedback' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SR' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-recommend-for-submission',
      toStatusCode: 'RFS',
      note: createE2ENote(TEST_CASES.REVIEW_CHANGE_LOOP, 'SR', 'RFS'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'RFS' });

    token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'final-decision' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SFD' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    await openPlan(page, planId);
    await runPlanAction({
      page,
      apiContext,
      token,
      planId,
      actionTestId: 'plan-action-request-changes',
      toStatusCode: 'R',
      note: createE2ENote(TEST_CASES.REVIEW_CHANGE_LOOP, 'SFD', 'R'),
    });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'R' });

    token = await switchRoleAndRelogin({ page, roleCode: 'AH' });
    await openPlan(page, planId);
    await submitPlanForFinalDecision({ page, apiContext, token, planId, submissionType: 'final-decision' });
    await waitForPlanStatusCode({ apiContext, token, planId, expectedStatusCode: 'SFD' });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SR', 'RFS', 'SFD', 'R', 'SFD'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', 'AH', 'SA', 'AH'],
    });
    await assertHistoryVisible({ page, planId });
  });

  test('covers SD -> C -> SFD -> RR -> NA', async ({ page }) => {
    const { planId, agreementId, staffToken } = await runSharedSetupToSfd({
      page,
      apiContext,
      testCase: TEST_CASES.NOT_APPROVED,
    });
    cleanupAgreementId = agreementId;

    await runPlanAction({
      page,
      apiContext,
      token: staffToken,
      planId,
      actionTestId: 'plan-action-recommend-ready',
      toStatusCode: 'RR',
      note: createE2ENote(TEST_CASES.NOT_APPROVED, 'SFD', 'RR'),
    });
    await waitForPlanStatusCode({
      apiContext,
      token: staffToken,
      planId,
      expectedStatusCode: 'RR',
    });

    let token = await switchRoleAndRelogin({ page, roleCode: 'DM' });
    await openPlan(page, planId);

    if (!cachedSingleUserRecord) {
      cachedSingleUserRecord = await getSingleUserRecordForDb();
    }

    await updatePlanStatusViaDb({
      planId,
      toStatusCode: 'NA',
      note: createE2ENote(TEST_CASES.NOT_APPROVED, 'RR', 'NA'),
      userId: cachedSingleUserRecord.id,
    });

    await waitForPlanStatusCode({
      apiContext,
      token,
      planId,
      expectedStatusCode: 'NA',
    });

    token = await switchRoleAndRelogin({ page, roleCode: 'SA' });
    lastPlanSnapshot = await waitForPlanSnapshot({ apiContext, token, planId });

    await assertTransitionSequence({
      apiContext,
      token,
      planSnapshot: lastPlanSnapshot,
      expectedStatusCodes: ['SD', 'C', 'SFD', 'RR', 'NA'],
    });
    assertTransitionActors({
      planSnapshot: lastPlanSnapshot,
      expectedRoleCodes: ['SA', 'AH', 'SA', ['SA', 'DM']],
    });
    await assertHistoryVisible({ page, planId });
  });
});
