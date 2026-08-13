import mongoose from 'mongoose';

const sellerNotificationItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const sellerNotificationSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
      index: true,
    },
    sellerName: {
      type: String,
      default: 'Seller Store',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    items: [sellerNotificationItemSchema],
    customerDetails: {
      name: { type: String, default: 'Customer' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    deliveryAddress: {
      fullName: { type: String },
      phone: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      addressType: { type: String, default: 'Home' },
    },
    deliverySlot: {
      date: { type: String, default: 'Today' },
      time: { type: String, default: 'Standard Delivery' },
    },
    paymentMethod: {
      type: String,
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'VIEWED', 'ACCEPTED', 'REJECTED', 'PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'Accepted', 'Rejected', 'Out for Delivery', 'Delivered', 'Processing', 'Placed'],
      default: 'NEW',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    commissionRate: {
      type: Number,
      default: 10,
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
    netSellerAmount: {
      type: Number,
      default: 0,
    },
    settlementStatus: {
      type: String,
      enum: ['PENDING', 'SETTLED', 'FAILED', 'REVERSED'],
      default: 'PENDING',
    },
    viewedAt: { type: Date },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    settledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const SellerNotification = mongoose.model('SellerNotification', sellerNotificationSchema);
export default SellerNotification;
