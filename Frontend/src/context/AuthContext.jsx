import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'user', 'seller', 'captain', 'admin', 'super_admin'

  // Initialize auth on app load - restore token from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check all possible token types and restore auth
        const userToken = localStorage.getItem('shippnex_user_token');
        const sellerToken = localStorage.getItem('shippnex_seller_token');
        const captainToken = localStorage.getItem('shippnex_captain_token');
        const adminToken = localStorage.getItem('shippnex_admin_token');
        const superAdminToken = localStorage.getItem('shippnex_super_admin_token');

        // Set authenticated state based on which token exists
        if (userToken) {
          setIsAuthenticated(true);
          setUserRole('user');
        } else if (sellerToken) {
          setIsAuthenticated(true);
          setUserRole('seller');
        } else if (captainToken) {
          setIsAuthenticated(true);
          setUserRole('captain');
        } else if (adminToken) {
          setIsAuthenticated(true);
          setUserRole('admin');
        } else if (superAdminToken) {
          setIsAuthenticated(true);
          setUserRole('super_admin');
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('[AuthContext] Initialization error:', error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        // Mark auth initialization as complete
        setIsAuthInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  const syncAuthFromStorage = () => {
    try {
      const userToken = localStorage.getItem('shippnex_user_token');
      const sellerToken = localStorage.getItem('shippnex_seller_token');
      const captainToken = localStorage.getItem('shippnex_captain_token');
      const adminToken = localStorage.getItem('shippnex_admin_token');
      const superAdminToken = localStorage.getItem('shippnex_super_admin_token');

      if (userToken) {
        setIsAuthenticated(true);
        setUserRole('user');
      } else if (sellerToken) {
        setIsAuthenticated(true);
        setUserRole('seller');
      } else if (captainToken) {
        setIsAuthenticated(true);
        setUserRole('captain');
      } else if (adminToken) {
        setIsAuthenticated(true);
        setUserRole('admin');
      } else if (superAdminToken) {
        setIsAuthenticated(true);
        setUserRole('super_admin');
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error('[AuthContext] syncAuthFromStorage error:', error);
    }
  };

  const logout = (role = 'user') => {
    // Clear tokens based on role
    if (role === 'user' || !role) {
      localStorage.removeItem('shippnex_user_token');
      localStorage.removeItem('shippnex_user_data');
    } else if (role === 'seller') {
      localStorage.removeItem('shippnex_seller_token');
      localStorage.removeItem('shippnex_seller_data');
    } else if (role === 'captain') {
      localStorage.removeItem('shippnex_captain_token');
      localStorage.removeItem('shippnex_captain_data');
    } else if (role === 'admin') {
      localStorage.removeItem('shippnex_admin_token');
      localStorage.removeItem('shippnex_admin_data');
    } else if (role === 'super_admin') {
      localStorage.removeItem('shippnex_super_admin_token');
      localStorage.removeItem('shippnex_super_admin_data');
    }

    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthInitializing,
        userRole,
        logout,
        syncAuthFromStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
