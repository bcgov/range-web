export const SSO_BASE_URL = 'https://dev-sso.pathfinder.gov.bc.ca';
export const SSO_REALM_NAME = 'mobile';
export const SSO_BASE_AUTH_ENDPOINT = `${SSO_BASE_URL}/auth/realms/mobile/protocol/openid-connect`;
export const SSO_CLIENT_ID = 'range-test';
export const SSO_LOGIN_REDIRECT_URI = `${window.location.origin}/login`;
export const SSO_LOGOUT_REDIRECT_URI = `${window.location.origin}/logout`;

export const SSO_AUTH_LOGIN_ENDPOINT = `${SSO_BASE_AUTH_ENDPOINT}/auth?response_type=code&client_id=${SSO_CLIENT_ID}&redirect_uri=${SSO_LOGIN_REDIRECT_URI}`;
export const SSO_AUTH_LOGOUT_ENDPOINT = `${SSO_BASE_AUTH_ENDPOINT}/logout?redirect_uri=${SSO_LOGOUT_REDIRECT_URI}`;

export const GET_TOKEN = `/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`;
export const REFRESH_TOKEN = `/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`;
export const LOGOUT = `/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/logout`;

const DEV_BASE_URL = 'http://web-range-myra-dev.pathfinder.gov.bc.ca/api/v1';
// const DEV_BASE_URL = 'http://localhost:8000/api/v1';
// const DEV_BASE_URL = 'http://10.10.10.74:8000/api/v1';

export const BASE_URL = (process.env.NODE_ENV === 'production')
  ? `${window.location.origin}/api/v1`
  : DEV_BASE_URL;

export const AGREEMENT = '/agreement';
export const REFERENCES = '/reference';
export const CLIENT = '/client';
export const PLAN = '/plan';
export const STATUS = '/status';
export const ZONE = '/zone';
export const REPORT = '/report';
export const USER = '/user';
export const SCHEDULE = '/schedule';
export const ME = '/me';
