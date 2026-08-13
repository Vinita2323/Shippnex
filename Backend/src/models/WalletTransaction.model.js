import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    sellerId: {
      type: String,
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    orderId: {
      type: String,
      required: true,
    },
    notification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SellerNotification',
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT_REVERSAL', 'WITHDRAWAL'],
      required: true,
    },
    grossAmount: {
      type: Number,
      required: true,
    },
    commissionRate: {
      type: Number,
      default: 0,
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
    netAmount: {
      type: Number,
      required: true,
    },
    balanceBefore: {
      type: Number,
      default: 0,
    },
    balanceAfter: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: 'ONLINE',
    },
    settlementStatus: {
      type: String,
      enum: ['SETTLED', 'REVERSED', 'PENDING', 'COMPLETED', 'FAILED'],
      default: 'SETTLED',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
export default WalletTransaction;
