export const SSO_BASE_URL = 'https://dev-sso.pathfinder.gov.bc.ca';
export const SSO_REALM_NAME = 'mobile';
export const SSO_BASE_AUTH_ENDPOINT = `${SSO_BASE_URL}/auth/realms/mobile/protocol/openid-connect`;
export const SSO_CLIENT_ID = 'range-test';
export const SSO_LOGIN_REDIRECT_URI = `${window.location.origin}/return-page?type=login`;
export const SSO_LOGIN_ENDPOINT = `${SSO_BASE_AUTH_ENDPOINT}/auth?response_type=code&client_id=${SSO_CLIENT_ID}&redirect_uri=${SSO_LOGIN_REDIRECT_URI}`;
export const SSO_IDIR_LOGIN_ENDPOINT = `${SSO_LOGIN_ENDPOINT}&kc_idp_hint=idir`;
export const SSO_BCEID_LOGIN_ENDPOINT = `${SSO_LOGIN_ENDPOINT}&kc_idp_hint=bceid`;

export const SSO_LOGOUT_REDIRECT_URI = `${window.location.origin}/return-page?type=logout`;
export const SSO_LOGOUT_ENDPOINT = `${SSO_BASE_AUTH_ENDPOINT}/logout?redirect_uri=${SSO_LOGOUT_REDIRECT_URI}`;
export const SITEMINDER_LOGOUT_REDIRECT_URI = `${window.location.origin}/return-page?type=smlogout`;
export const SITEMINDER_LOGOUT_ENDPOINT = `https://logontest.gov.bc.ca/clp-cgi/logoff.cgi?returl=${SITEMINDER_LOGOUT_REDIRECT_URI}&retnow=1`;

export const GET_TOKEN_FROM_SSO = `/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`;
export const REFRESH_TOKEN_FROM_SSO = `/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`;

// const DEV_API_BASE_URL = 'http://web-range-myra-dev.pathfinder.gov.bc.ca/api/v1';
// const DEV_API_BASE_URL = 'https://web-range-myra-test.pathfinder.gov.bc.ca/api/v1';
export const DEV_API_BASE_URL = 'http://localhost:8000/api/v1';
// const DEV_API_BASE_URL = 'http://10.10.10.191:8000/api/v1';

export const API_BASE_URL = (process.env.NODE_ENV === 'production')
  ? `${window.location.origin}/api/v1`
  : DEV_API_BASE_URL;

export const SEARCH_AGREEMENTS = 'agreement/search';
export const GET_REFERENCES = '/reference';
export const GET_ZONES = '/zone';
export const GET_USERS = '/user';
export const SEARCH_CLIENTS = '/client/search';
export const GET_USER_PROFILE = '/user/me';

export const GET_AGREEMENT = agreementId => `/agreement/${agreementId}`;
export const GET_RUP = planId => `/plan/${planId}`;
export const UPDATE_USER_ID_OF_ZONE = zoneId => `/zone/${zoneId}/user`;
export const UPDATE_PLAN_STATUS = planId => `/plan/${planId}/status`;
export const UPDATE_RUP_ZONE = agreementId => `/agreement/${agreementId}/zone`;
export const GET_RUP_PDF = planId => `/report/${planId}`;
export const CREATE_RUP_SCHEDULE = planId => `/plan/${planId}/schedule`;
export const UPDATE_RUP_SCHEDULE = (planId, scheduleId) => `/plan/${planId}/schedule/${scheduleId}`;
export const DELETE_RUP_SCHEDULE = (planId, scheduleId) => `/plan/${planId}/schedule/${scheduleId}`;
export const DELETE_RUP_SCHEDULE_ENTRY = (planId, scheduleId, entryId) => `/plan/${planId}/schedule/${scheduleId}/entry/${entryId}`;
export const UPDATE_CLIENT_ID_OF_USER = (userId, clientId) => `/user/${userId}/client/${clientId}`;
