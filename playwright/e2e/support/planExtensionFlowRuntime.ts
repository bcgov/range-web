import { type APIRequestContext } from '@playwright/test';

export type ExtensionPlanDto = {
  id: number;
  agreementId: string;
  planEndDate: string;
  extensionStatus: number | null;
  extensionRequiredVotes: number | null;
  extensionReceivedVotes: number | null;
  extensionDate?: string | null;
  replacementPlanId?: number | null;
  replacementOf?: number | null;
};

export type ApiActor = {
  token: string;
  roleCode: 'SA' | 'AH' | 'DM';
};

const authHeaders = (token: string) => ({ Authorization: `Bearer ${token}` });

type ApiResponseLike = {
  ok: () => boolean;
  status: () => number;
  text: () => Promise<string>;
};

const RETRYABLE_STATUS_CODES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

const isRetryableError = (statusCode: number): boolean => RETRYABLE_STATUS_CODES.has(statusCode);

const sleep = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const assertOk = async (response: ApiResponseLike, context: string) => {
  if (response.ok()) {
    return;
  }
  const body = await response.text();
  throw new Error(`${context} failed (${response.status()}): ${body}`);
};

const withApiRetry = async <T>({
  operation,
  context,
  retries = 3,
  delayMs = 400,
}: {
  operation: () => Promise<T>;
  context: string;
  retries?: number;
  delayMs?: number;
}): Promise<T> => {
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    try {
      return await operation();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const statusMatch = message.match(/\((\d{3})\)/);
      const statusCode = statusMatch ? Number(statusMatch[1]) : null;
      const retryable = statusCode !== null ? isRetryableError(statusCode) : false;
      if (!retryable || attempt === retries) {
        throw error;
      }
      lastError = error as Error;
      await sleep(delayMs * (attempt + 1));
      attempt += 1;
    }
  }

  throw lastError || new Error(`${context} failed after retries`);
};

export const fetchPlanById = async ({
  apiContext,
  token,
  getApiBaseUrl,
  planId,
}: {
  apiContext: APIRequestContext;
  token: string;
  getApiBaseUrl: () => string;
  planId: string;
}): Promise<ExtensionPlanDto> => {
  return withApiRetry({
    context: `fetch plan ${planId}`,
    operation: async () => {
      const response = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
        headers: authHeaders(token),
      });
      await assertOk(response, `fetch plan ${planId}`);
      return (await response.json()) as ExtensionPlanDto;
    },
  });
};

export const approveExtensionVote = async ({
  apiContext,
  token,
  getApiBaseUrl,
  planId,
  extensionRequestId,
}: {
  apiContext: APIRequestContext;
  token: string;
  getApiBaseUrl: () => string;
  planId: string;
  extensionRequestId: number;
}): Promise<void> => {
  await withApiRetry({
    context: `approve extension vote plan=${planId}`,
    operation: async () => {
      const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/approve`, {
        headers: authHeaders(token),
        data: { extensionRequestId },
      });
      await assertOk(response, `approve extension vote plan=${planId}`);
      return undefined;
    },
  });
};

export const rejectExtensionVote = async ({
  apiContext,
  token,
  getApiBaseUrl,
  planId,
  extensionRequestId,
}: {
  apiContext: APIRequestContext;
  token: string;
  getApiBaseUrl: () => string;
  planId: string;
  extensionRequestId: number;
}): Promise<{ extensionStatus: number }> => {
  return withApiRetry({
    context: `reject extension vote plan=${planId}`,
    operation: async () => {
      const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/reject`, {
        headers: authHeaders(token),
        data: { extensionRequestId },
      });
      await assertOk(response, `reject extension vote plan=${planId}`);
      return (await response.json()) as { extensionStatus: number };
    },
  });
};

export const forwardExtensionForDecision = async ({
  apiContext,
  token,
  getApiBaseUrl,
  planId,
}: {
  apiContext: APIRequestContext;
  token: string;
  getApiBaseUrl: () => string;
  planId: string;
}): Promise<void> => {
  await withApiRetry({
    context: `forward extension request plan=${planId}`,
    operation: async () => {
      const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/request`, {
        headers: authHeaders(token),
        data: {},
      });
      await assertOk(response, `forward extension request plan=${planId}`);
      return undefined;
    },
  });
};

export const extendPlan = async ({
  apiContext,
  token,
  getApiBaseUrl,
  planId,
  endDate,
}: {
  apiContext: APIRequestContext;
  token: string;
  getApiBaseUrl: () => string;
  planId: string;
  endDate: string;
}): Promise<{ planId: number }> => {
  return withApiRetry({
    context: `extend plan ${planId}`,
    operation: async () => {
      const response = await apiContext.put(
        `${getApiBaseUrl()}/v1/plan/${planId}/extension/extend?endDate=${endDate}`,
        {
          headers: authHeaders(token),
          data: {},
        },
      );
      await assertOk(response, `extend plan ${planId}`);
      return (await response.json()) as { planId: number };
    },
  });
};

export const createReplacementPlan = async ({
  apiContext,
  token,
  getApiBaseUrl,
  planId,
}: {
  apiContext: APIRequestContext;
  token: string;
  getApiBaseUrl: () => string;
  planId: string;
}): Promise<{ replacementPlan: { id: number } }> => {
  return withApiRetry({
    context: `create replacement plan for ${planId}`,
    operation: async () => {
      const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/createReplacementPlan`, {
        headers: authHeaders(token),
        data: {},
      });
      await assertOk(response, `create replacement plan for ${planId}`);
      return (await response.json()) as { replacementPlan: { id: number } };
    },
  });
};
