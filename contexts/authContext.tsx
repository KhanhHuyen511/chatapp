'use client';

import { createUser } from '@/actions/users';
import { User } from '@/lib/types/user';
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (name: string) => {
    const user = await createUser(name);

    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
