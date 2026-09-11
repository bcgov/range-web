import { Pool } from 'pg';

type GetDbPool = () => Pool;

export type PlanCreationFixture = {
  planId: string;
  agreementId: string;
  clientNumber: string;
  scheduleId: number;
  scheduleYear: number;
  pastureId: number;
  livestockTypeId?: number;
};

const closePool = async (pool: Pool): Promise<void> => {
  await pool.end();
};

export const seedPlanCreationScheduleByDb = async ({
  getDbPool,
  planId,
  agreementTypeId,
}: {
  getDbPool: GetDbPool;
  planId: string;
  agreementTypeId: number;
}): Promise<{ scheduleId: number; scheduleYear: number; pastureId: number; livestockTypeId?: number }> => {
  const pool = getDbPool();
  const year = new Date().getFullYear();

  try {
    const planResult = await pool.query(
      `UPDATE plan
       SET plan_start_date = $2,
           plan_end_date = $3
       WHERE id = $1
       RETURNING id, agreement_id`,
      [Number(planId), `${year}-01-01`, `${year + 1}-12-31`],
    );
    if (planResult.rowCount !== 1) {
      throw new Error(`Could not update seeded plan dates for plan=${planId}`);
    }

    const pastureResult = await pool.query('SELECT id FROM pasture WHERE plan_id = $1 ORDER BY id ASC LIMIT 1', [
      Number(planId),
    ]);
    if (pastureResult.rowCount !== 1) {
      throw new Error(`Could not find a pasture for seeded plan=${planId}`);
    }
    const pastureId = Number(pastureResult.rows[0].id);

    const usageResult = await pool.query(
      `SELECT id
       FROM ref_usage
       WHERE agreement_id = $1 AND year = $2
       ORDER BY id ASC
       LIMIT 1`,
      [planResult.rows[0].agreement_id, year],
    );
    let usageId: number;
    if (usageResult.rowCount === 1) {
      usageId = Number(usageResult.rows[0].id);
    } else {
      const fallbackUsageResult = await pool.query(
        `SELECT id
         FROM ref_usage
         WHERE agreement_id = $1
         ORDER BY id ASC
         LIMIT 1`,
        [planResult.rows[0].agreement_id],
      );
      if (fallbackUsageResult.rowCount !== 1) {
        throw new Error(`Could not find usage for seeded plan=${planId}`);
      }
      usageId = Number(fallbackUsageResult.rows[0].id);
      await pool.query('UPDATE ref_usage SET year = $2 WHERE id = $1', [usageId, year]);
    }
    if (agreementTypeId === 1 || agreementTypeId === 2) {
      await pool.query('UPDATE ref_usage SET total_annual_use = 1 WHERE id = $1', [usageId]);
    } else {
      await pool.query('UPDATE ref_usage SET authorized_aum = 1 WHERE id = $1', [usageId]);
    }

    const scheduleResult = await pool.query(
      `INSERT INTO grazing_schedule (plan_id, year, narative, created_at, updated_at)
       VALUES ($1, $2, $3, now(), now())
       RETURNING id`,
      [Number(planId), year, `E2E plan creation schedule ${year}`],
    );
    const scheduleId = Number(scheduleResult.rows[0].id);
    await pool.query('UPDATE grazing_schedule SET canonical_id = id WHERE id = $1', [scheduleId]);

    if (agreementTypeId === 1 || agreementTypeId === 2) {
      const livestockResult = await pool.query('SELECT id FROM ref_livestock ORDER BY id ASC LIMIT 1');
      if (livestockResult.rowCount !== 1) {
        throw new Error('Could not find a livestock type for grazing schedule seed');
      }
      const livestockTypeId = Number(livestockResult.rows[0].id);
      await pool.query(
        `INSERT INTO grazing_schedule_entry
           (grazing_schedule_id, pasture_id, livestock_type_id, livestock_count,
            date_in, date_out, grace_days, created_at, updated_at)
         VALUES ($1, $2, $3, 1, $4, $5, 0, now(), now())`,
        [scheduleId, pastureId, livestockTypeId, `${year}-05-01`, `${year}-05-02`],
      );
      await pool.query('UPDATE grazing_schedule_entry SET canonical_id = id WHERE grazing_schedule_id = $1', [
        scheduleId,
      ]);
      return { scheduleId, scheduleYear: year, pastureId, livestockTypeId };
    }

    await pool.query(
      `INSERT INTO haycutting_schedule_entry
         (haycutting_schedule_id, pasture_id, stubble_height, tonnes,
          date_in, date_out, created_at, updated_at)
       VALUES ($1, $2, 5, 1, $3, $4, now(), now())`,
      [scheduleId, pastureId, `${year}-05-01`, `${year}-05-02`],
    );
    await pool.query('UPDATE haycutting_schedule_entry SET canonical_id = id WHERE haycutting_schedule_id = $1', [
      scheduleId,
    ]);
    return { scheduleId, scheduleYear: year, pastureId };
  } finally {
    await closePool(pool);
  }
};

export const readPersistedPlanByDb = async ({
  getDbPool,
  planId,
}: {
  getDbPool: GetDbPool;
  planId: string;
}): Promise<Record<string, any>> => {
  const pool = getDbPool();
  try {
    const result = await pool.query(
      `SELECT id, range_name AS "rangeName", plan_start_date AS "planStartDate",
              plan_end_date AS "planEndDate", status_id AS "statusId"
       FROM plan
       WHERE id = $1`,
      [Number(planId)],
    );
    if (result.rowCount !== 1) {
      throw new Error(`Could not find persisted plan=${planId}`);
    }
    return result.rows[0];
  } finally {
    await closePool(pool);
  }
};

export const updatePlanCreationFixtureByDb = async ({
  getDbPool,
  planId,
  fields,
}: {
  getDbPool: GetDbPool;
  planId: string;
  fields: Record<string, any>;
}): Promise<void> => {
  const allowedColumns: Record<string, string> = {
    rangeName: 'range_name',
    planStartDate: 'plan_start_date',
    planEndDate: 'plan_end_date',
  };
  const entries = Object.entries(fields);
  if (entries.some(([field]) => !allowedColumns[field])) {
    throw new Error(`Unsupported plan fixture field: ${entries.find(([field]) => !allowedColumns[field])?.[0]}`);
  }
  const pool = getDbPool();
  try {
    for (const [field, value] of entries) {
      await pool.query(`UPDATE plan SET "${allowedColumns[field]}" = $2 WHERE id = $1`, [Number(planId), value]);
    }
  } finally {
    await closePool(pool);
  }
};

export const updateFirstPastureByDb = async ({
  getDbPool,
  planId,
  fields,
}: {
  getDbPool: GetDbPool;
  planId: string;
  fields: { name?: string | null; pldPercent?: number | null; allowableAum?: number | null; graceDays?: number | null };
}): Promise<void> => {
  const columnMap: Record<string, string> = {
    name: 'name',
    pldPercent: 'pld_percent',
    allowableAum: 'allowable_aum',
    graceDays: 'grace_days',
  };
  const pool = getDbPool();
  try {
    const pasture = await pool.query('SELECT id FROM pasture WHERE plan_id = $1 ORDER BY id ASC LIMIT 1', [
      Number(planId),
    ]);
    if (pasture.rowCount !== 1) {
      throw new Error(`Could not find pasture for plan=${planId}`);
    }
    for (const [field, value] of Object.entries(fields)) {
      await pool.query(`UPDATE pasture SET "${columnMap[field]}" = $2 WHERE id = $1`, [
        Number(pasture.rows[0].id),
        value,
      ]);
    }
  } finally {
    await closePool(pool);
  }
};

export const approveAllPlantCommunitiesByDb = async ({
  getDbPool,
  planId,
}: {
  getDbPool: GetDbPool;
  planId: string;
}): Promise<void> => {
  const pool = getDbPool();
  try {
    await pool.query(
      `UPDATE plant_community
       SET approved = true
       WHERE pasture_id IN (SELECT id FROM pasture WHERE plan_id = $1)`,
      [Number(planId)],
    );
  } finally {
    await closePool(pool);
  }
};

export const updateScheduleEntryByDb = async ({
  getDbPool,
  scheduleId,
  agreementTypeId,
  fields,
}: {
  getDbPool: GetDbPool;
  scheduleId: number;
  agreementTypeId: number;
  fields: Record<string, any>;
}): Promise<void> => {
  const columnMap: Record<string, string> = {
    dateIn: 'date_in',
    dateOut: 'date_out',
    pastureId: 'pasture_id',
    livestockCount: 'livestock_count',
    livestockTypeId: 'livestock_type_id',
    stubbleHeight: 'stubble_height',
    tonnes: 'tonnes',
  };
  const table = agreementTypeId === 1 || agreementTypeId === 2 ? 'grazing_schedule_entry' : 'haycutting_schedule_entry';
  const scheduleColumn =
    agreementTypeId === 1 || agreementTypeId === 2 ? 'grazing_schedule_id' : 'haycutting_schedule_id';
  const pool = getDbPool();
  try {
    const entries = Object.entries(fields);
    for (const [field, value] of entries) {
      if (!columnMap[field]) {
        throw new Error(`Unsupported schedule fixture field: ${field}`);
      }
      await pool.query(
        `UPDATE ${table} SET "${columnMap[field]}" = $2
         WHERE id = (SELECT id FROM ${table} WHERE "${scheduleColumn}" = $1 ORDER BY id ASC LIMIT 1)`,
        [scheduleId, value],
      );
    }
  } finally {
    await closePool(pool);
  }
};

export const deleteMapAttachmentsByDb = async ({
  getDbPool,
  planId,
}: {
  getDbPool: GetDbPool;
  planId: string;
}): Promise<void> => {
  const pool = getDbPool();
  try {
    await pool.query(`DELETE FROM plan_file WHERE plan_id = $1 AND type = 'mapAttachments'`, [Number(planId)]);
  } finally {
    await closePool(pool);
  }
};
