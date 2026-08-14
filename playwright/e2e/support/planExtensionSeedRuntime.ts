import { Pool } from 'pg';
import { createPlanSeedByDb } from './dbRuntime';
import type { ExtensionPlanSnapshot } from './planExtensionAssertions';

type GetDbPool = () => Pool;
type QueryResultLike = { rowCount: number; rows: Array<Record<string, unknown>> };
type DbQueryable = { query: (text: string, params?: unknown[]) => Promise<QueryResultLike> };

type ExtensionEligibility = 'eligible' | 'ineligible';

type CreatePlanExtensionSeedByDbArgs = {
  getDbPool: GetDbPool;
  testCase: string;
  e2ePrefix: string;
  singleUserSsoCandidates: string[];
  singleUserId?: number;
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
  primaryClientNumber: string;
};

type SimulateExtensionBackgroundJobArgs = {
  getDbPool: GetDbPool;
  planId: string;
  agreementId: string;
  fallbackUserId: number;
};

type ExtensionRequestSeedResult = {
  extensionRequestIds: number[];
  requiredVotes: number;
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

const createDeterministicSeed = ({
  agreementId,
  ahUserId,
  testCase,
}: {
  agreementId: string;
  ahUserId: number;
  testCase: string;
}): number => {
  const input = `${agreementId}:${ahUserId}:${testCase}`;
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
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
  const seed = createDeterministicSeed({ agreementId, ahUserId, testCase });

  for (let i = 1; i <= additionalClientCount; i += 1) {
    let clientNumber = '';
    for (let offset = 0; offset < 100; offset += 1) {
      const candidate = createClientNumber({ seed, index: i + offset * additionalClientCount });
      const existingClient = await db.query('SELECT 1 FROM ref_client WHERE client_number = $1', [candidate]);
      if (existingClient.rowCount === 0) {
        clientNumber = candidate;
        break;
      }
    }

    if (!clientNumber) {
      throw new Error(
        `Could not allocate deterministic extension client number for agreement=${agreementId}, testCase=${testCase}, slot=${i}`,
      );
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
  singleUserId,
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
    singleUserId,
    districtCode,
    sourceAgreementId,
  });

  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ahUserId =
      singleUserId || (await getUserIdBySsoCandidates({ db: client, candidates: singleUserSsoCandidates }));
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
      primaryClientNumber: baseSeed.clientNumber,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

export const simulateExtensionBackgroundJobByDb = async ({
  getDbPool,
  planId,
  agreementId,
  fallbackUserId,
}: SimulateExtensionBackgroundJobArgs): Promise<ExtensionRequestSeedResult> => {
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const clientLinks = await client.query(
      `
        SELECT DISTINCT ca.client_id
        FROM client_agreement ca
        WHERE ca.agreement_id = $1
        ORDER BY ca.client_id ASC
      `,
      [agreementId],
    );

    if (clientLinks.rowCount === 0) {
      throw new Error(`No clients found on agreement ${agreementId}`);
    }

    await client.query('DELETE FROM plan_extension_requests WHERE plan_id = $1', [planId]);

    const extensionRequestIds: number[] = [];
    for (const row of clientLinks.rows as Array<{ client_id: string }>) {
      const inserted = await client.query(
        `
          INSERT INTO plan_extension_requests (
            plan_id,
            client_id,
            user_id,
            email,
            requested_extension,
            created_at,
            updated_at
          )
          VALUES ($1, $2, $3, NULL, NULL, NOW(), NOW())
          RETURNING id
        `,
        [planId, row.client_id, fallbackUserId],
      );
      extensionRequestIds.push(Number(inserted.rows[0].id));
    }

    const requiredVotes = extensionRequestIds.length;
    await client.query(
      `
        UPDATE plan
        SET extension_status = 1,
            extension_required_votes = $2,
            extension_received_votes = 0,
            extension_rejected_by = NULL,
            extension_date = NULL,
            replacement_plan_id = NULL,
            replacement_of = NULL
        WHERE id = $1
      `,
      [planId, requiredVotes],
    );

    await client.query('COMMIT');
    return { extensionRequestIds, requiredVotes };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

export const getExtensionRequestIdsByClient = async ({
  getDbPool,
  planId,
  clientIds,
}: {
  getDbPool: GetDbPool;
  planId: string;
  clientIds: string[];
}): Promise<number[]> => {
  const pool = getDbPool();
  try {
    const result = await pool.query(
      `
        SELECT id
        FROM plan_extension_requests
        WHERE plan_id = $1
          AND client_id = ANY($2::text[])
        ORDER BY id ASC
      `,
      [planId, clientIds],
    );
    if (result.rowCount === 0) {
      throw new Error(`No plan extension requests found for plan ${planId} and clients [${clientIds.join(', ')}]`);
    }
    return result.rows.map((row: { id: number }) => Number(row.id));
  } finally {
    await pool.end();
  }
};

export const readPlanExtensionStateByDb = async ({
  getDbPool,
  planId,
}: {
  getDbPool: GetDbPool;
  planId: string;
}): Promise<ExtensionPlanSnapshot> => {
  const pool = getDbPool();
  try {
    const result = await pool.query(
      `
        SELECT
          id,
          to_char(plan_end_date::date, 'YYYY-MM-DD') AS plan_end_date,
          extension_status,
          extension_required_votes,
          extension_received_votes,
          to_char(extension_date::date, 'YYYY-MM-DD') AS extension_date,
          replacement_plan_id,
          replacement_of
        FROM plan
        WHERE id = $1
      `,
      [planId],
    );

    if (result.rowCount !== 1) {
      throw new Error(`Could not load plan ${planId} from DB`);
    }

    const row = result.rows[0];
    return {
      id: Number(row.id),
      planEndDate: String(row.plan_end_date),
      extensionStatus: row.extension_status === null ? null : Number(row.extension_status),
      extensionRequiredVotes: row.extension_required_votes === null ? null : Number(row.extension_required_votes),
      extensionReceivedVotes: row.extension_received_votes === null ? null : Number(row.extension_received_votes),
      extensionDate: row.extension_date ? String(row.extension_date) : null,
      replacementPlanId: row.replacement_plan_id === null ? null : Number(row.replacement_plan_id),
      replacementOf: row.replacement_of === null ? null : Number(row.replacement_of),
    };
  } finally {
    await pool.end();
  }
};
