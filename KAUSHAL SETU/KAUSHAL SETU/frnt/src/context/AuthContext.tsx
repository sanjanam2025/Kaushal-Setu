import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { authApi } from '../api/api';
import { config } from '../config/config';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface BackendAuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: {
    user_id?: number | string;
    name?: string;
    email?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True while the stored session is being verified on first load. */
  isInitializing: boolean;
  isSubmitting: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredUser(): User | null {
  try {
    const saved = localStorage.getItem(config.userStorageKey);
    return saved ? (JSON.parse(saved) as User) : null;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(config.tokenStorageKey),
  );
  const [isInitializing, setIsInitializing] = useState<boolean>(() =>
    Boolean(localStorage.getItem(config.tokenStorageKey)),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verify the stored token against the backend on first load. If the token
  // is expired or revoked, the session is cleared so protected pages redirect.
  useEffect(() => {
    if (!token) {
      setIsInitializing(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await authApi.getCurrentUser();
        const data = response.data as { success: boolean; user?: { user_id: number; name: string; email: string } };

        if (cancelled) return;

        if (data.success && data.user) {
          const verified: User = {
            id: String(data.user.user_id),
            name: data.user.name,
            email: data.user.email,
          };
          setUser(verified);
          localStorage.setItem(config.userStorageKey, JSON.stringify(verified));
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem(config.tokenStorageKey);
          localStorage.removeItem(config.userStorageKey);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(config.tokenStorageKey);
          localStorage.removeItem(config.userStorageKey);
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistSession = useCallback((receivedToken: string, receivedUser: User) => {
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem(config.tokenStorageKey, receivedToken);
    localStorage.setItem(config.userStorageKey, JSON.stringify(receivedUser));
  }, []);

  const extractSession = useCallback(
    (data: BackendAuthResponse, fallbackName: string, fallbackEmail: string) => {
      if (!data.token) {
        throw new Error('Login succeeded, but the server did not return an access token.');
      }

      return {
        token: data.token,
        user: {
          id: String(data.user?.user_id ?? ''),
          name: data.user?.name ?? fallbackName,
          email: data.user?.email ?? fallbackEmail,
        } satisfies User,
      };
    },
    [],
  );

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await authApi.login(credentials);
        const session = extractSession(
          response.data as BackendAuthResponse,
          credentials.email.split('@')[0],
          credentials.email,
        );
        persistSession(session.token, session.user);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Failed to sign in. Please try again.';
        setError(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [extractSession, persistSession],
  );

  const register = useCallback(
    async (userData: { name: string; email: string; password: string }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        await authApi.register(userData);
        // Register then immediately sign in to receive the JWT.
        const loginResponse = await authApi.login({
          email: userData.email,
          password: userData.password,
        });
        const session = extractSession(
          loginResponse.data as BackendAuthResponse,
          userData.name,
          userData.email,
        );
        persistSession(session.token, session.user);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          'Failed to create your account. Please try again.';
        setError(message);
        throw new Error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [extractSession, persistSession],
  );

  const logout = useCallback(() => {
    authApi.logout().catch(() => {
      // The server holds no session state; ignore logout API failures.
    });
    setUser(null);
    setToken(null);
    localStorage.removeItem(config.tokenStorageKey);
    localStorage.removeItem(config.userStorageKey);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isInitializing,
        isSubmitting,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
