import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  LoginPayload,
  RegisterPayload,
  User,
} from '../lib/api-types';
import {
  completeQuizSession,
  fetchCampaigns,
  fetchCurrentUser,
  fetchDashboardSummary,
  fetchLeaderboard,
  fetchProfileSummary,
  login,
  registerUser,
  startQuizSession,
  submitQuizAttempt,
  updatePreferences,
} from '../lib/api';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const STORAGE_KEY = 'jogo-anatomia.auth';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface StoredCredentials {
  accessToken: string;
  refreshToken: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persistTokens = useCallback((tokens: StoredCredentials | null) => {
    if (tokens && tokens.accessToken && tokens.refreshToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, []);

  const loadFromStorage = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as StoredCredentials;
      if (!parsed.accessToken) {
        throw new Error('missing token');
      }
      setAccessToken(parsed.accessToken);
      setRefreshToken(parsed.refreshToken);
      const profile = await fetchCurrentUser(parsed.accessToken);
      setUser(profile);
    } catch (error) {
      console.error('Falha ao restaurar sessao', error);
      persistTokens(null);
    } finally {
      setLoading(false);
    }
  }, [persistTokens]);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleLogin = useCallback(
    async (credentials: LoginPayload) => {
      setLoading(true);
      try {
        const tokens = await login(credentials);
        persistTokens({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        });
        const profile = await fetchCurrentUser(tokens.access_token);
        setUser(profile);
      } finally {
        setLoading(false);
      }
    },
    [persistTokens],
  );

  const handleRegister = useCallback(
    async (payload: RegisterPayload) => {
      setLoading(true);
      try {
        await registerUser(payload);
        await handleLogin({ email: payload.email, password: payload.password });
        toast.success('Cadastro concluido com sucesso!');
      } finally {
        setLoading(false);
      }
    },
    [handleLogin],
  );

  const handleLogout = useCallback(() => {
    persistTokens(null);
    setUser(null);
  }, [persistTokens]);

  const refreshUser = useCallback(async () => {
    if (!accessToken) {
      return;
    }
    try {
      const profile = await fetchCurrentUser(accessToken);
      setUser(profile);
    } catch (error) {
      console.error('Falha ao atualizar perfil', error);
      handleLogout();
    }
  }, [accessToken, handleLogout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      loading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refreshUser,
    }),
    [user, accessToken, loading, handleLogin, handleRegister, handleLogout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Re-exported helper API to allow consumers outside context file
export const apiHelpers = {
  fetchDashboardSummary,
  fetchCampaigns,
  fetchLeaderboard,
  fetchProfileSummary,
  updatePreferences,
  startQuizSession,
  submitQuizAttempt,
  completeQuizSession,
};
