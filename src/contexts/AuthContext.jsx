import React, { createContext, useContext, useState } from 'react';

// Exporta el contexto explícitamente (esto es lo nuevo)
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const tokenInStorage = localStorage.getItem('token');
  const roleInStorage = localStorage.getItem('role');
  const [token, setToken] = useState(tokenInStorage || null);
  const [role, setRole] = useState(roleInStorage || null);

  const login = (newToken, userRole) => {
    setToken(newToken);
    setRole(userRole);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);