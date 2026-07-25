import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SellerLayout from '../components/layout/SellerLayout';
import Dashboard from '../pages/Dashboard';
import SellerLogin from '../pages/auth/SellerLogin';
import SellerRegister from '../pages/auth/SellerRegister';

// Placeholders for all requested modules
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import Orders from '../pages/Orders';
import Inventory from '../pages/Inventory';
import Dispatch from '../pages/Dispatch';
import Customers from '../pages/Customers';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

const SellerRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="login" element={<SellerLogin />} />
      <Route path="register" element={<SellerRegister />} />
      
      {/* Protected Layout Routes */}
      <Route element={<SellerLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Core Modules */}
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="inventory" element={<Inventory />} />
        
        {/* Logistics */}
        <Route path="dispatch" element={<Dispatch />} />
        
        {/* CRM & Reports */}
        <Route path="customers" element={<Customers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Placeholder catch-all for upcoming modules */}
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
