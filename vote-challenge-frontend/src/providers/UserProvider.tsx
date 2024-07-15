import React, { createContext, useContext, useState } from 'react';

export type User = {
  id: number,
  cpf: string,
};

type UserProviderProps = {
  user: User|null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
};

const UserContext = createContext<UserProviderProps|null>(null);

export const UserProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User|null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserProviderProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
