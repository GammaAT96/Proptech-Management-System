import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AuthContextType, User } from '../types/user.types';
import { loginRequest, getMe } from '../api/auth.api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) {
      setInitializing(false);
      return;
    }
    setAccessToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    getMe()
      .then(({ user: me }) => {
        if (storedUser) {
          const parsed = JSON.parse(storedUser) as User;
          setUser({ ...parsed, id: me.id, role: me.role });
        } else {
          setUser({ id: me.id, username: '', email: '', role: me.role });
        }
      })
      .catch(() => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
      })
      .finally(() => setInitializing(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginRequest(email, password);
    setUser(res.user);
    setAccessToken(res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('accessToken', res.accessToken);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!initializing && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

