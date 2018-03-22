export const SSO_BASE_URL = "https://dev-sso.pathfinder.gov.bc.ca/";
export const SSO_REALM_NAME = "mobile";
export const SSO_BASE_AUTH_ENDPOINT = `${SSO_BASE_URL}auth/realms/mobile/protocol/openid-connect/auth`;
export const SSO_CLIENT_ID = "range-test";
export const SSO_REDIRECT_URI = `${window.location.origin}/login`;

export const SSO_AUTH_ENDPOINT = SSO_BASE_AUTH_ENDPOINT
  + "?response_type=code"
  + `&client_id=${SSO_CLIENT_ID}`
  + `&redirect_uri=${SSO_REDIRECT_URI}`;

export const GET_TOKEN = `auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`;
export const REFRESH_TOKEN = `auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`

export const BASE_URL = 'http://api-range-myra-dev.pathfinder.gov.bc.ca/v1';
export const AGREEMENT = '/agreement';
export const REFERENCES = '/reference';
export const CLIENT = '/client';
export const STATUS = '/status';
export const ZONE = '/zone';