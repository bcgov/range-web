import { isBundled, RETURN_PAGE_TYPE } from './variables';

export const SSO_BASE_URL = isBundled
  ? '{{.Env.SSO_BASE_URL}}' // Caddy will replace this with the environment variable when serving the content
  : 'https://sso-dev.pathfinder.gov.bc.ca';
export const SSO_REALM_NAME = 'range';
export const SSO_CLIENT_ID = 'myrangebc';
export const SSO_BASE_AUTH_ENDPOINT = `${SSO_BASE_URL}/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect`;
export const SSO_LOGIN_REDIRECT_URI = `${window.location.origin}/return-page?type=${RETURN_PAGE_TYPE.LOGIN}`;
export const SSO_LOGIN_ENDPOINT = `${SSO_BASE_AUTH_ENDPOINT}/auth?response_type=code&client_id=${SSO_CLIENT_ID}&redirect_uri=${SSO_LOGIN_REDIRECT_URI}`;
export const SSO_IDIR_LOGIN_ENDPOINT = `${SSO_LOGIN_ENDPOINT}&kc_idp_hint=idir`;
export const SSO_BCEID_LOGIN_ENDPOINT = `${SSO_LOGIN_ENDPOINT}&kc_idp_hint=bceid`;

export const SSO_LOGOUT_REDIRECT_URI = `${window.location.origin}/return-page?type=${RETURN_PAGE_TYPE.LOGOUT}`;
export const SSO_LOGOUT_ENDPOINT = `${SSO_BASE_AUTH_ENDPOINT}/logout?redirect_uri=${SSO_LOGOUT_REDIRECT_URI}`;

export const SITEMINDER_BASE_URL = isBundled
  ? '{{.Env.SITEMINDER_BASE_URL}}'
  : 'https://logontest.gov.bc.ca';
export const SITEMINDER_LOGOUT_REDIRECT_URI = `${window.location.origin}/return-page?type=${RETURN_PAGE_TYPE.SITEMINDER_LOGOUT}`;
export const SITEMINDER_LOGOUT_ENDPOINT = `${SITEMINDER_BASE_URL}/clp-cgi/logoff.cgi?returl=${SITEMINDER_LOGOUT_REDIRECT_URI}&retnow=1`;

export const GET_TOKEN_FROM_SSO = `/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`;
export const REFRESH_TOKEN_FROM_SSO = `/auth/realms/${SSO_REALM_NAME}/protocol/openid-connect/token`;

// const DEV_API_BASE_URL = 'https://web-range-myra-prod.pathfinder.gov.bc.ca/api';
// const DEV_API_BASE_URL = 'https://web-range-myra-test.pathfinder.gov.bc.ca/api';
const DEV_API_BASE_URL = 'https://web-range-myra-dev.pathfinder.gov.bc.ca/api';
// const DEV_API_BASE_URL = 'http://localhost:8000/api';

export const API_BASE_URL = isBundled
  ? `${window.location.origin}/api`
  : DEV_API_BASE_URL;

export const SEARCH_AGREEMENTS = '/v1/agreement/search';
export const GET_AGREEMENT = agreementId => `/v1/agreement/${agreementId}`;
export const UPDATE_AGREEMENT_ZONE = agreementId => `/v1/agreement/${agreementId}/zone`;

export const GET_REFERENCES = '/v1/reference';
export const GET_ZONES = '/v1/zone';
export const GET_USERS = '/v1/user';
export const SEARCH_CLIENTS = '/v1/client/search';
export const GET_USER_PROFILE = '/v1/user/me';

export const UPDATE_USER_ID_OF_ZONE = zoneId => `/v1/zone/${zoneId}/user`;
export const UPDATE_CLIENT_ID_OF_USER = (userId, clientId) => `/v1/user/${userId}/client/${clientId}`;

export const CREATE_RUP = '/v1/plan';
export const GET_RUP = planId => `/v1/plan/${planId}`;
export const GET_PLAN_PDF = planId => `/v1/report/${planId}`;
export const UPDATE_PLAN_STATUS = planId => `/v1/plan/${planId}/status`;
export const UPDATE_RUP = planId => `/v1/plan/${planId}`;
export const UPDATE_CONFIRMATION = (planId, confirmationId) => `/v1/plan/${planId}/confirmation/${confirmationId}`;

export const CREATE_RUP_STATUS_HISTORY_RECORD = planId => `/v1/plan/${planId}/status-history`;
export const CREATE_RUP_PASTURE = planId => `/v1/plan/${planId}/pasture`;
export const CREATE_RUP_GRAZING_SCHEDULE = planId => `/v1/plan/${planId}/schedule`;
export const UPDATE_RUP_GRAZING_SCHEDULE = (planId, scheduleId) => `/v1/plan/${planId}/schedule/${scheduleId}`;
export const DELETE_RUP_GRAZING_SCHEDULE = (planId, scheduleId) => `/v1/plan/${planId}/schedule/${scheduleId}`;
export const CREATE_RUP_GRAZING_SCHEDULE_ENTRY = (planId, scheduleId) => `/v1/plan/${planId}/schedule/${scheduleId}/entry`;
// export const UPDATE_RUP_GRAZING_SCHEDULE_ENTRY
export const DELETE_RUP_GRAZING_SCHEDULE_ENTRY = (planId, scheduleId, entryId) => `/v1/plan/${planId}/schedule/${scheduleId}/entry/${entryId}`;
export const CREATE_RUP_MINISTER_ISSUE = planId => `/v1/plan/${planId}/issue`;
export const CREATE_RUP_MINISTER_ISSUE_ACTION = (planId, issueId) => `/v1/plan/${planId}/issue/${issueId}/action`;
export const CREATE_RUP_PLANT_COMMUNITY = (planId, pastureId) => `/v1/plan/${planId}/pasture/${pastureId}/plant-community`;
export const CREATE_RUP_PLANT_COMMUNITY_ACTION = (planId, pastureId, communityId) => `/v1/plan/${planId}/pasture/${pastureId}/plant-community/${communityId}/action`;
export const CREATE_RUP_INDICATOR_PLANT = (planId, pastureId, communityId) => `v1/plan/${planId}/pasture/${pastureId}/plant-community/${communityId}/indicator-plant`;
export const CREATE_RUP_MONITERING_AREA = (planId, pastureId, communityId) => `/v1/plan/${planId}/pasture/${pastureId}/plant-community/${communityId}/monitoring-area`;
export const CREATE_RUP_INVASIVE_PLANT_CHECKLIST = planId => `/v1/plan/${planId}/invasive-plant-checklist`;
export const CREATE_RUP_MANAGEMENT_CONSIDERATION = planId => `/v1/plan/${planId}/management-consideration`;
export const CREATE_RUP_ADDITIONAL_REQUIREMENT = planId => `/v1/plan/${planId}/additional-requirement`;
