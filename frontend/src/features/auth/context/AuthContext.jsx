import { createContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../../../lib/storage.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storage.getToken());
  const [user, setUser] = useState(() => storage.getUser());

  useEffect(() => {
    if (token) {
      storage.setToken(token);
    } else {
      storage.clearToken();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      storage.setUser(user);
    } else {
      storage.clearUser();
    }
  }, [user]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login(session) {
        setToken(session.token);
        setUser(session.user ?? null);
      },
      logout() {
        setToken(null);
        setUser(null);
        storage.clearSession();
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
