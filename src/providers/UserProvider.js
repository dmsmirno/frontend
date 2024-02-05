import React, { useState, useEffect } from 'react';
import { loginUser, logoutUser, validateSession } from '../services/userApi';

export const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      validateSession(JSON.parse(localUser)).then(isValid => {
        if (isValid) {
          setUser(JSON.parse(localUser));
        } else {
          localStorage.removeItem('user');
        }
      });
    }
  }, []);

  const login = async (username, password) => {
    const user = await loginUser(username, password);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = async () => {
    const localUser = localStorage.getItem('user');
    try {
      const response = await logoutUser(JSON.parse(localUser));
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}