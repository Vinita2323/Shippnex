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
  },
  {
    timestamps: true,
    collection: 'drivers',
  }
);

captainSchema.index({ liveLocation: '2dsphere' });

const Captain = mongoose.model('Captain', captainSchema);
export default Captain;
