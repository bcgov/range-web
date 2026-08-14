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

const assertOk = async (response: ApiResponseLike, context: string) => {
  if (response.ok()) {
    return;
  }
  const body = await response.text();
  throw new Error(`${context} failed (${response.status()}): ${body}`);
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
  const response = await apiContext.get(`${getApiBaseUrl()}/v1/plan/${planId}`, {
    headers: authHeaders(token),
  });
  await assertOk(response, `fetch plan ${planId}`);
  return (await response.json()) as ExtensionPlanDto;
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
  const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/approve`, {
    headers: authHeaders(token),
    data: { extensionRequestId },
  });
  await assertOk(response, `approve extension vote plan=${planId}`);
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
  const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/reject`, {
    headers: authHeaders(token),
    data: { extensionRequestId },
  });
  await assertOk(response, `reject extension vote plan=${planId}`);
  return (await response.json()) as { extensionStatus: number };
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
  const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/request`, {
    headers: authHeaders(token),
    data: {},
  });
  await assertOk(response, `forward extension request plan=${planId}`);
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
  const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/extend?endDate=${endDate}`, {
    headers: authHeaders(token),
    data: {},
  });
  await assertOk(response, `extend plan ${planId}`);
  return (await response.json()) as { planId: number };
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
  const response = await apiContext.put(`${getApiBaseUrl()}/v1/plan/${planId}/extension/createReplacementPlan`, {
    headers: authHeaders(token),
    data: {},
  });
  await assertOk(response, `create replacement plan for ${planId}`);
  return (await response.json()) as { replacementPlan: { id: number } };
};
