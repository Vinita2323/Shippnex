import express from 'express';
import {
  getSellerWallet,
  requestWithdrawal,
  getAdminSettlements,
  getAdminWithdrawals,
  updateWithdrawalStatus,
} from '../controllers/walletController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Seller Wallet Routes
router.get('/seller', protect('seller'), getSellerWallet);
router.post('/seller/withdraw', protect('seller'), requestWithdrawal);

// Admin Settlement & Withdrawal Management Routes
router.get('/admin/settlements', protect('admin'), getAdminSettlements);
router.get('/admin/withdrawals', protect('admin'), getAdminWithdrawals);
router.put('/admin/withdrawals/:id/status', protect('admin'), updateWithdrawalStatus);

export default router;
