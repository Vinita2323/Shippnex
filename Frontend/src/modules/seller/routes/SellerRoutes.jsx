import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../../components/ProtectedRoute';
import SellerLayout from '../components/layout/SellerLayout';
import Dashboard from '../pages/Dashboard';
import SellerLogin from '../pages/auth/SellerLogin';
import SellerRegister from '../pages/auth/SellerRegister';
import SellerUnderReview from '../pages/auth/SellerUnderReview';

import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import Categories from '../pages/Categories';
import SubCategory from '../pages/SubCategory';
import Orders from '../pages/Orders';
import Inventory from '../pages/Inventory';
import Dispatch from '../pages/Dispatch';
import Customers from '../pages/Customers';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import Taxes from '../pages/Taxes';
import Wallet from '../pages/Wallet';
import Return from '../pages/Return';
import SellerMembership from '../pages/SellerMembership';
import SellerPolicyPage from '../pages/SellerPolicyPage';

const SellerRoutes = () => {
  return (
    <Routes>
      {/* Public Auth & Policy Routes */}
      <Route path="login" element={<SellerLogin />} />
      <Route path="register" element={<SellerRegister />} />
      <Route path="under-review" element={<SellerUnderReview />} />
      <Route path="terms" element={<SellerPolicyPage />} />
      <Route path="privacy" element={<SellerPolicyPage />} />
      
      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute role="seller" redirectPath="/seller/login" />}>
        <Route element={<SellerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          {/* Category & Subcategory routes disabled for Sellers in Multi-vendor setup */}
          <Route path="category" element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="categories" element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="subcategory" element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="subcategories" element={<Navigate to="/seller/dashboard" replace />} />
          
          {/* Product Group */}
          <Route path="product/add" element={<AddProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="taxes" element={<Navigate to="/seller/dashboard" replace />} />
          <Route path="products" element={<Products />} />
          <Route path="product/list" element={<Products />} />
          <Route path="stock-management" element={<Inventory />} />
          <Route path="inventory" element={<Inventory />} />

          {/* Finance & CRM */}
          <Route path="wallet" element={<Wallet />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/sales" element={<Reports />} />
          <Route path="return" element={<Return />} />
          <Route path="returns" element={<Return />} />
          
          {/* Other modules */}
          <Route path="dispatch" element={<Dispatch />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Redirect root to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      {/* Membership Route — protected (requires seller token) but full-screen (outside SellerLayout) */}
      <Route element={<ProtectedRoute role="seller" redirectPath="/seller/login" />}>
        <Route path="membership" element={<SellerMembership />} />
      </Route>
    </Routes>
  );
};

export default SellerRoutes;
