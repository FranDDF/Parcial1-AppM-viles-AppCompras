import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userEmail, setUserEmail] = useState('');

  const loginContext = (email) => setUserEmail(email);
  const logoutContext = (navigation) => {
    setUserEmail('');
    navigation.replace('Login');
  };

  return (
    <AuthContext.Provider value={{ userEmail, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);