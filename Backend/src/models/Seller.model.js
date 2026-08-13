import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      trim: true,
      default: 'Seller Store',
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ownerName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    businessType: { type: String, trim: true },
    storeLogo: { type: String },
    serviceRadius: { type: Number, default: 5 },
    gstNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    fssaiLicense: { type: String, trim: true },
    tagline: { type: String, trim: true },
    bankName: { type: String, trim: true },
    accountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true },
    categories: [{ type: String }],
    commissionPercentage: {
      type: Number,
      default: 10,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    pendingBalance: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalCommissionDeducted: {
      type: Number,
      default: 0,
    },
    totalWithdrawn: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: 'seller',
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    warehouseLocation: {
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
      },
      storeAddress: String,
      state: String,
      district: String,
      city: String,
      area: String,
      pincode: String,
    },
  },
  {
    timestamps: true,
  }
);

sellerSchema.index({ 'warehouseLocation.location': '2dsphere' });

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
