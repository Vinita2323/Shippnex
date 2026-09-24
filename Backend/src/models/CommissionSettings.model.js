import mongoose from 'mongoose';

const commissionAuditHistorySchema = new mongoose.Schema(
  {
    sellerCommission: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    captainCommission: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    sellerCommissionType: {
      type: String,
      default: 'Percentage',
    },
    captainCommissionType: {
      type: String,
      default: 'Percentage',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    changedBy: {
      type: String,
      default: 'Admin',
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      default: 'Commission configuration updated',
      trim: true,
    },
  },
  { _id: false }
);

const commissionSettingsSchema = new mongoose.Schema(
  {
    sellerCommission: {
      type: Number,
      required: true,
      min: [0, 'Seller commission percentage cannot be negative'],
      max: [100, 'Seller commission percentage cannot exceed 100%'],
      default: 10,
    },
    captainCommission: {
      type: Number,
      required: true,
      min: [0, 'Captain commission percentage cannot be negative'],
      max: [100, 'Captain commission percentage cannot exceed 100%'],
      default: 5,
    },
    sellerCommissionType: {
      type: String,
      enum: ['Percentage'],
      default: 'Percentage',
    },
    captainCommissionType: {
      type: String,
      enum: ['Percentage'],
      default: 'Percentage',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    updatedBy: {
      type: String,
      default: 'Admin',
    },
    history: [commissionAuditHistorySchema],
  },
  {
    timestamps: true,
    collection: 'commissionsettings',
  }
);

// Helper to get or initialize active settings singleton
commissionSettingsSchema.statics.getOrCreateActiveSettings = async function () {
  let settings = await this.findOne({}).sort({ createdAt: -1 });
  if (!settings) {
    settings = await this.create({
      sellerCommission: 10,
      captainCommission: 5,
      sellerCommissionType: 'Percentage',
      captainCommissionType: 'Percentage',
      isActive: true,
      updatedBy: 'System Initializer',
      history: [
        {
          sellerCommission: 10,
          captainCommission: 5,
          sellerCommissionType: 'Percentage',
          captainCommissionType: 'Percentage',
          isActive: true,
          changedBy: 'System Initializer',
          changedAt: new Date(),
          reason: 'Initial system default commission configuration (Seller: 10%, Captain: 5%)',
        },
      ],
    });
  }
  return settings;
};

const CommissionSettings = mongoose.model('CommissionSettings', commissionSettingsSchema);

export default CommissionSettings;
