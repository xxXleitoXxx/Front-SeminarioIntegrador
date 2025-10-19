import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Token } from '../types/Token';


interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  roles: string[];
  username: string | null;
  login: (tokenData: Token, username: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  // 🔑 función para decodificar un JWT sin librerías externas
  const decodeJwt = (token: string): any => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRoles = localStorage.getItem('roles');
    const savedUsername = localStorage.getItem('username');

    if (savedToken && savedRoles && savedUsername) {
      const decoded = decodeJwt(savedToken);
      const now = Date.now() / 1000;

      if (decoded && decoded.exp && decoded.exp > now) {
        setToken(savedToken);
        setRoles(JSON.parse(savedRoles));
        setUsername(savedUsername);
        setIsAuthenticated(true);

        // ⏱️ programar logout cuando expire

        const timeout = (decoded.exp - now) * 1000;
        setTimeout(() => {
          logout();
        }, timeout);
      } else {

        // token expirado → limpiar
        logout();
      }
    }
  }, []);

  const login = (tokenData: Token, username: string) => {
    setToken(tokenData.token);
    setRoles(tokenData.roles);
    setUsername(username);
    setIsAuthenticated(true);
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('roles', JSON.stringify(tokenData.roles));
    localStorage.setItem('username', username);

    // ⏱️ programar logout
    const decoded = decodeJwt(tokenData.token);
    if (decoded && decoded.exp) {
      const now = Date.now() / 1000;
      const timeout = (decoded.exp - now) * 1000;
      setTimeout(() => {
        logout();
      }, timeout);
    }
  };

  const logout = () => {
    setToken(null);
    setRoles([]);
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some(role => roles.includes(role));
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    roles,
    username,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
