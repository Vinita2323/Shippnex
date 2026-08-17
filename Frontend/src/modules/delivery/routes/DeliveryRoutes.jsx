import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../../components/ProtectedRoute';
import CaptainLogin from '../pages/CaptainLogin';
import CaptainRegister from '../pages/CaptainRegister';
import CaptainDashboard from '../pages/CaptainDashboard';
import ActiveDelivery from '../pages/ActiveDelivery';
import CaptainJobs from '../pages/CaptainJobs';
import CaptainWallet from '../pages/CaptainWallet';
import CaptainProfile from '../pages/CaptainProfile';
import CaptainPersonalDetails from '../pages/CaptainPersonalDetails';
import LogisticsNavigation from '../pages/LogisticsNavigation';
import FinalVerification from '../pages/FinalVerification';
import NewJobRequest from '../pages/NewJobRequest';
import CaptainNotifications from '../pages/CaptainNotifications';
import CaptainServiceAreas from '../pages/CaptainServiceAreas';

const DeliveryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/captain/dashboard" replace />} />
      <Route path="/login" element={<CaptainLogin />} />
      <Route path="/register" element={<CaptainRegister />} />
      
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
      </Route>
    </Routes>
  );
};

export default DeliveryRoutes;
