const DEV_SSO = {
  baseUrl: 'https://dev.loginproxy.gov.bc.ca',
  realm: 'standard',
  clientId: 'my-range-3769',
  siteMinderBaseUrl: 'https://logontest7.gov.bc.ca',
};

const PROD_SSO = {
  baseUrl: import.meta.env.VITE_SSO_URL || 'https://loginproxy.gov.bc.ca',
  realm: import.meta.env.VITE_SSO_REALM || 'standard',
  clientId: import.meta.env.VITE_SSO_CLIENT_ID || 'my-range-3769',
  siteMinderBaseUrl: import.meta.env.VITE_SITEMINDER_URL || 'https://logontest7.gov.bc.ca',
};

const isProd = import.meta.env.PROD;

export const getSSOConfig = () => (isProd ? PROD_SSO : DEV_SSO);

export const getSSOBaseUrl = () => getSSOConfig().baseUrl;
export const getSSORealm = () => getSSOConfig().realm;
export const getSSOClientId = () => getSSOConfig().clientId;

export const SSO_AUTH_ENDPOINT = `${getSSOBaseUrl()}/auth/realms/${getSSORealm()}/protocol/openid-connect`;
export const SSO_TOKEN_ENDPOINT = `${SSO_AUTH_ENDPOINT}/token`;
export const SSO_LOGOUT_ENDPOINT = `${SSO_AUTH_ENDPOINT}/logout`;

export const getBaseUrl = () => window.location.origin;

export const getReturnPageUrl = () => `${getBaseUrl()}/return-page`;

export const getLoginRedirectUri = () => getReturnPageUrl();

export const getLoginUrl = (idp?: 'idir' | 'bceid', codeChallenge?: string) => {
  const redirectUri = encodeURIComponent(getLoginRedirectUri());
  const clientId = getSSOClientId();
  let url = `${SSO_AUTH_ENDPOINT}/auth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&code_challenge_method=S256`;
  if (codeChallenge) {
    url += `&code_challenge=${codeChallenge}`;
  }
  if (idp) {
    url += `&kc_idp_hint=${idp}`;
  }
  return url;
};

export const getLogoutUrl = () => {
  const logoutRedirectUri = encodeURIComponent(getReturnPageUrl());
  const clientId = getSSOClientId();
  return `${SSO_LOGOUT_ENDPOINT}?post_logout_redirect_uri=${logoutRedirectUri}&client_id=${clientId}`;
};

export const getSiteminderLogoutUrl = () => {
  const siteminderRedirectUri = encodeURIComponent(`${getReturnPageUrl()}?type=SITEMINDER_LOGOUT`);
  const siteMinderBaseUrl = getSSOConfig().siteMinderBaseUrl;
  return `${siteMinderBaseUrl}/clp-cgi/logoff.cgi?returl=${siteminderRedirectUri}&retnow=1`;
};
