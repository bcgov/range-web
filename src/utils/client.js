import { CLIENT_TYPE } from '../constants/variables';

/* eslint-disable import/prefer-default-export */
export const getPrimaryAgreementHolder = (clients = []) => {
  let primaryAgreementHolder = {};
  clients.forEach((client) => {
    if (client.clientTypeCode === CLIENT_TYPE.PRIMARY) {
      primaryAgreementHolder = client;
    }
  });

  return primaryAgreementHolder;
};
