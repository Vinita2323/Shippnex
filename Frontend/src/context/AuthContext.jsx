import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState(true);
  const [userRole, setUserRole] = useState(null); // 'user', 'seller', 'captain', 'admin', 'super_admin'

  const computeRoleAndAuth = useCallback((preferredRole = null) => {
    try {
      const userToken = localStorage.getItem('shippnex_user_token');
      const sellerToken = localStorage.getItem('shippnex_seller_token');
      const captainToken = localStorage.getItem('shippnex_captain_token');
      const adminToken = localStorage.getItem('shippnex_admin_token');
      const superAdminToken = localStorage.getItem('shippnex_super_admin_token');

      // 1. Check preferred role if passed explicitly
      if (preferredRole === 'super_admin' && superAdminToken) return { isAuth: true, role: 'super_admin' };
      if (preferredRole === 'admin' && (adminToken || superAdminToken)) return { isAuth: true, role: 'admin' };
      if (preferredRole === 'seller' && sellerToken) return { isAuth: true, role: 'seller' };
      if (preferredRole === 'captain' && captainToken) return { isAuth: true, role: 'captain' };
      if (preferredRole === 'user' && userToken) return { isAuth: true, role: 'user' };

      // 2. Check path-based role
      const path = typeof window !== 'undefined' && window.location ? window.location.pathname : '';
      if (path.startsWith('/super-admin') && superAdminToken) {
        return { isAuth: true, role: 'super_admin' };
      }
      if (path.startsWith('/admin') && (adminToken || superAdminToken)) {
        return { isAuth: true, role: 'admin' };
      }
      if (path.startsWith('/seller') && sellerToken) {
        return { isAuth: true, role: 'seller' };
      }
      if ((path.startsWith('/captain') || path.startsWith('/delivery')) && captainToken) {
        return { isAuth: true, role: 'captain' };
      }

      // 3. Fallback based on available tokens
      if (userToken) return { isAuth: true, role: 'user' };
      if (adminToken) return { isAuth: true, role: 'admin' };
      if (superAdminToken) return { isAuth: true, role: 'super_admin' };
      if (sellerToken) return { isAuth: true, role: 'seller' };
      if (captainToken) return { isAuth: true, role: 'captain' };

      return { isAuth: false, role: null };
    } catch (e) {
      console.error('[AuthContext] computeRoleAndAuth error:', e);
      return { isAuth: false, role: null };
    }
  }, []);

  const isRoleAuthenticated = useCallback((role) => {
    try {
      if (!role || role === 'user') {
        return !!localStorage.getItem('shippnex_user_token');
      }
      if (role === 'admin') {
        return !!(localStorage.getItem('shippnex_admin_token') || localStorage.getItem('shippnex_super_admin_token'));
      }
      if (role === 'super_admin') {
        return !!localStorage.getItem('shippnex_super_admin_token');
      }
      if (role === 'seller') {
        return !!localStorage.getItem('shippnex_seller_token');
      }
      if (role === 'captain') {
        return !!localStorage.getItem('shippnex_captain_token');
      }
      return false;
    } catch (e) {
      return false;
    }
  }, []);

  const syncAuthFromStorage = useCallback((explicitRole = null) => {
    const { isAuth, role } = computeRoleAndAuth(explicitRole);
    setIsAuthenticated(isAuth);
    setUserRole(role);
  }, [computeRoleAndAuth]);

  // Initialize auth on app load
  useEffect(() => {
    syncAuthFromStorage();
    setIsAuthInitializing(false);
  }, [syncAuthFromStorage]);

  const logout = (role = 'user') => {
    if (role === 'user' || !role) {
      localStorage.removeItem('shippnex_user_token');
      localStorage.removeItem('shippnex_user_data');
      localStorage.removeItem('shippnex_user_name');
      localStorage.removeItem('shippnex_user_email');
      localStorage.removeItem('shippnex_user_phone');
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

    syncAuthFromStorage();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAuthInitializing,
        userRole,
        isRoleAuthenticated,
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

