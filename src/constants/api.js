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
// const DEV_BASE_URL = 'https://web-range-myra-test.pathfinder.gov.bc.ca/api/v1';
// const DEV_BASE_URL = 'http://localhost:8000/api/v1';
// const DEV_BASE_URL = 'http://10.10.10.75:8000/api/v1';

export const BASE_URL = (process.env.NODE_ENV === 'production')
  ? `${window.location.origin}/api/v1`
  : DEV_BASE_URL;

export const SEARCH_AGREEMENTS_ENDPOINT = 'agreement/search';
export const GET_REFERENCES_ENDPOINT = '/reference';
export const GET_ZONES_ENTPOINT = '/zone';
export const GET_USERS_ENDPOINT = '/user';
export const GET_USER_PROFILE_ENDPOINT = '/user/me';

export const GET_RUP_ENDPOINT = planId => `/plan/${planId}`;
export const UPDATE_STAFF_OF_ZONE_ENDPOINT = zoneId => `/zone/${zoneId}/user`;
export const UPDATE_RUP_STATUS_ENDPOINT = planId => `/plan/${planId}/status`;
export const UPDATE_RUP_ZONE_ENDPOINT = agreementId => `/agreement/${agreementId}/zone`;
export const GET_RUP_PDF_ENDPOINT = planId => `/report/${planId}`;
export const CREATE_RUP_SCHEDULE_ENDPOINT = planId => `/plan/${planId}/schedule`;
export const UPDATE_RUP_SCHEDULE_ENDPOINT = (planId, scheduleId) => `/plan/${planId}/schedule/${scheduleId}`;
export const DELETE_RUP_SCHEDULE_ENDPOINT = (planId, scheduleId) => `/plan/${planId}/schedule/${scheduleId}`;
export const DELETE_RUP_SCHEDULE_ENTRY_ENDPOINT = (planId, scheduleId, entryId) => `/plan/${planId}/schedule/${scheduleId}/entry/${entryId}`;
