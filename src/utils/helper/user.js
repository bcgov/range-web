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

export const isUserAdmin = (user) =>
  user && user.roles && user.roles.indexOf(USER_ROLE.ADMINISTRATOR) >= 0;

export const isUserRangeOfficer = (user) =>
  user && user.roles && user.roles.indexOf(USER_ROLE.RANGE_OFFICER) >= 0;

export const isUserStaff = (user) =>
  isUserAdmin(user) || isUserRangeOfficer(user);

export const isUserAgreementHolder = (user) =>
  user && user.roles && user.roles.indexOf(USER_ROLE.AGREEMENT_HOLDER) >= 0;

export const isUserDecisionMaker = (user) =>
  user && user.roles && user.roles.indexOf(USER_ROLE.DECISION_MAKER) >= 0;

export const DoesUserHaveRole = (user) =>
  isUserAdmin(user) || isUserRangeOfficer(user) || isUserAgreementHolder(user);
