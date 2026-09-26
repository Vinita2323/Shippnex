import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllPricingConfigs,
  getTransportPricing,
  createTransportPricing,
  updateTransportPricing,
  activateTransportPricing,
  deleteTransportPricing,
  getDeliveryPricing,
  createDeliveryPricing,
  updateDeliveryPricing,
  activateDeliveryPricing,
  deleteDeliveryPricing,
  getActivePublicPricing,
  calculateTransportFareEstimate,
  calculateDeliveryFeeEstimate,
} from '../controllers/pricingController.js';

const router = express.Router();

// ── Public / App Routes ───────────────────────────────────────────────────────
router.get('/active', getActivePublicPricing);
router.post('/calculate-transport', calculateTransportFareEstimate);
router.post('/calculate-delivery', calculateDeliveryFeeEstimate);

// ── Protected Admin Routes ───────────────────────────────────────────────────
// Master Pricing Overview
router.get('/admin', protect('admin', 'super_admin'), getAllPricingConfigs);

// Transport Pricing CRUD
router.get('/admin/transport', protect('admin', 'super_admin'), getTransportPricing);
router.post('/admin/transport', protect('admin', 'super_admin'), createTransportPricing);
router.put('/admin/transport/:id', protect('admin', 'super_admin'), updateTransportPricing);
router.patch('/admin/transport/:id/activate', protect('admin', 'super_admin'), activateTransportPricing);
router.delete('/admin/transport/:id', protect('admin', 'super_admin'), deleteTransportPricing);

// Delivery Pricing CRUD
router.get('/admin/delivery', protect('admin', 'super_admin'), getDeliveryPricing);
router.post('/admin/delivery', protect('admin', 'super_admin'), createDeliveryPricing);
router.put('/admin/delivery/:id', protect('admin', 'super_admin'), updateDeliveryPricing);
router.patch('/admin/delivery/:id/activate', protect('admin', 'super_admin'), activateDeliveryPricing);
router.delete('/admin/delivery/:id', protect('admin', 'super_admin'), deleteDeliveryPricing);

export default router;
