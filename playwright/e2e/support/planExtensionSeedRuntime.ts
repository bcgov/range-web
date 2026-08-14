import { Pool } from 'pg';
import { createPlanSeedByDb } from './dbRuntime';

type GetDbPool = () => Pool;
type QueryResultLike = { rowCount: number; rows: Array<Record<string, unknown>> };
type DbQueryable = { query: (text: string, params?: unknown[]) => Promise<QueryResultLike> };

type ExtensionEligibility = 'eligible' | 'ineligible';

type CreatePlanExtensionSeedByDbArgs = {
  getDbPool: GetDbPool;
  testCase: string;
  e2ePrefix: string;
  singleUserSsoCandidates: string[];
  districtCode: string;
  sourceAgreementId: string;
  eligibility: ExtensionEligibility;
  additionalClientCount?: number;
};

type PlanExtensionSeedResult = {
  planId: string;
  agreementId: string;
  clientNumbers: string[];
  planEndDate: string;
  eligibility: ExtensionEligibility;
};

const getUserIdBySsoCandidates = async ({
  db,
  candidates,
}: {
  db: DbQueryable;
  candidates: string[];
}): Promise<number> => {
  const result = await db.query(
    `
      SELECT id
      FROM user_account
      WHERE lower(sso_id) = ANY($1::text[])
      ORDER BY id ASC
      LIMIT 1
    `,
    [candidates.map((candidate) => candidate.toLowerCase())],
  );

  if (result.rowCount !== 1) {
    throw new Error(`Could not find E2E user by sso_id candidates: ${candidates.join(', ')}`);
  }

  return Number(result.rows[0].id);
};

const createClientNumber = ({ seed, index }: { seed: number; index: number }): string => {
  const base = `${seed}${index}`.replace(/\D/g, '');
  return `9${base.slice(-7).padStart(7, '0')}`;
};

const listAgreementClientNumbers = async ({
  db,
  agreementId,
}: {
  db: DbQueryable;
  agreementId: string;
}): Promise<string[]> => {
  const rows = await db.query(
    `
      SELECT client_id
      FROM client_agreement
      WHERE agreement_id = $1
      ORDER BY client_id ASC
    `,
    [agreementId],
  );

  return rows.rows.map((row: { client_id: string }) => row.client_id);
};

const insertAdditionalClients = async ({
  db,
  agreementId,
  ahUserId,
  additionalClientCount,
  e2ePrefix,
  testCase,
}: {
  db: DbQueryable;
  agreementId: string;
  ahUserId: number;
  additionalClientCount: number;
  e2ePrefix: string;
  testCase: string;
}): Promise<void> => {
  if (additionalClientCount <= 0) {
    return;
  }

  const clientTypeResult = await db.query("SELECT id FROM ref_client_type WHERE code = 'A'");
  if (clientTypeResult.rowCount !== 1) {
    throw new Error("Could not find client type code='A'");
  }

  const clientTypeId = Number(clientTypeResult.rows[0].id);
  const seed = Date.now();

  for (let i = 1; i <= additionalClientCount; i += 1) {
    const clientNumber = createClientNumber({ seed, index: i });
    const existingClient = await db.query('SELECT 1 FROM ref_client WHERE client_number = $1', [clientNumber]);
    if (existingClient.rowCount > 0) {
      continue;
    }

    await db.query('INSERT INTO ref_client (client_number, name) VALUES ($1, $2)', [
      clientNumber,
      `${e2ePrefix}-EXT-CLIENT-${testCase}-${i}`,
    ]);

    await db.query(
      `
        INSERT INTO client_agreement (agreement_id, client_type_id, agent_id, client_id)
        VALUES ($1, $2, $3, $4)
      `,
      [agreementId, clientTypeId, ahUserId, clientNumber],
    );

    await db.query(
      `
        INSERT INTO user_client_link (user_id, client_id, type, active)
        VALUES ($1, $2, 'owner', true)
        ON CONFLICT DO NOTHING
      `,
      [ahUserId, clientNumber],
    );
  }
};

const computePlanEndDateExpression = (eligibility: ExtensionEligibility): string => {
  if (eligibility === 'eligible') {
    return "CURRENT_DATE + INTERVAL '11 months'";
  }

  return "CURRENT_DATE + INTERVAL '18 months'";
};

export const createPlanExtensionSeedByDb = async ({
  getDbPool,
  testCase,
  e2ePrefix,
  singleUserSsoCandidates,
  districtCode,
  sourceAgreementId,
  eligibility,
  additionalClientCount = 1,
}: CreatePlanExtensionSeedByDbArgs): Promise<PlanExtensionSeedResult> => {
  const baseSeed = await createPlanSeedByDb({
    getDbPool,
    testCase,
    e2ePrefix,
    singleUserSsoCandidates,
    districtCode,
    sourceAgreementId,
  });

  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ahUserId = await getUserIdBySsoCandidates({ db: client, candidates: singleUserSsoCandidates });
    await insertAdditionalClients({
      db: client,
      agreementId: baseSeed.agreementId,
      ahUserId,
      additionalClientCount,
      e2ePrefix,
      testCase,
    });

    const planEndDateExpression = computePlanEndDateExpression(eligibility);
    const planUpdate = await client.query(
      `
        UPDATE plan
        SET plan_end_date = ${planEndDateExpression},
            extension_status = NULL,
            extension_required_votes = 0,
            extension_received_votes = 0,
            extension_date = NULL,
            extension_rejected_by = NULL,
            replacement_plan_id = NULL,
            replacement_of = NULL
        WHERE id = $1
        RETURNING to_char(plan_end_date::date, 'YYYY-MM-DD') AS plan_end_date
      `,
      [baseSeed.planId],
    );

    if (planUpdate.rowCount !== 1) {
      throw new Error(`Could not update plan end date for extension seed plan ${baseSeed.planId}`);
    }

    const clientNumbers = await listAgreementClientNumbers({ db: client, agreementId: baseSeed.agreementId });
    await client.query('COMMIT');

    return {
      planId: baseSeed.planId,
      agreementId: baseSeed.agreementId,
      clientNumbers,
      planEndDate: String(planUpdate.rows[0].plan_end_date),
      eligibility,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};
