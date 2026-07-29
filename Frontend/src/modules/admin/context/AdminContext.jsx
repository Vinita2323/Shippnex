import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentTabFromUrl = pathParts.length > 1 ? pathParts[1] : 'dashboard';
  const [activeTab, setActiveState] = useState(currentTabFromUrl);

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const tab = parts.length > 1 ? parts[1] : 'dashboard';
    setActiveState(tab);
  }, [location.pathname]);

  const setActiveTab = (tab) => {
    setActiveState(tab);
    if (tab === 'dashboard') {
      navigate('/admin');
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsCount, setNotificationsCount] = useState(3);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AdminContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        notificationsCount,
        setNotificationsCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
