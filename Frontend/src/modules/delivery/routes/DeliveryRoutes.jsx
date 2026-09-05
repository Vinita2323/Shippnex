import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../../components/ProtectedRoute';
import PageSkeleton from '../../../components/PageSkeleton';
import CaptainOrderNotifier from '../components/CaptainOrderNotifier';

const CaptainLogin = lazy(() => import('../pages/CaptainLogin'));
const CaptainRegister = lazy(() => import('../pages/CaptainRegister'));
const CaptainDashboard = lazy(() => import('../pages/CaptainDashboard'));
const ActiveDelivery = lazy(() => import('../pages/ActiveDelivery'));
const CaptainJobs = lazy(() => import('../pages/CaptainJobs'));
const CaptainWallet = lazy(() => import('../pages/CaptainWallet'));
const CaptainProfile = lazy(() => import('../pages/CaptainProfile'));
const CaptainPersonalDetails = lazy(() => import('../pages/CaptainPersonalDetails'));
const LogisticsNavigation = lazy(() => import('../pages/LogisticsNavigation'));
const FinalVerification = lazy(() => import('../pages/FinalVerification'));
const NewJobRequest = lazy(() => import('../pages/NewJobRequest'));
const CaptainNotifications = lazy(() => import('../pages/CaptainNotifications'));
const CaptainServiceAreas = lazy(() => import('../pages/CaptainServiceAreas'));
const CaptainMembership = lazy(() => import('../pages/CaptainMembership'));
const CaptainPolicyPage = lazy(() => import('../pages/CaptainPolicyPage'));

const DeliveryRoutes = () => {
  return (
    <>
      <CaptainOrderNotifier />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<Navigate to="/captain/dashboard" replace />} />
          <Route path="/login" element={<CaptainLogin />} />
          <Route path="/register" element={<CaptainRegister />} />
          <Route path="/terms" element={<CaptainPolicyPage />} />
          <Route path="/privacy" element={<CaptainPolicyPage />} />
          
          {/* Protected Captain Routes */}
          <Route element={<ProtectedRoute role="captain" redirectPath="/captain/login" />}>
            <Route path="/dashboard" element={<CaptainDashboard />} />
            <Route path="/jobs" element={<CaptainJobs />} />
            <Route path="/new-job" element={<NewJobRequest />} />
            <Route path="/active-delivery" element={<ActiveDelivery />} />
            <Route path="/navigation-active" element={<LogisticsNavigation />} />
            <Route path="/delivery-verification" element={<FinalVerification />} />
            <Route path="/navigate" element={<LogisticsNavigation />} />
            <Route path="/wallet" element={<CaptainWallet />} />
            <Route path="/profile" element={<CaptainProfile />} />
            <Route path="/personal-details" element={<CaptainPersonalDetails />} />
            <Route path="/notifications" element={<CaptainNotifications />} />
            <Route path="/service-areas" element={<CaptainServiceAreas />} />
            <Route path="/membership" element={<CaptainMembership />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default DeliveryRoutes;
