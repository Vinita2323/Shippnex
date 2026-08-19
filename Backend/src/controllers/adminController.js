import mongoose from 'mongoose';
import Seller from '../models/Seller.model.js';
import Captain from '../models/Captain.model.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';

// Get all sellers
export const getAllSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: sellers.length,
      sellers
    });
  } catch (error) {
    next(error);
  }
};

// Toggle seller status (Approve/Pending/Reject)
export const toggleSellerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'approved', 'pending', or 'rejected'

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    seller.status = status;
    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller status updated to ${status}`,
      seller
    });
  } catch (error) {
    next(error);
  }
};

// Update seller commission percentage (%)
export const updateSellerCommission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { commissionPercentage } = req.body;

    const commRate = Number(commissionPercentage);
    if (isNaN(commRate) || commRate < 0 || commRate > 100) {
      return res.status(400).json({ success: false, message: 'Please enter a valid commission percentage between 0 and 100' });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    seller.commissionPercentage = commRate;
    await seller.save();

    console.log(`[Admin] Updated Seller "${seller.businessName}" Commission Percentage to ${commRate}%`);

    res.status(200).json({
      success: true,
      message: `Commission percentage updated to ${commRate}% for ${seller.businessName || 'Seller'}`,
      seller,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CAPTAIN (DRIVER) MANAGEMENT CONTROLLERS
// ==========================================

// Get all Captains
export const getAllCaptains = async (req, res, next) => {
  try {
    const captains = await Captain.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: captains.length,
      captains,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle Captain Status (Approve / Pending / Reject)
export const toggleCaptainStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expecting 'approved', 'pending', or 'rejected'

    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }

    captain.status = status;
    await captain.save();

    console.log(`[Admin] Updated Captain "${captain.name}" (${captain.phone}) Status to "${status.toUpperCase()}"`);

    res.status(200).json({
      success: true,
      message: `Captain "${captain.name}" status updated to ${status.toUpperCase()}`,
      captain,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Captain
export const deleteCaptain = async (req, res, next) => {
  try {
    const { id } = req.params;
    const captain = await Captain.findByIdAndDelete(id);
    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }

    res.status(200).json({
      success: true,
      message: `Captain "${captain.name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CAPTAIN ASSIGNMENT TO ORDER
// ==========================================

// Get available (online + approved) captains for assignment
export const getAvailableCaptains = async (req, res, next) => {
  try {
    const captains = await Captain.find({ status: 'approved', isOnline: true })
      .select('name phone vehicleType city workingArea liveLocation walletBalance')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, captains, count: captains.length });
  } catch (error) {
    next(error);
  }
};

// Assign a captain to an order
export const assignCaptainToOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { captainId, captainEarnings = 0 } = req.body;

    if (!captainId) {
      return res.status(400).json({ success: false, message: 'captainId is required' });
    }

    const captain = await Captain.findById(captainId);
    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    const order = await Order.findOne(
      isMongoId ? { $or: [{ _id: orderId }, { orderId }] } : { orderId }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Generate 4-digit delivery OTP
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const updates = {
      captainId,
      captainStatus: 'Assigned',
      deliveryOtp,
      captainEarnings: Number(captainEarnings),
      captainAssignedAt: new Date(),
    };
    if (order.orderStatus === 'Processing') {
      updates.orderStatus = 'Out for Delivery';
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      { $set: updates },
      { new: true }
    );

    // Notify the captain
    await CaptainNotification.create({
      captainId,
      type: 'JOB_ASSIGNED',
      title: 'New Delivery Assigned!',
      message: `Order #${order.orderId} has been assigned to you. Payout: ₹${captainEarnings}. Report to pickup location.`,
      orderId: order.orderId,
      order: order._id,
      amount: Number(captainEarnings),
      icon: 'local_shipping',
    });

    console.log(`[Admin] Assigned Captain "${captain.name}" to Order #${order.orderId}. OTP: ${deliveryOtp}`);

    res.status(200).json({
      success: true,
      message: `Captain "${captain.name}" assigned to Order #${order.orderId}`,
      deliveryOtp,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders with captain assignment status (for admin order management)
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name phone email')
      .populate('captainId', 'name phone vehicleType')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, orders, count: orders.length });
  } catch (error) {
    next(error);
  }
};
