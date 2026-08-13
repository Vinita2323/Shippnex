import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema(
  {
    withdrawalId: {
      type: String,
      required: true,
      unique: true,
    },
    sellerId: {
      type: String,
      required: true,
      index: true,
    },
    sellerName: {
      type: String,
      default: 'Seller Store',
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    bankDetails: {
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      accountHolderName: { type: String },
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
      default: 'PENDING',
    },
    adminRemark: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);
export default WithdrawalRequest;
