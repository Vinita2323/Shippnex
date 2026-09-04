import mongoose from 'mongoose';
import Seller from '../models/Seller.model.js';
import Captain from '../models/Captain.model.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import TransportBooking from '../models/TransportBooking.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';

// ==========================================
// ADMIN DASHBOARD LIVE AGGREGATIONS
// ==========================================
export const getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalCategories,
      totalSubcategories,
      totalProducts,
      productSoldOut,
      lowStockProducts,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalSellers,
      pendingSellerApprovals,
      totalCaptains,
      activeCaptains,
      todayRevenueAgg,
      totalVolumeAgg,
      recentOrders,
      topSellers,
      weeklyOrdersAgg
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }).catch(() => 0),
      Category.countDocuments({ parent: null }).catch(() => 0),
      Category.countDocuments({ parent: { $ne: null } }).catch(() => 0),
      Product.countDocuments().catch(() => 0),
      Product.countDocuments({ stock: { $lte: 0 } }).catch(() => 0),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }).catch(() => 0),
      Order.countDocuments().catch(() => 0),
      Order.countDocuments({ orderStatus: { $in: ['Delivered', 'Completed'] } }).catch(() => 0),
      Order.countDocuments({ orderStatus: { $in: ['Placed', 'Processing', 'Out for Delivery'] } }).catch(() => 0),
      Order.countDocuments({ orderStatus: 'Cancelled' }).catch(() => 0),
      Seller.countDocuments().catch(() => 0),
      Seller.countDocuments({ status: 'pending' }).catch(() => 0),
      Captain.countDocuments().catch(() => 0),
      Captain.countDocuments({ isOnline: true }).catch(() => 0),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $group: { _id: null, total: { $sum: '$grandTotal' } } }
      ]).catch(() => []),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$grandTotal' } } }
      ]).catch(() => []),
      Order.find()
        .populate('user', 'name phone email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
        .catch(() => []),
      Seller.find()
        .select('businessName ownerName phone totalEarnings walletBalance status createdAt')
        .sort({ totalEarnings: -1, walletBalance: -1 })
        .limit(10)
        .lean()
        .catch(() => []),
      Order.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$grandTotal' },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).catch(() => [])
    ]);

    const revenueToday = todayRevenueAgg?.[0]?.total || 0;
    const totalVolume = totalVolumeAgg?.[0]?.total || 0;

    // Generate last 7 days chart array (with 0 fills for empty days)
    const chartDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const found = weeklyOrdersAgg.find(item => item._id === key);
      chartDays.push({
        date: key,
        month: dayName,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orderCount : 0
      });
    }

    // Default regional hubs overview
    const warehouses = [
      { id: 'wh-1', name: 'Noida Central Hub', city: 'Noida, UP', utilization: 72, activeOrders: Math.max(1, Math.round(pendingOrders * 0.45)), capacity: '120,000 sq ft' },
      { id: 'wh-2', name: 'Gurugram Sector-18 Hub', city: 'Gurugram, HR', utilization: 64, activeOrders: Math.max(0, Math.round(pendingOrders * 0.3)), capacity: '95,000 sq ft' },
      { id: 'wh-3', name: 'Delhi Okhla Fulfillment', city: 'Delhi, DL', utilization: 88, activeOrders: Math.max(0, Math.round(pendingOrders * 0.2)), capacity: '85,000 sq ft' },
      { id: 'wh-4', name: 'Faridabad Express Hub', city: 'Faridabad, HR', utilization: 41, activeOrders: Math.max(0, Math.round(pendingOrders * 0.05)), capacity: '60,000 sq ft' }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCategories: totalCategories || (totalSubcategories > 0 ? 1 : 0),
        totalSubcategories,
        totalProducts,
        productSoldOut,
        lowStockProducts,
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalSellers,
        pendingSellerApprovals,
        totalCaptains,
        activeCaptains,
        totalWarehouses: warehouses.length,
        revenueToday,
        totalVolume,
      },
      revenueChartData: chartDays,
      recentOrders,
      topSellers,
      warehouses
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-otp -otpExpiry')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      count: sellers ? sellers.length : 0,
      sellers: sellers || []
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
