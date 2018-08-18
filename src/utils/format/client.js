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
