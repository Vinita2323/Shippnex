import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SuperAdminProvider, useSuperAdmin } from '../context/SuperAdminContext';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';
import { SuperAdminLogin } from '../pages/SuperAdminLogin';
import { SuperAdminDashboard } from '../pages/SuperAdminDashboard';
import { SuperAdminTransactions } from '../pages/SuperAdminTransactions';
import { SuperAdminPayments } from '../pages/SuperAdminPayments';
import { SuperAdminSellerSettlements } from '../pages/SuperAdminSellerSettlements';
import { SuperAdminCaptainSettlements } from '../pages/SuperAdminCaptainSettlements';
import { SuperAdminPayouts } from '../pages/SuperAdminPayouts';
import { SuperAdminRefunds } from '../pages/SuperAdminRefunds';
import { SuperAdminCommissions } from '../pages/SuperAdminCommissions';
import { SuperAdminAdjustments } from '../pages/SuperAdminAdjustments';
import { SuperAdminReports } from '../pages/SuperAdminReports';
import { SuperAdminAuditLogs } from '../pages/SuperAdminAuditLogs';

// Protected Route Component for Super Admin
const SuperAdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('shippnex_super_admin_token');
  if (!token) {
    return <Navigate to="/super-admin/login" replace />;
  }
  return children;
};

const SuperAdminRoutesContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<SuperAdminLogin />} />

      {/* Protected Routes */}
      <Route
        element={
          <SuperAdminProtectedRoute>
            <SuperAdminLayout />
          </SuperAdminProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
        <Route path="/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/transactions" element={<SuperAdminTransactions />} />
        <Route path="/payments" element={<SuperAdminPayments />} />
        <Route path="/seller-settlements" element={<SuperAdminSellerSettlements />} />
        <Route path="/captain-settlements" element={<SuperAdminCaptainSettlements />} />
        <Route path="/payouts" element={<SuperAdminPayouts />} />
        <Route path="/payouts/sellers" element={<SuperAdminPayouts />} />
        <Route path="/payouts/captains" element={<SuperAdminPayouts />} />
        <Route path="/refunds" element={<SuperAdminRefunds />} />
        <Route path="/commissions" element={<SuperAdminCommissions />} />
        <Route path="/financial-adjustments" element={<SuperAdminAdjustments />} />
        <Route path="/reports" element={<SuperAdminReports />} />
        <Route path="/audit-logs" element={<SuperAdminAuditLogs />} />
        <Route path="*" element={<Navigate to="/super-admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

const SuperAdminRoutes = () => {
  return (
    <SuperAdminProvider>
      <SuperAdminRoutesContent />
    </SuperAdminProvider>
  );
};

export default SuperAdminRoutes;
