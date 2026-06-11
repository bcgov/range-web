import { encode as base64encode } from 'base64-arraybuffer';

export interface PKCEPair {
  codeVerifier: string;
  codeVerifierHash: string;
}

export const generatePKCE = async (): Promise<PKCEPair> => {
  const VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const codeVerifier = Array.from({ length: 128 }, () =>
    VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length)),
  ).join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const encodedHash = base64encode(hashBuffer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return { codeVerifier, codeVerifierHash: encodedHash };
};
