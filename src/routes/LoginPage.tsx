import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getLoginUrl } from '../config/sso';
import { generatePKCE } from '../utils/pkce';

const LOCAL_STORAGE_KEY = {
  AUTH_PKCE_CODE: 'range_pkce_code',
  AUTH_TYPE: 'range_auth_type',
};

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pkceData, setPkceData] = useState<{ codeVerifier: string; codeChallenge: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const initPKCE = async () => {
      try {
        const pkce = await generatePKCE();
        localStorage.setItem(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE, JSON.stringify(pkce));
        localStorage.setItem(LOCAL_STORAGE_KEY.AUTH_TYPE, 'LOGIN');
        setPkceData(pkce);
        console.log('PKCE generated:', {
          codeVerifier: pkce.codeVerifier.substring(0, 20) + '...',
          codeChallenge: pkce.codeChallenge.substring(0, 20) + '...',
        });
      } catch (err) {
        console.error('Failed to generate PKCE:', err);
      } finally {
        setIsGenerating(false);
      }
    };
    initPKCE();
  }, []);

  const handleLogin = useCallback(
    (idp?: 'idir' | 'bceid') => {
      if (!pkceData) {
        console.error('PKCE not ready yet');
        return;
      }

      localStorage.setItem(LOCAL_STORAGE_KEY.AUTH_TYPE, 'LOGIN');

      const loginUrl = getLoginUrl(idp, pkceData.codeChallenge);
      console.log('Opening login URL with codeChallenge:', pkceData.codeChallenge.substring(0, 20) + '...');
      window.open(loginUrl, '_blank');
    },
    [pkceData],
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <span className="text-4xl font-bold text-emerald-700">Range</span>
          <span className="text-4xl font-light text-gray-700 ml-1">Management</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center text-gray-600">
              <p className="mb-4">Sign in using your BC Government credentials</p>
              <p className="text-sm">We use BCeID for authentication.</p>
              <a
                href="https://www.bceid.ca/register/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                Learn more about BCeID
              </a>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handleLogin('idir')}
                disabled={isGenerating || !pkceData}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Staff Login (IDIR)
              </button>

              <button
                type="button"
                onClick={() => handleLogin('bceid')}
                disabled={isGenerating || !pkceData}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Login with BCeID
              </button>
            </div>

            {isGenerating && <div className="text-center text-sm text-gray-500">Initializing secure login...</div>}
          </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">BC Government SSO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
