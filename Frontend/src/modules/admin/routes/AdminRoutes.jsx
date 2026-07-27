import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from '../context/AdminContext';
import { AdminLayout } from '../layouts/AdminLayout';

const AdminRoutes = () => {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </AdminProvider>
  );
};

export default AdminRoutes;
