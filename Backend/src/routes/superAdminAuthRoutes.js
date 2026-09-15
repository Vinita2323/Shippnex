import express from 'express';
import { superAdminLogin, getSuperAdminProfile } from '../controllers/superAdminAuthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', superAdminLogin);
router.get('/me', protect('super_admin'), getSuperAdminProfile);

export default router;
