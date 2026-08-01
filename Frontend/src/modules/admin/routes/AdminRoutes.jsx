import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { AdminProvider } from '../context/AdminContext';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminDashboard } from '../pages/AdminDashboard';

const AdminRoutes = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute role="admin" redirectPath="/admin/login" />}>
          <Route path="*" element={<AdminLayout />} />
        </Route>
      </Routes>
    </AdminProvider>
  );
};

export default AdminRoutes;
