import { USER_ROLE } from '../../constants/variables';

export const getUserFullName = user => (
  user && user.givenName && user.familyName && `${user.givenName} ${user.familyName}`
);

export const getUserEmail = user => (
  user && user.email
);

const getUserFamilyName = user => (
  user && user.familyName &&
    (user.familyName.toUpperCase() + user.familyName.slice(1))
);

const getUserGivenName = user => (
  user && user.givenName &&
    (user.givenName.toUpperCase() + user.givenName.slice(1))
);

export const getUserInitial = (user) => {
  const familyName = getUserFamilyName(user);
  const givenName = getUserGivenName(user);

  if (familyName && givenName && typeof familyName === 'string' && typeof givenName === 'string') {
    return givenName.charAt(0) + familyName.charAt(0);
  }

  return 'NP';
};

export const isUserActive = user => user && user.active;

export const isUserAdmin = user => (
  user && user.roles && (user.roles.indexOf(USER_ROLE.ADMINISTRATOR) >= 0)
);

export const isUserRangeOfficer = user => (
  user && user.roles && (user.roles.indexOf(USER_ROLE.RANGE_OFFICER) >= 0)
);

export const isUserStaff = user => (
  isUserAdmin(user) || isUserRangeOfficer(user)
);

export const isUserAgreementHolder = user => (
  user && user.roles && (user.roles.indexOf(USER_ROLE.AGREEMENT_HOLDER) >= 0)
);

export const DoesUserHaveRole = user => (
  (isUserAdmin(user) || isUserRangeOfficer(user) || isUserAgreementHolder(user))
);
