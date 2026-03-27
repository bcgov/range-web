import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { SSO_TOKEN_ENDPOINT, getSSOClientId, getLoginRedirectUri } from '../config/sso';

const LOCAL_STORAGE_KEY = {
  AUTH_PKCE_CODE: 'range_pkce_code',
  AUTH_TYPE: 'range_auth_type',
};

export default function ReturnPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const type = searchParams.get('type');
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const sessionState = searchParams.get('session_state');

      console.log('ReturnPage loaded:', { type, code: code?.substring(0, 20) + '...', sessionState });

      if (errorParam) {
        setError(errorDescription || errorParam);
        setDebugInfo(`Error from SSO: ${errorParam}`);
        setIsLoading(false);
        return;
      }

      if (type === 'LOGOUT') {
        window.location.href = '/';
        return;
      }

      if (type === 'SITEMINDER_LOGOUT') {
        window.location.href = '/login';
        return;
      }

      if (code && sessionState) {
        const storedType = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH_TYPE);
        const storedPkce = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE);

        console.log('Auth type from storage:', storedType);
        console.log('Stored PKCE:', storedPkce ? 'Found' : 'NOT FOUND');

        if (storedType !== 'LOGIN') {
          setError('Invalid auth type. Please try logging in again.');
          setIsLoading(false);
          return;
        }

        if (!storedPkce) {
          setError('PKCE code verifier not found. Please try logging in again.');
          setIsLoading(false);
          return;
        }

        try {
          const pkceData = JSON.parse(storedPkce);
          console.log('PKCE codeVerifier:', pkceData.codeVerifier?.substring(0, 20) + '...');

          setDebugInfo(`Exchanging code with PKCE...`);

          const response = await fetch(SSO_TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code,
              redirect_uri: getLoginRedirectUri(),
              client_id: getSSOClientId(),
              code_verifier: pkceData.codeVerifier,
            }),
          });

          const responseText = await response.text();
          console.log('Token response status:', response.status);
          console.log('Token response body:', responseText.substring(0, 200));

          if (!response.ok) {
            let errorData: { error_description?: string } = {};
            try {
              errorData = JSON.parse(responseText);
            } catch {
              errorData = { error_description: responseText };
            }
            throw new Error(errorData.error_description || `Token exchange failed: ${response.status}`);
          }

          const tokenData = JSON.parse(responseText);
          console.log('Token received, access_token:', tokenData.access_token?.substring(0, 20) + '...');

          localStorage.setItem('range_auth', JSON.stringify(tokenData));

          await loginWithToken(tokenData.access_token, tokenData.refresh_token);

          localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE);
          localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH_TYPE);

          window.close();
        } catch (err) {
          console.error('Login error:', err);
          setError(err instanceof Error ? err.message : 'Login failed');
          setIsLoading(false);
        }
        return;
      }

      setError('No login code received');
      setDebugInfo(
        `URL params: type=${type}, code=${code ? 'present' : 'missing'}, session_state=${sessionState ? 'present' : 'missing'}`,
      );
      setIsLoading(false);
    };

    handleCallback();
  }, [searchParams, loginWithToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Signing you in...</p>
          {debugInfo && <p className="mt-2 text-xs text-gray-400">{debugInfo}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="text-red-600 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {debugInfo && <pre className="text-left text-xs bg-gray-100 p-2 rounded mb-4 overflow-auto">{debugInfo}</pre>}
          <button
            type="button"
            onClick={() => {
              window.close();
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
