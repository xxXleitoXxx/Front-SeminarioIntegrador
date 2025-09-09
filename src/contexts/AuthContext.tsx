import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Token } from '../types/Token';
import { UserInfo } from '../types/User';

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

  useEffect(() => {
    // Verificar si hay token guardado en localStorage al cargar la aplicación
    const savedToken = localStorage.getItem('token');
    const savedRoles = localStorage.getItem('roles');
    const savedUsername = localStorage.getItem('username');
    
    if (savedToken && savedRoles && savedUsername) {
      setToken(savedToken);
      setRoles(JSON.parse(savedRoles));
      setUsername(savedUsername);
      setIsAuthenticated(true);
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
