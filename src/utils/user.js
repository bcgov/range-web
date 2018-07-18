import { USER_ROLE } from '../constants/variables';

export const getUserFullName = user => (
  user && user.givenName && user.familyName && `${user.givenName} ${user.familyName}`
);

export const isUserActive = user => user && user.active;

export const isUserAdmin = user => (
  user.roles && (user.roles.indexOf(USER_ROLE.ADMINISTRATOR) >= 0)
);

export const isUserRangeOfficer = user => (
  user.roles && (user.roles.indexOf(USER_ROLE.RANGE_OFFICER) >= 0)
);

export const isUserAgreementHolder = user => (
  user.roles && (user.roles.indexOf(USER_ROLE.AGREEMENT_HOLDER) >= 0)
);

export const userHaveRole = user => (
  isUserAdmin(user) || isUserRangeOfficer(user) || isUserAgreementHolder(user)
);

export const getUserInitial = (user) => {
  let initial = 'NP';
  const { familyName, givenName } = user || {};
  if (familyName && givenName && typeof familyName === 'string' && typeof givenName === 'string') {
    initial = givenName.charAt(0) + familyName.charAt(0);
  }

  return initial;
};
