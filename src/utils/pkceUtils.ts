import { encode as base64encode } from 'base64-arraybuffer';

export interface PKCEPair {
  codeVerifier: string;
  codeVerifierHash: string;
}

export const generatePKCE = async (): Promise<PKCEPair> => {
  const VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const codeVerifierLength = 128;
  const charsetSize = VALID_CHARS.length;
  const maxUnbiasedByte = Math.floor(256 / charsetSize) * charsetSize;
  const verifierChars: string[] = [];

  while (verifierChars.length < codeVerifierLength) {
    const randomBytes = new Uint8Array(256);
    crypto.getRandomValues(randomBytes);

    for (const byte of randomBytes) {
      if (byte >= maxUnbiasedByte) {
        continue;
      }

      verifierChars.push(VALID_CHARS.charAt(byte % charsetSize));
      if (verifierChars.length === codeVerifierLength) {
        break;
      }
    }
  }

  const codeVerifier = verifierChars.join('');

  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const encodedHash = base64encode(hashBuffer).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  return { codeVerifier, codeVerifierHash: encodedHash };
};
