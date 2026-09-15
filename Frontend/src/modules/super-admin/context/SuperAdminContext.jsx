import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuperAdminContext = createContext();

export const SuperAdminProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => {
    return localStorage.getItem('shippnex_super_admin_token') || null;
  });

  const [superAdmin, setSuperAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('shippnex_super_admin_data');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = (newToken, adminData) => {
    localStorage.setItem('shippnex_super_admin_token', newToken);
    localStorage.setItem('shippnex_super_admin_data', JSON.stringify(adminData));
    setToken(newToken);
    setSuperAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('shippnex_super_admin_token');
    localStorage.removeItem('shippnex_super_admin_data');
    setToken(null);
    setSuperAdmin(null);
    navigate('/super-admin/login');
  };

  return (
    <SuperAdminContext.Provider
      value={{
        token,
        superAdmin,
        sidebarOpen,
        setSidebarOpen,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within a SuperAdminProvider');
  }
  return context;
};
