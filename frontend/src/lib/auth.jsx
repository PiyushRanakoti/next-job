import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('nextjob_token');
    if (stored) setToken(stored);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('nextjob_token', newToken);
    setToken(newToken);
    setLocation('/admin/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('nextjob_token');
    setToken(null);
    setLocation('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
