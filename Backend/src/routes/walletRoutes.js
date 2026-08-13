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
router.get('/admin/settlements', getAdminSettlements);
router.get('/admin/withdrawals', getAdminWithdrawals);
router.put('/admin/withdrawals/:id/status', updateWithdrawalStatus);

export default router;
