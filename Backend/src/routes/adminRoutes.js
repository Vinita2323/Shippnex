import express from 'express';
import { getAllSellers, toggleSellerStatus } from '../controllers/adminController.js';

const router = express.Router();

router.get('/sellers', getAllSellers);
router.put('/sellers/:id/status', toggleSellerStatus);

export default router;
