import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  seller: { type: String, default: 'ShippNex Official Store' },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String, default: '' },
      email: { type: String, default: '' },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: '' },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
      addressType: { type: String, enum: ['Home', 'Office', 'Other'], default: 'Home' },
    },
    deliverySlot: {
      date: { type: String, default: 'Today' },
      time: { type: String, default: 'Standard Delivery' },
    },
    deliveryInstructions: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'CARD', 'NETBANKING', 'WALLET', 'ONLINE'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: [
        'Placed',
        'Accepted',
        'Rejected',
        'Processing',
        'Reached Store / Pickup',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
        'Returned',
        'Return Requested',
        'Return Approved',
        'Return Rejected',
        'Refund Completed',
        'Refunded',
      ],
      default: 'Placed',
    },
    returnReason: { type: String, default: '' },
    returnStatus: {
      type: String,
      enum: [null, 'Pending', 'Approved', 'Rejected', 'Completed', 'Refunded'],
      default: null,
    },
    returnedAt: { type: Date },
    refundStatus: {
      type: String,
      enum: [null, 'Pending', 'Initiated', 'Completed', 'Failed', 'Refunded'],
      default: null,
    },
    refundedAt: { type: Date },
    sellerStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Delivered', 'DELIVERED', 'Processing', 'Cancelled'],
      default: 'Pending',
    },
    rejectionReason: { type: String, default: '' },
    acceptedAt: { type: Date },
    rejectedAt: { type: Date },
    itemsTotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    gst: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true },

    // Dynamic Commission & Earning Snapshot Fields
    sellerCommissionRate: { type: Number, default: 10 },
    sellerCommissionAmount: { type: Number, default: 0 },
    sellerEarning: { type: Number, default: 0 },
    captainCommissionRate: { type: Number, default: 5 },
    captainCommissionAmount: { type: Number, default: 0 },
    captainEarning: { type: Number, default: 0 },

    // Captain Delivery Fields
    captainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Captain',
      default: null,
    },
    captainStatus: {
      type: String,
      enum: [null, 'Assigned', 'Accepted', 'Rejected', 'At Pickup', 'Picked Up', 'In Transit', 'Delivered'],
      default: null,
    },
    deliveryOtp: { type: String, default: null },
    captainEarnings: { type: Number, default: 0 },
    proofOfDeliveryUrl: { type: String, default: null },
    captainAssignedAt: { type: Date, default: null },
    captainPickedUpAt: { type: Date, default: null },
    captainDeliveredAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);
// Targeted query pattern indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ captainId: 1, captainStatus: 1 });
orderSchema.index({ captainId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ sellerStatus: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
