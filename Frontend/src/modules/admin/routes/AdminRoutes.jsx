import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from '../context/AdminContext';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminLogin } from '../pages/AdminLogin';

const AdminRoutes = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </AdminProvider>
  );
};

export default AdminRoutes;
