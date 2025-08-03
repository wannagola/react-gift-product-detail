import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './AuthContextTypes';
import {
  getUserFromStorage,
  setUserToStorage,
  clearUserStorage,
} from '@/utils/localStorage';

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getUserFromStorage();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setUser(user);
    setUserToStorage(user);
  };

  const logout = () => {
    setUser(null);
    clearUserStorage();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
