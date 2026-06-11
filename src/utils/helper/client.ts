import { CLIENT_TYPE } from '../../constants/variables';
import { NOT_PROVIDED } from '../../constants/strings';
import { capitalize } from '..';

interface ClientLike {
  clientTypeCode?: string;
  id?: string;
  clientNumber?: string;
  [key: string]: any;
}

interface UserLike {
  id?: number;
  clients?: { clientNumber?: string }[];
  [key: string]: any;
}

interface ClientAgreementLike {
  agentId?: number;
  clientId?: string;
  [key: string]: any;
}

interface ConfirmationLike {
  clientId?: string;
  confirmed?: boolean;
  [key: string]: any;
}

export const getAgreementHolders = (
  clients: ClientLike[] = [],
): { primaryAgreementHolder: ClientLike; otherAgreementHolders: ClientLike[] } => {
  let primaryAgreementHolder: ClientLike = {};
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

export const isSingleClient = (clients: any[] = []): boolean => {
  return clients.length === 1;
};

export const isClientCurrentUser = (client: ClientLike | null | undefined, user: UserLike | null | undefined): boolean => {
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
  confirmations: ConfirmationLike[] | undefined,
): ConfirmationLike | undefined => {
  if (clientNumber && confirmations) {
    return confirmations.find((confirmation) => confirmation.clientId === clientNumber);
  }
  return undefined;
};

export const findConfirmationsWithUser = (
  user: UserLike,
  confirmations: ConfirmationLike[],
  clientAgreements: ClientAgreementLike[],
): ConfirmationLike[] => {
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
