import { CLIENT_TYPE } from '../../constants/variables';
import { NOT_PROVIDED } from '../../constants/strings';
import { capitalize } from '..';
import { PlanConfirmation } from '../../types';

interface ClientLike {
  clientTypeCode?: string;
  id?: string;
  clientNumber?: string;
}

export interface UserLike {
  id?: number;
  clients?: { clientNumber?: string }[];
}

interface ClientAgreementLike {
  agentId?: number;
  clientId?: string;
}

export const getAgreementHolders = (
  clients: ClientLike[] = [],
): { primaryAgreementHolder: ClientLike; otherAgreementHolders: ClientLike[] } => {
  let primaryAgreementHolder: ClientLike = {} as ClientLike;
  const otherAgreementHolders: ClientLike[] = [];
  clients.forEach((client) => {
    if (client.clientTypeCode === CLIENT_TYPE.PRIMARY) {
      primaryAgreementHolder = client;
    } else if (client.clientTypeCode === CLIENT_TYPE.OTHER) {
      otherAgreementHolders.push(client);
    }
  });

  return { primaryAgreementHolder, otherAgreementHolders };
};

export const isSingleClient = (clients: unknown[] = []): boolean => {
  return clients.length === 1;
};

export const isClientCurrentUser = (
  client: ClientLike | null | undefined,
  user: UserLike | null | undefined,
): boolean => {
  if (client && user) {
    return (user.clients || []).some((c) => c.clientNumber === client.id);
  }

  return false;
};

export const isAgent = (
  clientAgreements: ClientAgreementLike[] | null | undefined,
  user: UserLike | null | undefined,
  client: ClientLike | null | undefined,
): boolean => {
  if (!user || !client || !clientAgreements) return false;

  const agencyAgreements = clientAgreements.filter((a) => a.agentId === user.id);
  const result = !!agencyAgreements.find((ca) => ca.clientId === client.clientNumber);

  return result;
};

export const findConfirmationWithClientNumber = (
  clientNumber: string | undefined,
  confirmations: Partial<PlanConfirmation>[] | undefined,
): Partial<PlanConfirmation> | undefined => {
  if (clientNumber && confirmations) {
    return confirmations.find((confirmation) => confirmation.clientId === clientNumber);
  }
  return undefined;
};

export const findConfirmationsWithUser = (
  user: UserLike,
  confirmations: Partial<PlanConfirmation>[],
  clientAgreements: ClientAgreementLike[],
): Partial<PlanConfirmation>[] => {
  const { clients = [] } = user;

  const agencyAgreements = clientAgreements.filter((ca) => ca.agentId === user.id);

  const linkedConfirmations = confirmations.filter(
    (confirmation) =>
      clients.some((client) => client.clientNumber === confirmation.clientId) ||
      agencyAgreements.some((a) => a.clientId === confirmation.clientId),
  );

  return linkedConfirmations;
};

export const getClientFullName = (contact: { name?: string } | null | undefined): string => {
  if (contact && contact.name) {
    const array = contact.name.split(' ').map((string) => capitalize(string.toLowerCase()));

    return array.join(' ');
  }

  return NOT_PROVIDED;
};
