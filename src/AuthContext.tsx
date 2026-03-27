import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  username: string;
  email: string | null;
  givenName: string | null;
  familyName: string | null;
  active: boolean;
}

interface AuthData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  jwtData?: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithToken: (accessToken: string, refreshToken?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = {
  AUTH: 'range_auth',
  USER: 'range_user',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserFromToken = useCallback(async (accessToken: string) => {
    try {
      const response = await fetch('/api/trpc/auth.me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.result?.data) {
          const userData = result.result.data;
          setUser(userData);
          localStorage.setItem(LOCAL_STORAGE_KEY.USER, JSON.stringify(userData));
          return userData;
        }
      }
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
    return null;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY.AUTH);
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY.USER);

      if (storedAuth && storedUser) {
        try {
          const parsedAuth = JSON.parse(storedAuth) as AuthData;
          setAuthData(parsedAuth);

          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          if (parsedAuth.access_token) {
            const jwtData = jwtDecode(parsedAuth.access_token) as Record<string, unknown>;
            const exp = jwtData.exp as number;

            if (Date.now() < exp * 1000) {
              setIsLoading(false);
              return;
            }
          }
        } catch {
          localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH);
          localStorage.removeItem(LOCAL_STORAGE_KEY.USER);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY.AUTH && event.newValue) {
        try {
          const newAuth = JSON.parse(event.newValue) as AuthData;
          if (newAuth.access_token && (!authData || authData.access_token !== newAuth.access_token)) {
            setAuthData(newAuth);
            await fetchUserFromToken(newAuth.access_token);
            window.location.reload();
          }
        } catch {
          console.error('Failed to parse auth data from storage');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [authData, fetchUserFromToken]);

  const loginWithToken = useCallback(
    async (accessToken: string, refreshToken?: string) => {
      const jwtData = jwtDecode(accessToken) as Record<string, unknown>;

      const newAuthData: AuthData = {
        access_token: accessToken,
        refresh_token: refreshToken,
        jwtData,
      };

      setAuthData(newAuthData);
      localStorage.setItem(LOCAL_STORAGE_KEY.AUTH, JSON.stringify(newAuthData));

      await fetchUserFromToken(accessToken);
    },
    [fetchUserFromToken],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAuthData(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY.AUTH);
    localStorage.removeItem(LOCAL_STORAGE_KEY.USER);

    const logoutUrl = '/api/trpc/auth.logout';
    fetch(logoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData?.access_token}`,
      },
    })
      .then(() => {
        window.location.href = '/login';
      })
      .catch(() => {
        window.location.href = '/login';
      });
  }, [authData?.access_token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: authData?.access_token || null,
        refreshToken: authData?.refresh_token || null,
        isLoading,
        isAuthenticated: !!user && !!authData?.access_token,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
