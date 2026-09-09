import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/api';
import { config } from '../config/config';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
  setDemoUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(config.userStorageKey);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(config.tokenStorageKey);
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Synchronize storage with state
    if (token) {
      localStorage.setItem(config.tokenStorageKey, token);
    } else {
      localStorage.removeItem(config.tokenStorageKey);
    }

    if (user) {
      localStorage.setItem(config.userStorageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(config.userStorageKey);
    }
  }, [token, user]);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      const data = response.data;
      const receivedToken = data.token || data.access_token || 'jwt_session_token';
      const receivedUser: User = data.user || {
        id: data.user_id || '1',
        name: data.name || credentials.email.split('@')[0],
        email: credentials.email,
        role: data.role || 'candidate',
      };

      setToken(receivedToken);
      setUser(receivedUser);
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message 
        || 'Failed to connect to Flask backend. Please verify your backend server is running.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(userData);
      const data = response.data;
      const receivedToken = data.token || data.access_token || 'jwt_session_token';
      const receivedUser: User = data.user || {
        id: data.user_id || '1',
        name: userData.name,
        email: userData.email,
        role: userData.role || 'candidate',
      };

      setToken(receivedToken);
      setUser(receivedUser);
    } catch (err: unknown) {
      const errMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message 
        || 'Failed to register with Flask backend.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authApi.logout().catch(() => {
        // Ignore errors during logout request
      });
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem(config.tokenStorageKey);
      localStorage.removeItem(config.userStorageKey);
    }
  };

  // Demo user helper to allow previewing protected views in frontend sandbox
  const setDemoUser = () => {
    const demoUser: User = {
      id: 'demo-101',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      role: 'Skill Seeker',
    };
    setUser(demoUser);
    setToken('demo_bearer_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        setDemoUser,
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
