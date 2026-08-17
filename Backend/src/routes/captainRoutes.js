import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getProfile,
  updateProfile,
  updateOnlineStatus,
  updateLocation,
  getDashboardStats,
  getJobs,
  acceptJob,
  rejectJob,
  updateDeliveryStatus,
  verifyDeliveryOtp,
  submitProofOfDelivery,
  getActiveDelivery,
  getWallet,
  getTransactions,
  requestWithdrawal,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getServiceAreas,
} from '../controllers/captainController.js';

const router = express.Router();

// All routes require captain auth
const captainAuth = protect('captain');

// Profile
router.get('/profile', captainAuth, getProfile);
router.put('/profile', captainAuth, updateProfile);

// Status & Location
router.put('/status', captainAuth, updateOnlineStatus);
router.put('/location', captainAuth, updateLocation);

// Dashboard
router.get('/dashboard', captainAuth, getDashboardStats);

// Jobs
router.get('/jobs', captainAuth, getJobs);
router.put('/jobs/:orderId/accept', captainAuth, acceptJob);
router.put('/jobs/:orderId/reject', captainAuth, rejectJob);
router.put('/jobs/:orderId/status', captainAuth, updateDeliveryStatus);

// Delivery Actions
router.get('/active-delivery', captainAuth, getActiveDelivery);
router.post('/jobs/:orderId/verify-otp', captainAuth, verifyDeliveryOtp);
router.post('/jobs/:orderId/proof', captainAuth, submitProofOfDelivery);

// Wallet
router.get('/wallet', captainAuth, getWallet);
router.get('/wallet/transactions', captainAuth, getTransactions);
router.post('/wallet/withdraw', captainAuth, requestWithdrawal);

// Notifications
router.get('/notifications', captainAuth, getNotifications);
router.put('/notifications/read-all', captainAuth, markAllNotificationsRead);
router.put('/notifications/:id/read', captainAuth, markNotificationRead);

// Service Areas
router.get('/service-areas', captainAuth, getServiceAreas);

export default router;
