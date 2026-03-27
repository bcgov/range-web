export const generatePKCE = async (): Promise<{ codeVerifier: string; codeChallenge: string }> => {
  const VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const codeVerifier = Array.from({ length: 128 }, () =>
    VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length)),
  ).join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const base64Hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  const codeChallenge = base64Hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return { codeVerifier, codeChallenge };
};
