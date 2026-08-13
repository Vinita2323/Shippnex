import express from 'express';
import { getAllSellers, toggleSellerStatus, updateSellerCommission } from '../controllers/adminController.js';

const router = express.Router();

router.get('/sellers', getAllSellers);
router.put('/sellers/:id/status', toggleSellerStatus);
router.put('/sellers/:id/commission', updateSellerCommission);

export default router;
