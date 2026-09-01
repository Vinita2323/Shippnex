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

// Core API Routes
app.use('', healthRoutes);
app.use('/auth/user', userAuthRoutes);
app.use('/auth/seller', sellerAuthRoutes);
app.use('/auth/captain', captainAuthRoutes);
app.use('/captain', captainRoutes);
app.use('/auth/admin', adminAuthRoutes);
app.use('/banners', bannerRoutes);
app.use('/upload', uploadRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/user/addresses', addressRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/wallet', walletRoutes);

// Membership Routes
app.use('/membership', membershipRoutes);

// Policy & Terms Routes
app.use('/policies', policyRoutes);

// Firebase Cloud Messaging (FCM) Push Notification Routes (SOP Standard)
app.use('/fcm-tokens', fcmTokenRoutes);

// Transport Module Routes
app.use('/transport/vehicles', vehicleTypeRoutes);
app.use('/transport/bookings', transportBookingRoutes);

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
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
