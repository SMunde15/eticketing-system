import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextProps {
  isAuthenticated: boolean;
  userRole: 'admin' | 'customer' | null;
  login: (token: string, role: 'admin' | 'customer') => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'customer' | null>(() => {
    const roleFromCookie = Cookies.get('userRole') as 'admin' | 'customer' | null;
    return roleFromCookie;
  });

  useEffect(() => {
    const token = Cookies.get('token');
    const userRole = Cookies.get('userRole') as 'admin' | 'customer' | null;

    if (token && userRole) {
      setIsAuthenticated(true);
      setUserRole(userRole);
    }
  }, []);

  const login = (token: string, role: 'admin' | 'customer') => {
    setIsAuthenticated(true);
    setUserRole(role);
    // Cookies.set('token', token, { expires: 7 });
    Cookies.set('userRole', role, { expires: 7 });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    Cookies.remove('token');
    Cookies.remove('userRole');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
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
