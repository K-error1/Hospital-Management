import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import * as api from '../utils/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  updatePassword: (oldPass: string, newPass: string, confirmPass: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hospital_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const userData = await api.loginUser(email, password);
      setUser(userData);
      localStorage.setItem('hospital_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hospital_user');
  };

  const updatePassword = async (oldPass: string, newPass: string, confirmPass: string) => {
    try {
      if (!user?.email) throw new Error('Not authenticated');
      await api.changePassword(user.email, oldPass, newPass, confirmPass);
      const updatedUser = { ...user, must_change_password: false };
      setUser(updatedUser);
      localStorage.setItem('hospital_user', JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePassword, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
