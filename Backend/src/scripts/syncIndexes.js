import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.model.js';
import Seller from '../models/Seller.model.js';
import Captain from '../models/Captain.model.js';
import Admin from '../models/Admin.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import Category from '../models/Category.model.js';
import Banner from '../models/Banner.model.js';
import TransportBooking from '../models/TransportBooking.model.js';
import VehicleType from '../models/VehicleType.model.js';
import SellerNotification from '../models/SellerNotification.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';
import CaptainTransaction from '../models/CaptainTransaction.model.js';
import WalletTransaction from '../models/WalletTransaction.model.js';
import WithdrawalRequest from '../models/WithdrawalRequest.model.js';
import SellerMembership from '../models/SellerMembership.model.js';
import SellerMembershipPlan from '../models/SellerMembershipPlan.model.js';
import CaptainMembership from '../models/CaptainMembership.model.js';
import CaptainMembershipPlan from '../models/CaptainMembershipPlan.model.js';
import Rating from '../models/Rating.model.js';
import ProductReview from '../models/ProductReview.model.js';
import ProfileEditRequest from '../models/ProfileEditRequest.model.js';
import Policy from '../models/Policy.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const models = [
  { name: 'User', model: User },
  { name: 'Seller', model: Seller },
  { name: 'Captain', model: Captain },
  { name: 'Admin', model: Admin },
  { name: 'Product', model: Product },
  { name: 'Order', model: Order },
  { name: 'Category', model: Category },
  { name: 'Banner', model: Banner },
  { name: 'TransportBooking', model: TransportBooking },
  { name: 'VehicleType', model: VehicleType },
  { name: 'SellerNotification', model: SellerNotification },
  { name: 'CaptainNotification', model: CaptainNotification },
  { name: 'CaptainTransaction', model: CaptainTransaction },
  { name: 'WalletTransaction', model: WalletTransaction },
  { name: 'WithdrawalRequest', model: WithdrawalRequest },
  { name: 'SellerMembership', model: SellerMembership },
  { name: 'SellerMembershipPlan', model: SellerMembershipPlan },
  { name: 'CaptainMembership', model: CaptainMembership },
  { name: 'CaptainMembershipPlan', model: CaptainMembershipPlan },
  { name: 'Rating', model: Rating },
  { name: 'ProductReview', model: ProductReview },
  { name: 'ProfileEditRequest', model: ProfileEditRequest },
  { name: 'Policy', model: Policy },
];

export const syncAllIndexes = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in environment.');
    return;
  }

  let connectedHere = false;
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(uri, {
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
    });
    connectedHere = true;
    console.log('Connected to MongoDB for index synchronization...');
  }

  console.log('--- STARTING INDEX SYNCHRONIZATION ---');
  for (const { name, model } of models) {
    try {
      const result = await model.syncIndexes();
      const count = await model.collection.indexes();
      console.log(`✅ [${name}] Synced. Active indexes: ${count.length}`);
    } catch (err) {
      console.warn(`⚠️ [${name}] Index sync warning:`, err.message);
    }
  }
  console.log('--- INDEX SYNCHRONIZATION COMPLETE ---');

  if (connectedHere) {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

if (process.argv[1] && process.argv[1].endsWith('syncIndexes.js')) {
  syncAllIndexes().then(() => process.exit(0)).catch((err) => {
    console.error('Fatal index sync error:', err);
    process.exit(1);
  });
}
