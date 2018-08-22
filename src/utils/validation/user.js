import { USER_ROLE } from '../../constants/variables';

export const isUserActive = user => user && user.active;

export const isUserAdmin = user => (
  user && user.roles && (user.roles.indexOf(USER_ROLE.ADMINISTRATOR) >= 0)
);

export const isUserRangeOfficer = user => (
  user && user.roles && (user.roles.indexOf(USER_ROLE.RANGE_OFFICER) >= 0)
);

export const isUserAgreementHolder = user => (
  user && user.roles && (user.roles.indexOf(USER_ROLE.AGREEMENT_HOLDER) >= 0)
);

export const userHaveRole = user => (
  (isUserAdmin(user) || isUserRangeOfficer(user) || isUserAgreementHolder(user))
);