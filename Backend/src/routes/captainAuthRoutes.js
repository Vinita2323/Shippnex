import express from 'express';
import { registerCaptain, sendOtp, verifyOtp } from '../controllers/captainAuthController.js';

const router = express.Router();

router.post('/register', registerCaptain);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
