import { USER_ROLE } from '../../constants/variables';
import { capitalize } from '../index';

export const doesUserHaveFullName = (user) => {
  const { givenName, familyName } = user || {};
  if (givenName && familyName) {
    return true;
  }

  return false;
};

export const getUserFullName = (user) => {
  const { givenName, familyName, username } = user || {};
  if (doesUserHaveFullName(user)) {
    return `${capitalize(givenName)} ${capitalize(familyName)}`;
  }

  return username;
};

export const getUserEmail = (user) => user && user.email;

const getUserFamilyName = (user) =>
  user && user.familyName && capitalize(user.familyName);

const getUserGivenName = (user) =>
  user && user.givenName && capitalize(user.givenName);

export const getUserInitial = (user) => {
  const familyName = getUserFamilyName(user);
  const givenName = getUserGivenName(user);

  if (
    familyName &&
    givenName &&
    typeof familyName === 'string' &&
    typeof givenName === 'string'
  ) {
    return givenName.charAt(0) + familyName.charAt(0);
  }

  return 'NP';
};

export const isUserActive = (user) => user && user.active;

export const isUserAdmin = user =>
  user && user.roleId && user.roleId === 1;

export const isUserReadOnly = user =>
  user && user.roleId && user.roleId === 5;

export const isUserAgrologist = user =>
  user && user.roleId && user.roleId === 3;

export const isUserStaff = user => isUserAdmin(user) || isUserAgrologist(user)

export const isUserAgreementHolder = user =>
user && user.roleId && user.roleId === 4;

export const isUserDecisionMaker = user =>
user && user.roleId && user.roleId === 2;

export const DoesUserHaveRole = user =>
  isUserAdmin(user) || isUserAgrologist(user) || isUserAgreementHolder(user)

export const canManageClients = user =>
  user && user.permissions && user.permissions.find(p => p.id === 8);

export const canManageEmails = user =>
  user && user.permissions && user.permissions.find(p => p.id === 9);

export const canAssignRoles = user =>
  user && user.permissions && user.permissions.find(p => p.id === 11);

export const canReadAll = user =>
  user && user.permissions && user.permissions.find(p => p.id === 1);