/**
 * A system user — may be a Range Officer, Agreement Holder, Decision Maker, or Admin.
 */
export interface User {
  id: number;
  username: string;
  givenName: string | null;
  familyName: string | null;
  email: string | null;
  phoneNumber: string | null;
  active: boolean | null;
  piaSeen: boolean | null;
  lastLoginAt: string | null;
  ssoId: string | null;
  roleId: number | null;
  clientNumber: string | null;
  createdAt?: string;
  updatedAt?: string;
  roles?: string[];
  permissions?: { id: number }[];
  clients?: Client[];
}

/**
 * A client linked to a user (Agreement Holder).
 */
export interface Client {
  id: string;
  locationCodes: string[];
  name: string;
  clientTypeCode: string;
  startDate: string | null;
  endDate: string | null;
  email: string | null;
  userGivenName: string | null;
  userFamilyName: string | null;
}
