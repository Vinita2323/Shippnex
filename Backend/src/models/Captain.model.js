import mongoose from 'mongoose';

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

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
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

const Captain = mongoose.model('Captain', captainSchema);
export default Captain;
