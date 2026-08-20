import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getFareEstimate,
  createBooking,
  getUserBookings,
  getActiveBooking,
  getBookingById,
  cancelBooking,
} from '../controllers/transportBookingController.js';

const router = express.Router();

const userAuth = protect('user');

// ── Fare Estimate (no booking created) ───────────────────────────────────────
// POST /api/transport/bookings/fare-estimate
router.post('/fare-estimate', userAuth, getFareEstimate);

// ── Bookings ──────────────────────────────────────────────────────────────────
// POST   /api/transport/bookings            — create booking
router.post('/', userAuth, createBooking);

// GET    /api/transport/bookings            — list user's bookings
router.get('/', userAuth, getUserBookings);

// GET    /api/transport/bookings/active     — get current active booking
// IMPORTANT: must be declared BEFORE /:bookingId to avoid "active" being treated as an ID
router.get('/active', userAuth, getActiveBooking);

// GET    /api/transport/bookings/:bookingId — get specific booking
router.get('/:bookingId', userAuth, getBookingById);

// PUT    /api/transport/bookings/:bookingId/cancel — cancel booking
router.put('/:bookingId/cancel', userAuth, cancelBooking);

export default router;
