import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect('user'));

router.post('/', placeOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

export default router;
