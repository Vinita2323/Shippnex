import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getFinancialDashboardStats,
  getLedgerTransactions,
  getPayoutRequests,
  getPayoutRequestById,
  approvePayout,
  rejectPayout,
  processPayout,
  getSellerSettlements,
  getCaptainSettlements,
  getAllCommissions,
  updateSellerCommission,
  createFinancialAdjustment,
  getFinancialAdjustments,
  getRefunds,
  processRefund,
  getAuditLogs,
  getFinancialReports,
} from '../controllers/superAdminFinancialController.js';

const router = express.Router();

// Strict security: Every route in this router REQUIRES super_admin role
const superAdminAuth = protect('super_admin');

// Financial Dashboard
router.get('/dashboard/metrics', superAdminAuth, getFinancialDashboardStats);

// Central Transaction Ledger
router.get('/transactions', superAdminAuth, getLedgerTransactions);

// Payout Management
router.get('/payouts', superAdminAuth, getPayoutRequests);
router.get('/payouts/:id', superAdminAuth, getPayoutRequestById);
router.put('/payouts/:id/approve', superAdminAuth, approvePayout);
router.put('/payouts/:id/reject', superAdminAuth, rejectPayout);
router.put('/payouts/:id/process', superAdminAuth, processPayout);

// Settlements
router.get('/settlements/sellers', superAdminAuth, getSellerSettlements);
router.get('/settlements/captains', superAdminAuth, getCaptainSettlements);

// Commission Authority
router.get('/commissions', superAdminAuth, getAllCommissions);
router.put('/sellers/:sellerId/commission', superAdminAuth, updateSellerCommission);

// Financial Adjustments
router.get('/financial-adjustments', superAdminAuth, getFinancialAdjustments);
router.post('/financial-adjustments', superAdminAuth, createFinancialAdjustment);

// Refunds
router.get('/refunds', superAdminAuth, getRefunds);
router.put('/refunds/:id/process', superAdminAuth, processRefund);

// Financial Reports
router.get('/reports', superAdminAuth, getFinancialReports);

// Financial Audit Logs
router.get('/audit-logs', superAdminAuth, getAuditLogs);

export default router;
