import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // console.log(user);
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <UserContext.Provider value={{ user, isAuthenticated, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
