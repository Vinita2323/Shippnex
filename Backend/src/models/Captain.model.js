import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const captainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'Captain Partner',
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
    email: { type: String, trim: true, lowercase: true },
    alternateMobile: { type: String, trim: true },
    dob: { type: String },
    age: { type: String },
    fatherName: { type: String, trim: true },

    // Address & Identity
    currentAddress: { type: String },
    permanentAddress: { type: String },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pinCode: { type: String, trim: true },
    emergencyContact: { type: String },
    aadhaarNumber: { type: String, trim: true },
    panCardNumber: { type: String, trim: true, uppercase: true },

    // Vehicle Details & Permits
    vehicleType: { type: String, default: 'Two Wheeler' },
    drivingLicenseNumber: { type: String, trim: true },
    rcNumber: { type: String, trim: true },
    vehicleInsuranceNumber: { type: String, trim: true },
    insuranceValidTill: { type: String },
    pucNumber: { type: String, trim: true },
    pucValidTill: { type: String },
    permitNumber: { type: String, trim: true },
    permitValidTill: { type: String },
    fitnessCertNumber: { type: String, trim: true },
    fitnessValidTill: { type: String },
    roadTaxNumber: { type: String, trim: true },
    roadTaxValidTill: { type: String },
    gpsEnabled: { type: Boolean, default: true },
    gpsDeviceId: { type: String, trim: true },

    // Uploaded Documents
    documents: {
      drivingLicense: { type: String, default: '' },
      rcDocument: { type: String, default: '' },
      aadhaarFront: { type: String, default: '' },
      aadhaarBack: { type: String, default: '' },
      insuranceDoc: { type: String, default: '' },
      pucDocument: { type: String, default: '' },
      permitDocument: { type: String, default: '' },
      fitnessDocument: { type: String, default: '' },
      roadTaxDocument: { type: String, default: '' },
      form21Document: { type: String, default: '' },
      panCard: { type: String, default: '' },
      profilePhoto: { type: String, default: '' },
    },

    // Bank Details
    bankDetails: {
      bankName: { type: String, trim: true },
      accountHolderName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, trim: true },
      branchName: { type: String, trim: true },
      upiId: { type: String, trim: true },
      panCardNumber: { type: String, trim: true },
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

    walletBalance: {
      type: Number,
      default: 0,
    },
    cashCollected: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      default: 'captain',
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
    liveLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    workingArea: {
      state: String,
      district: String,
      city: String,
      area: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    // Rating fields (Calculated from User reviews)
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
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
    collection: 'captains',
  }
);

captainSchema.index({ liveLocation: '2dsphere' });
captainSchema.index({ status: 1, isOnline: 1 });
captainSchema.index({ vehicleType: 1, status: 1, isOnline: 1 });
captainSchema.index({ accountStatus: 1, createdAt: -1 });
captainSchema.index({ createdAt: -1 });

// Hash password before saving
captainSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
captainSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const Captain = mongoose.model('Captain', captainSchema);
export default Captain;
