import * as API from '../constants/api';
import { getAuthHeaderConfig, axios } from '../utils';

export const createClientLink = async (userId: string | number, clientNumber: string): Promise<any> => {
  return axios.post(API.CREATE_USER_CLIENT_LINK(userId), { clientId: clientNumber }, getAuthHeaderConfig());
};

export const deleteClientLink = async (userId: string | number, clientNumber: string): Promise<any> => {
  return axios.delete(API.DELETE_USER_CLIENT_LINK(userId, clientNumber), getAuthHeaderConfig());
};

export const mergeAccounts = async (sourceAccountIds: (string | number)[], destinationAccountId: string | number): Promise<any> => {
  return axios.post(API.MERGE_ACCOUNTS(destinationAccountId), { accountIds: sourceAccountIds }, getAuthHeaderConfig());
};

export const assignRole = async (userId: string | number, roleId: number): Promise<any> => {
  return axios.post(API.ASSIGN_ROLE(userId), { roleId: roleId }, getAuthHeaderConfig());
};

export const assignDistricts = async (userId: string | number, districts: any[]): Promise<any> => {
  return axios.post(API.ASSIGN_DISTRICTS(userId), { districts: districts }, getAuthHeaderConfig());
};
