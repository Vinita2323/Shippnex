import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getDashboardStats,
  getAllUsers,
  getAllSellers, 
  toggleSellerStatus, 
  updateSellerCommission,
  getAllCaptains,
  toggleCaptainStatus,
  deleteCaptain,
  getAvailableCaptains,
  assignCaptainToOrder,
  getAdminOrders,
} from '../controllers/adminController.js';

const router = express.Router();

// Live Dashboard Stats
router.get('/dashboard/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);

// Seller Management
router.get('/sellers', getAllSellers);
router.put('/sellers/:id/status', toggleSellerStatus);
// Commission updates are strictly revoked from Admin and restricted to Super Admin
router.put('/sellers/:id/commission', protect('super_admin'), updateSellerCommission);

// Captain Management
router.get('/captains', getAllCaptains);
router.put('/captains/:id/status', toggleCaptainStatus);
router.delete('/captains/:id', deleteCaptain);
router.get('/captains/available', getAvailableCaptains);

// Order Management (Admin)
router.get('/orders', getAdminOrders);
router.put('/orders/:orderId/assign-captain', assignCaptainToOrder);

export default router;

