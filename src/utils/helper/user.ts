import { USER_ROLE } from '../../constants/variables';
import { capitalize } from '../index';

export const doesUserHaveFullName = (user: any): boolean => {
  const { givenName, familyName } = user || {};
  if (givenName && familyName) {
    return true;
  }
  if (givenName && !familyName) {
    return true;
  }

  return false;
};

export const getUserFullName = (user: any): string => {
  const { givenName, familyName, username } = user || {};
  if (givenName && familyName) {
    return `${capitalize(givenName)} ${capitalize(familyName)}`;
  }
  if (givenName) {
    return capitalize(givenName);
  }

  return username;
};

export const getUserRole = (user: any): string => {
  const { roleId } = user || {};
  if (roleId) {
    return (USER_ROLE as any)[roleId];
  }
  return 'No role in database yet';
};

export const getUserRoleObj = (user: any): { id: number; description: string } => {
  const { roleId } = user || {};
  if (roleId) {
    return {
      id: roleId,
      description: (USER_ROLE as any)[roleId],
    };
  }
  return {
    id: -1,
    description: 'No role in database yet',
  };
};

export const getUserEmail = (user: any): string | undefined => user && user.email;

const getUserFamilyName = (user: any): string | undefined => user && user.familyName && capitalize(user.familyName);

const getUserGivenName = (user: any): string | undefined => user && user.givenName && capitalize(user.givenName);

export const getUserInitial = (user: any): string => {
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

export const isUserAdmin = (user: any): boolean => user && user.roleId && user.roleId === 1;

export const isUserReadOnly = (user: any): boolean => user && user.roleId && user.roleId === 5;

export const isUserAuditor = (user: any): boolean => user && user.roleId && user.roleId === 5;

export const isUserAgrologist = (user: any): boolean => user && user.roleId && user.roleId === 3;

export const isUserStaff = (user: any): boolean => isUserAdmin(user) || isUserAgrologist(user);

export const isUserAgreementHolder = (user: any): boolean => user && user.roleId && user.roleId === 4;

export const isUserDecisionMaker = (user: any): boolean => user && user.roleId && user.roleId === 2;

export const canManageClients = (user: any): any =>
  user && user.permissions && user.permissions.find((p: any) => p.id === 8);

export const canManageEmails = (user: any): any =>
  user && user.permissions && user.permissions.find((p: any) => p.id === 9);

export const canAssignRoles = (user: any): any =>
  user && user.permissions && user.permissions.find((p: any) => p.id === 11);

export const canReadAll = (user: any): any =>
  user && user.permissions && user.permissions.find((p: any) => p.id === 1);
