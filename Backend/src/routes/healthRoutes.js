import express from 'express';
import { dbState } from '../config/db.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Shippnex Backend API is running smoothly',
    db: dbState,
    timestamp: new Date().toISOString(),
  });
});

export default router;
