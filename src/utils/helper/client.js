import { CLIENT_TYPE } from '../../constants/variables';

/* eslint-disable import/prefer-default-export */
export const getAgreementHolders = (clients = []) => {
  let primaryAgreementHolder = {};
  const otherAgreementHolders = [];
  clients.forEach((client) => {
    if (client.clientTypeCode === CLIENT_TYPE.PRIMARY) {
      primaryAgreementHolder = client;
    } else if (client.clientTypeCode === CLIENT_TYPE.OTHER) {
      otherAgreementHolders.push(client);
    }
  });

  return { primaryAgreementHolder, otherAgreementHolders };
};

export const isSingleClient = (clients = []) => {
  return clients.length === 1;
};

export const isClientTheUser = (client, user) => {
  if (client && user) {
    return user.clientId === client.id;
  }

  return false;
};

export const findConfirmationWithClientId = (clientId, confirmations, confirmationsMap) => {
  if (clientId && confirmations && confirmationsMap) {
    return confirmations.map(cId => confirmationsMap[cId])
      .find(confirmation => confirmation.clientId === clientId);
  }
  return undefined;
};
