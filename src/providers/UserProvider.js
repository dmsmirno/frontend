import React, { useState, useEffect } from 'react';
import { loginOAuthUser, getSession, logoutUser, validateSession } from '../services/userApi';

export const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const handleAuthorizedRequestToken = async (token) => {
    // Assuming the user data is returned when creating a session
    const user = await getSession(token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  
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

  const login = async () => {
    const user = await loginOAuthUser();
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
    <UserContext.Provider value={{ user, login, logout, handleAuthorizedRequestToken }}>
      {children}
    </UserContext.Provider>
  );
}