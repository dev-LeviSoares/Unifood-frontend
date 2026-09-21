import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api/authService';
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  setSession,
} from '../services/storage/storage';
import { ROUTES } from '../constants/routes';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setToken(null);
  }, []);

  // Reage a 401 vindo de qualquer chamada da API (services/api/api.js), mesmo
  // fora de uma ação iniciada pelo usuário — ex: token expirou em segundo plano.
  useEffect(() => {
    function handleSessionExpired() {
      logout();
      navigate(ROUTES.LOGIN, { replace: true });
    }
    window.addEventListener('unifood:session-expired', handleSessionExpired);
    return () => window.removeEventListener('unifood:session-expired', handleSessionExpired);
  }, [logout, navigate]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const loggedUser = response.user;
      const receivedToken = response.token;

      if (!loggedUser || !receivedToken) {
        throw new Error('Resposta de autenticação inválida.');
      }

      setSession(receivedToken, loggedUser);
      setUser(loggedUser);
      setToken(receivedToken);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      role: user?.role ?? null,
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      logout,
    }),
    [user, token, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
