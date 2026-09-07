import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    password: {
      type: String,
    },
    ownerName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    businessType: { type: String, trim: true },
    storeLogo: { type: String },
    serviceRadius: { type: Number, default: 5 },
    gstNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },
    fssaiLicense: { type: String, trim: true },
    gstPhoto: { type: String },
    bankPassbookPhoto: { type: String },
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
    accountStatus: {
      type: String,
      enum: ['pending_otp', 'under_review', 'approved', 'rejected', 'suspended'],
      default: 'pending_otp',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'under_review', 'pending_otp', 'suspended'],
      default: 'pending',
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'expired', 'pending_payment', 'none'],
      default: 'none',
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
    // FCM Push Notification Tokens (SOP Standard)
    fcmTokens: {
      type: [String],
      default: [],
    },
    fcmTokenMobile: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

sellerSchema.index({ 'warehouseLocation.location': '2dsphere' }, { sparse: true });

// Hash password before saving
sellerSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
