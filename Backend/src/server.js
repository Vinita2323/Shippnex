import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import healthRoutes from './routes/healthRoutes.js';
import path from 'path';
import fs from 'fs';
import userAuthRoutes from './routes/userAuthRoutes.js';
import sellerAuthRoutes from './routes/sellerAuthRoutes.js';
import captainAuthRoutes from './routes/captainAuthRoutes.js';
import captainRoutes from './routes/captainRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import vehicleTypeRoutes from './routes/vehicleTypeRoutes.js';
import transportBookingRoutes from './routes/transportBookingRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import fcmTokenRoutes from './routes/fcmTokenRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static uploads folder (check both relative to file and cwd)
const uploadsDir = fs.existsSync(path.join(__dirname, '../uploads')) 
  ? path.join(__dirname, '../uploads') 
  : path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Core API Routes (Mounted under both /api and root for backwards compatibility)
const registerRoutes = (prefix = '') => {
  app.use(`${prefix}/auth/user`, userAuthRoutes);
  app.use(`${prefix}/auth/seller`, sellerAuthRoutes);
  app.use(`${prefix}/auth/captain`, captainAuthRoutes);
  app.use(`${prefix}/captain`, captainRoutes);
  app.use(`${prefix}/auth/admin`, adminAuthRoutes);
  app.use(`${prefix}/banners`, bannerRoutes);
  app.use(`${prefix}/upload`, uploadRoutes);
  app.use(`${prefix}/categories`, categoryRoutes);
  app.use(`${prefix}/products`, productRoutes);
  app.use(`${prefix}/sellers`, sellerRoutes);
  app.use(`${prefix}/cart`, cartRoutes);
  app.use(`${prefix}/wishlist`, wishlistRoutes);
  app.use(`${prefix}/user/addresses`, addressRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/wallet`, walletRoutes);
  app.use(`${prefix}/membership`, membershipRoutes);
  app.use(`${prefix}/policies`, policyRoutes);
  app.use(`${prefix}/fcm-tokens`, fcmTokenRoutes);
  app.use(`${prefix}/transport/vehicles`, vehicleTypeRoutes);
  app.use(`${prefix}/transport/bookings`, transportBookingRoutes);
};

app.use('', healthRoutes);
app.use('/api', healthRoutes);
registerRoutes('/api');
registerRoutes('');

// Base route
app.get('/', (req, res) => {
  res.send('Shippnex API Server is Running');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
