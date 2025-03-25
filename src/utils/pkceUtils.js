import { encode as base64encode } from 'base64-arraybuffer';

export const generatePKCE = async () => {
  const VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let codeVerifier = Array.from({ length: 128 }, () =>
    VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length)),
  ).join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const encodedHash = base64encode(hashBuffer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return { codeVerifier, codeVerifierHash: encodedHash };
};
