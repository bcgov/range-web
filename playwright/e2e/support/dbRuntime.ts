import { Pool } from 'pg';
import { randomInt } from 'crypto';

type GetDbPool = () => Pool;

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

export const getSingleUserRecordForDb = async ({
  getDbPool,
  candidates,
}: {
  getDbPool: GetDbPool;
  candidates: string[];
}) => {
  const pool = getDbPool();
  try {
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

export const setUserRoleById = async ({
  getDbPool,
  userId,
  roleId,
}: {
  getDbPool: GetDbPool;
  userId: number;
  roleId: number;
}) => {
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

export const createPlanSeedByDb = async ({
  getDbPool,
  testCase,
  e2ePrefix,
  singleUserSsoCandidates,
  singleUserId,
  districtCode,
  sourceAgreementId,
  agreementTypeId = 1,
  copySchedules = true,
}: {
  getDbPool: GetDbPool;
  testCase: string;
  e2ePrefix: string;
  singleUserSsoCandidates: string[];
  singleUserId?: number;
  districtCode: string;
  sourceAgreementId: string;
  /** 1/2 = grazing, 3/4 = hay cutting. Drives which schedule UI the plan renders. */
  agreementTypeId?: number;
  /** Whether to clone the source plan's schedules and entries. */
  copySchedules?: boolean;
}): Promise<{ planId: string; agreementId: string; clientNumber: string }> => {
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const singleUser = singleUserId
      ? ((await client.query('SELECT id, sso_id FROM user_account WHERE id = $1', [singleUserId])).rows[0] as {
          id: number;
          sso_id: string;
        })
      : await findUserBySsoCandidates({
          client,
          candidates: singleUserSsoCandidates,
          roleLabel: 'E2E',
        });

    if (!singleUser) {
      throw new Error(`Could not find E2E user by id='${singleUserId}'`);
    }

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

    // `client_number` is unique and only 8 characters wide, so a timestamp
    // alone collides when two workers seed within the same millisecond. Pick a
    // random number and retry until one is free, matching how the agreement id
    // is chosen below.
    const timestamp = Date.now();
    let clientNumber = '';
    for (let i = 0; i < 100; i += 1) {
      const candidate = `9${String(randomInt(10000000)).padStart(7, '0')}`;
      const exists = await client.query('SELECT 1 FROM ref_client WHERE client_number = $1', [candidate]);
      if (exists.rowCount === 0) {
        clientNumber = candidate;
        break;
      }
    }
    if (!clientNumber) {
      throw new Error('Unable to find an unused ref_client client_number for seeding');
    }
    await client.query('INSERT INTO ref_client (client_number, name) VALUES ($1, $2)', [
      clientNumber,
      `${e2ePrefix}-CLIENT-${testCase}-${timestamp}`,
    ]);

    let agreementId = '';
    for (let i = 0; i < 100; i += 1) {
      const suffix = String(randomInt(100)).padStart(2, '0');
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
        ) VALUES ($1, NOW(), NOW() + INTERVAL '5 years', $3, $2, false, 2, 0, 1, 'NOT_EXEMPTED')
      `,
      [agreementId, zoneId, agreementTypeId],
    );

    const sourceUsageResult = await client.query('SELECT * FROM ref_usage WHERE agreement_id = $1 ORDER BY id', [
      sourceAgreementId,
    ]);
    for (const sourceUsage of sourceUsageResult.rows) {
      await insertRow({
        client,
        table: 'ref_usage',
        sourceRow: sourceUsage,
        overrides: { agreement_id: agreementId },
        excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
      });
    }

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
        range_name: `${e2ePrefix}-${testCase}-${timestamp}`,
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

    if (copySchedules) {
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

      if (scheduleMap.size > 0) {
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

        // Hay cutting entries hang off the same grazing_schedule rows but live
        // in their own table, so they need cloning separately from grazing
        // entries.
        const sourceHayCuttingEntries = await client.query(
          'SELECT * FROM haycutting_schedule_entry WHERE haycutting_schedule_id = ANY($1::int[]) ORDER BY id',
          [Array.from(scheduleMap.keys())],
        );
        for (const sourceEntry of sourceHayCuttingEntries.rows) {
          await insertRow({
            client,
            table: 'haycutting_schedule_entry',
            sourceRow: sourceEntry,
            overrides: {
              haycutting_schedule_id: scheduleMap.get(Number(sourceEntry.haycutting_schedule_id)),
              pasture_id: pastureMap.get(Number(sourceEntry.pasture_id)),
            },
            excludeColumns: ['id', 'created_at', 'updated_at', 'canonical_id'],
          });
        }
      }
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
        [`${e2ePrefix}-${testCase}-${timestamp}-map.pdf`, 'https://example.com/e2e-map.pdf', newPlanId, staffUserId],
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

export const cleanupSeedDataByAgreementIds = async ({
  getDbPool,
  agreementIds,
  logE2E,
}: {
  getDbPool: GetDbPool;
  agreementIds: string[];
  logE2E: (message: string) => void;
}) => {
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
        deleted_haycutting_schedule_entry AS (
          DELETE FROM haycutting_schedule_entry hse
          USING target_schedules ts
          WHERE hse.haycutting_schedule_id = ts.id
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

export const updatePlanStatusViaDb = async ({
  getDbPool,
  planId,
  toStatusCode,
  note,
  userId,
  logE2E,
}: {
  getDbPool: GetDbPool;
  planId: string;
  toStatusCode: string;
  note: string;
  userId: number;
  logE2E: (message: string) => void;
}) => {
  const pool = getDbPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const planResult = await client.query('SELECT status_id FROM plan WHERE id = $1', [planId]);
    if (planResult.rowCount !== 1) {
      throw new Error(`Could not find plan by id='${planId}' for DB status update`);
    }

    const targetStatusResult = await client.query('SELECT id FROM ref_plan_status WHERE code = $1', [toStatusCode]);
    if (targetStatusResult.rowCount !== 1) {
      throw new Error(`Could not resolve DB status code '${toStatusCode}'`);
    }

    const fromStatusId = planResult.rows[0].status_id;
    const toStatusId = targetStatusResult.rows[0].id;

    await client.query(
      `
        INSERT INTO plan_status_history (from_plan_status_id, to_plan_status_id, note, plan_id, user_id)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [fromStatusId, toStatusId, note, planId, userId],
    );

    await client.query('UPDATE plan SET status_id = $2 WHERE id = $1', [planId, toStatusId]);
    await client.query('COMMIT');
    logE2E(`[TRANSITION] DB fallback status update succeeded for plan=${planId} -> ${toStatusCode}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};
