import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DriverLogin from '../pages/DriverLogin';
import DriverDashboard from '../pages/DriverDashboard';
import ActiveDelivery from '../pages/ActiveDelivery';
import DriverJobs from '../pages/DriverJobs';
import DriverWallet from '../pages/DriverWallet';
import DriverProfile from '../pages/DriverProfile';
import LogisticsNavigation from '../pages/LogisticsNavigation';
import FinalVerification from '../pages/FinalVerification';
import NewJobRequest from '../pages/NewJobRequest';

const DeliveryRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/driver/dashboard" replace />} />
      <Route path="/login" element={<DriverLogin />} />
      <Route path="/dashboard" element={<DriverDashboard />} />
      <Route path="/jobs" element={<DriverJobs />} />
      <Route path="/new-job" element={<NewJobRequest />} />
      <Route path="/active-delivery" element={<ActiveDelivery />} />
      <Route path="/navigation-active" element={<LogisticsNavigation />} />
      <Route path="/delivery-verification" element={<FinalVerification />} />
      <Route path="/navigate" element={<LogisticsNavigation />} />
      <Route path="/wallet" element={<DriverWallet />} />
      <Route path="/profile" element={<DriverProfile />} />
    </Routes>
  );
};

export default DeliveryRoutes;
