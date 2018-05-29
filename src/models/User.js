import { ADMINISTRATOR, AGREEMENT_HOLDER, RANGE_OFFICER } from '../constants/variables';

class User {
  constructor(u) {
    this.id = u && u.id;
    this.active = u && u.active;
    this.clientId = u && u.clientId;
    this.email = u && u.email;
    this.familyName = u && u.familyName;
    this.givenName = u && u.givenName;
    this.lastLoginAt = u && u.lastLoginAt;
    this.phone = u && u.phone;
    this.roles = u && u.roles;
    this.username = u && u.username;
  }

  get fullName() {
    return this.givenName && this.familyName && `${this.givenName} ${this.familyName}`;
  }

  get isAdmin() {
    return this.roles && (this.roles.indexOf(ADMINISTRATOR) >= 0);
  }

  get isRangeOfficer() {
    return this.roles && (this.roles.indexOf(RANGE_OFFICER) >= 0);
  }

  get isAgreementHolder() {
    return this.roles && (this.roles.indexOf(AGREEMENT_HOLDER) >= 0);
  }

  get initial() {
    let initial = 'NP';
    const { familyName, givenName } = this;
    if (familyName && givenName && typeof familyName === 'string' && typeof givenName === 'string') {
      initial = givenName.charAt(0) + familyName.charAt(0);
    }

    return initial;
  }
}

export default User;
