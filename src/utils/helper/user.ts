import { USER_ROLE } from '../../constants/variables';
import { capitalize } from '../index';
import { User } from '../../types';

export const doesUserHaveFullName = (user: Partial<User> | undefined): boolean => {
  const { givenName, familyName } = user || {};
  if (givenName && familyName) {
    return true;
  }
  if (givenName && !familyName) {
    return true;
  }

  return false;
};

export const getUserFullName = (user: Partial<User> | undefined): string => {
  const { givenName, familyName, username } = user || {};
  if (givenName && familyName) {
    return `${capitalize(givenName)} ${capitalize(familyName)}`;
  }
  if (givenName) {
    return capitalize(givenName);
  }

  return username || '';
};

export const getUserRole = (user: Partial<User> | undefined): string => {
  const { roleId } = user || {};
  if (roleId) {
    return USER_ROLE[roleId as keyof typeof USER_ROLE];
  }
  return 'No role in database yet';
};

export const getUserRoleObj = (user: Partial<User> | undefined): { id: number; description: string } => {
  const { roleId } = user || {};
  if (roleId) {
    return {
      id: roleId,
      description: USER_ROLE[roleId as keyof typeof USER_ROLE],
    };
  }

  return {
    id: -1,
    description: 'No role in database yet',
  };
};

export const getUserEmail = (user: Partial<User> | undefined): string | null | undefined => user && user.email;

const getUserFamilyName = (user: Partial<User> | undefined): string | undefined =>
  (user && user.familyName && capitalize(user.familyName)) || undefined;

const getUserGivenName = (user: Partial<User> | undefined): string | undefined =>
  (user && user.givenName && capitalize(user.givenName)) || undefined;

export const getUserInitial = (user: Partial<User> | undefined): string => {
  const familyName = getUserFamilyName(user);
  const givenName = getUserGivenName(user);

  if (familyName && givenName && typeof familyName === 'string' && typeof givenName === 'string') {
    return givenName.charAt(0) + familyName.charAt(0);
  }

  if (givenName && typeof givenName === 'string') {
    return givenName.substring(0, 2).toUpperCase();
  }

  return 'NP';
};

export const isUserAdmin = (user: Partial<User> | undefined): boolean => !!(user && user.roleId && user.roleId === 1);

export const isUserReadOnly = (user: Partial<User> | undefined): boolean =>
  !!(user && user.roleId && user.roleId === 5);

export const isUserAuditor = (user: Partial<User> | undefined): boolean => !!(user && user.roleId && user.roleId === 5);

export const isUserAgrologist = (user: Partial<User> | undefined): boolean =>
  !!(user && user.roleId && user.roleId === 3);

export const isUserStaff = (user: Partial<User> | undefined): boolean => isUserAdmin(user) || isUserAgrologist(user);

export const isUserAgreementHolder = (user: Partial<User> | undefined): boolean =>
  !!(user && user.roleId && user.roleId === 4);

export const isUserDecisionMaker = (user: Partial<User> | undefined): boolean =>
  !!(user && user.roleId && user.roleId === 2);

export const canManageClients = (user: Partial<User> | undefined): { id: number } | undefined =>
  user && user.permissions && user.permissions.find((p: { id: number }) => p.id === 8);

export const canManageEmails = (user: Partial<User> | undefined): { id: number } | undefined =>
  user && user.permissions && user.permissions.find((p: { id: number }) => p.id === 9);

export const canAssignRoles = (user: Partial<User> | undefined): { id: number } | undefined =>
  user && user.permissions && user.permissions.find((p: { id: number }) => p.id === 11);

export const canReadAll = (user: Partial<User> | undefined): { id: number } | undefined =>
  user && user.permissions && user.permissions.find((p: { id: number }) => p.id === 1);
