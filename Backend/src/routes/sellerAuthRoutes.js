import express from 'express';
import { sendOtp, verifyOtp, registerSeller } from '../controllers/sellerAuthController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', registerSeller);

export default router;
