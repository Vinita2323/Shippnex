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

const SellerRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="login" element={<SellerLogin />} />
      <Route path="register" element={<SellerRegister />} />
      <Route path="under-review" element={<SellerUnderReview />} />
      
      {/* Protected Layout Routes */}
      <Route element={<ProtectedRoute role="seller" redirectPath="/seller/login" />}>
        <Route element={<SellerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="category" element={<Categories />} />
          <Route path="categories" element={<Categories />} />
          <Route path="subcategory" element={<SubCategory />} />
          <Route path="subcategories" element={<SubCategory />} />
          
          {/* Product Group */}
          <Route path="product/add" element={<AddProduct />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="taxes" element={<Taxes />} />
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
    </Routes>
  );
};

export default SellerRoutes;
