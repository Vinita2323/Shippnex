import express from 'express';
import { sendOtp, verifyOtp, registerSeller, getSellerProfile, updateSellerProfile } from '../controllers/sellerAuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerSeller);

router.get('/profile', protect('seller'), getSellerProfile);
router.put('/profile', protect('seller'), updateSellerProfile);

export default router;

