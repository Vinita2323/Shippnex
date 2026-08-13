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
      enum: ['COD', 'UPI', 'CARD', 'NETBANKING', 'WALLET'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Placed', 'Accepted', 'Rejected', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    sellerStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
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
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
