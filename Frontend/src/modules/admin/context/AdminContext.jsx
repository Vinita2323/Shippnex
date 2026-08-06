import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AdminContext = createContext();


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
  const [editingProductData, setEditingProductData] = useState(null);

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
        editingProductData,
        setEditingProductData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};


