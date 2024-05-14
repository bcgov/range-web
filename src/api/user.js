import * as API from '../constants/api';
import { getAuthHeaderConfig, axios } from '../utils';

export const createClientLink = async (userId, clientNumber) => {
  return axios.post(
    API.CREATE_USER_CLIENT_LINK(userId),
    { clientId: clientNumber },
    getAuthHeaderConfig(),
  );
};

export const deleteClientLink = async (userId, clientNumber) => {
  return axios.delete(
    API.DELETE_USER_CLIENT_LINK(userId, clientNumber),
    getAuthHeaderConfig(),
  );
};

export const mergeAccounts = async (sourceAccountIds, destinationAccountId) => {
  return axios.post(
    API.MERGE_ACCOUNTS(destinationAccountId),
    { accountIds: sourceAccountIds },
    getAuthHeaderConfig(),
  );
};

export const assignRole = async (userId, roleId) => {
  return axios.post(
    API.ASSIGN_ROLE(userId),
    { roleId: roleId },
    getAuthHeaderConfig(),
  )
}

export const assignDistrict = async (userId, districtId) => {
  return axios.post(
    API.ASSIGN_DISTRICT(userId),
    { districtId: districtId },
    getAuthHeaderConfig(),
  )
}

export const assignDistricts = async (userId, districtIds) => {
  return axios.post(
    API.ASSIGN_DISTRICTS(userId),
    { districtIds: districtIds },
    getAuthHeaderConfig(),
  )
}