import mongoose from 'mongoose';
import Seller from '../models/Seller.model.js';
import Captain from '../models/Captain.model.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import TransportBooking from '../models/TransportBooking.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';
import Referral from '../models/Referral.model.js';
import ReferralSettings from '../models/ReferralSettings.model.js';
import { processReferralReward } from './referralController.js';
import { invalidateUserOrdersCache } from './orderController.js';

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
      Seller.countDocuments({ $or: [{ status: 'pending' }, { status: 'under_review' }, { accountStatus: 'under_review' }] }).catch(() => 0),
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
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = req.query.limit ? Number(req.query.limit) : 200;

    let dbQuery = User.find({ role: { $ne: 'admin' } })
      .select('-otp -otpExpiry')
      .sort({ createdAt: -1 })
      .lean();

    if (limit > 0) {
      dbQuery = dbQuery.skip((page - 1) * limit).limit(limit);
    }

    const [users, total, orderStatsAgg, returnOrders] = await Promise.all([
      dbQuery,
      User.countDocuments({ role: { $ne: 'admin' } }),
      Order.aggregate([
        {
          $group: {
            _id: '$user',
            totalOrders: { $sum: 1 },
            totalReturns: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      '$orderStatus',
                      ['Returned', 'Return Requested', 'Return Approved', 'Return Rejected', 'Return']
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            totalSpent: {
              $sum: {
                $cond: [
                  { $in: ['$orderStatus', ['Cancelled', 'Rejected']] },
                  0,
                  { $ifNull: ['$grandTotal', 0] }
                ]
              }
            },
            lastOrderDate: { $max: '$createdAt' }
          }
        }
      ]).catch((err) => {
        console.error('[Admin] Error in orderStatsAgg:', err);
        return [];
      }),
      Order.find({
        $or: [
          {
            orderStatus: {
              $in: ['Returned', 'Return Requested', 'Return Approved', 'Return Rejected', 'Return']
            }
          },
          {
            returnStatus: {
              $in: ['Requested', 'Pending', 'Approved', 'Rejected', 'Completed', 'Return Requested']
            }
          }
        ]
      })
        .populate('user', 'name phone email addresses')
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(100)
        .lean()
        .catch((err) => {
          console.error('[Admin] Error in returnOrders query:', err);
          return [];
        })
    ]);

    // Map stats by User ObjectId string
    const statsMap = new Map();
    orderStatsAgg.forEach((stat) => {
      if (stat._id) {
        statsMap.set(String(stat._id), stat);
      }
    });

    const enrichedUsers = users.map((u) => {
      const uId = String(u._id);
      const stat = statsMap.get(uId);
      return {
        ...u,
        ordersCount: stat ? stat.totalOrders : 0,
        returnsCount: stat ? stat.totalReturns : 0,
        totalSpent: stat ? stat.totalSpent : 0,
        lastOrderDate: stat ? stat.lastOrderDate : null,
      };
    });

    const totalOrdersPlaced = orderStatsAgg.reduce((acc, s) => acc + (s.totalOrders || 0), 0);
    const totalReturnOrders = orderStatsAgg.reduce((acc, s) => acc + (s.totalReturns || 0), 0);
    const totalRevenue = orderStatsAgg.reduce((acc, s) => acc + (s.totalSpent || 0), 0);

    res.status(200).json({
      success: true,
      count: enrichedUsers.length,
      total,
      page,
      limit: limit || total,
      users: enrichedUsers,
      returnOrders,
      overallStats: {
        totalUsers: total,
        totalOrdersPlaced,
        totalReturnOrders,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// Toggle user block status (Block / Unblock Customer)
export const toggleUserBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isBlocked, reason = '', status } = req.body;
    const adminIdentifier = req.user?.email || req.user?.name || 'Admin';

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Determine target blocked state
    let targetBlocked;
    if (isBlocked !== undefined) {
      targetBlocked = Boolean(isBlocked);
    } else if (status) {
      targetBlocked = (status.toLowerCase() === 'blocked' || status.toLowerCase() === 'suspended');
    } else {
      targetBlocked = !user.isBlocked;
    }

    user.isBlocked = targetBlocked;
    user.status = targetBlocked ? 'blocked' : 'active';
    if (targetBlocked) {
      user.blockReason = reason ? String(reason).trim() : 'Blocked by Administrator';
      user.blockedAt = new Date();
      user.blockedBy = adminIdentifier;
    } else {
      user.blockReason = '';
      user.blockedAt = null;
      user.blockedBy = '';
    }

    await user.save();

    console.log(`[Admin] User ${user.phone} (${user._id}) ${targetBlocked ? 'BLOCKED' : 'UNBLOCKED'} by ${adminIdentifier}. Reason: ${user.blockReason || 'None'}`);

    res.status(200).json({
      success: true,
      message: targetBlocked
        ? `Customer ${user.name || user.phone} has been blocked successfully.`
        : `Customer ${user.name || user.phone} has been unblocked successfully.`,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isBlocked: user.isBlocked,
        status: user.status,
        blockReason: user.blockReason,
        blockedAt: user.blockedAt,
        blockedBy: user.blockedBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Fast In-Memory Cache for Admin Listings
let sellersCache = { data: null, timestamp: 0 };
let captainsCache = { data: null, timestamp: 0 };

export const invalidateSellersCache = () => { sellersCache = { data: null, timestamp: 0 }; };
export const invalidateCaptainsCache = () => { captainsCache = { data: null, timestamp: 0 }; };

export const getAllSellers = async (req, res, next) => {
  try {
    const now = Date.now();
    // Cache for 15 seconds unless forced with ?fresh=true
    if (!req.query.fresh && sellersCache.data && (now - sellersCache.timestamp < 15000)) {
      return res.status(200).json(sellersCache.data);
    }

    const sellers = await Seller.find({})
      .select('-password -otp -otpExpiry -fcmTokens -fcmTokenMobile')
      .populate('referredBy', 'ownerName businessName phone email')
      .sort({ _id: -1 })
      .lean()
      .exec();

    const payload = {
      success: true,
      count: sellers ? sellers.length : 0,
      sellers: sellers || []
    };

    sellersCache = { data: payload, timestamp: now };
    return res.status(200).json(payload);
  } catch (error) {
    console.error('[Admin] Error fetching sellers:', error);
    next(error);
  }
};

// Toggle seller status (Approve / Pending / Under Review / Reject / Suspend)
export const toggleSellerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawStatus = (req.body.accountStatus || req.body.status || '').toLowerCase().trim();

    const validStatuses = ['approved', 'under_review', 'pending', 'rejected', 'suspended', 'pending_otp'];
    if (!validStatuses.includes(rawStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${rawStatus}` });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    if (rawStatus === 'approved') {
      if (seller.registrationFeeStatus === 'pending') {
        seller.registrationFeeStatus = 'not_required';
      }
      seller.accountStatus = 'approved';
      seller.status = 'approved';
      seller.isVerified = true;

      // Handle referral trigger on seller approval
      try {
        const cleanPhone = seller.phone ? String(seller.phone).replace(/\D/g, '').slice(-10) : '';
        let referral = await Referral.findOne({
          $or: [
            { referredId: seller._id, referredRole: 'seller' },
            ...(cleanPhone ? [
              { referredPhone: cleanPhone, referredRole: 'seller' },
              { referredPhone: `+91${cleanPhone}`, referredRole: 'seller' },
              { referredPhone: seller.phone, referredRole: 'seller' }
            ] : []),
            ...(seller.referredBy ? [{ referrerId: seller.referredBy, referredId: seller._id, referrerRole: 'seller' }] : [])
          ]
        });

        // If no referral record exists yet, but seller has referredBy, auto-create the referral record!
        if (!referral && seller.referredBy) {
          const referrerSeller = await Seller.findById(seller.referredBy);
          if (referrerSeller) {
            const settings = await ReferralSettings.getOrCreateSettings();
            referral = await Referral.create({
              referrerId: referrerSeller._id,
              referrerRole: 'seller',
              referredId: seller._id,
              referredRole: 'seller',
              referralCode: referrerSeller.referralCode || 'PROMO',
              status: 'Registered',
              rewardAmount: settings.sellerRewardAmount,
              referredPhone: cleanPhone || seller.phone || '',
              referredName: seller.businessName || seller.ownerName || 'Seller',
            });
          }
        }

        if (referral) {
          if (!referral.referredId) referral.referredId = seller._id;
          if (seller.businessName && (!referral.referredName || referral.referredName === 'Seller')) {
            referral.referredName = seller.businessName || seller.ownerName;
          }
          if (referral.status !== 'Rewarded') {
            referral.status = 'Approved';
            referral.approvedAt = new Date();
            await referral.save();

            const settings = await ReferralSettings.getOrCreateSettings();
            if (settings.sellerReferralEnabled && (settings.sellerRewardTrigger === 'admin_approval' || settings.sellerRewardTrigger === 'registration')) {
              await processReferralReward(referral._id);
            }
          }
        }
      } catch (refErr) {
        console.warn('[Admin] Referral trigger error on seller approval:', refErr.message);
      }
    } else if (rawStatus === 'rejected') {
      seller.accountStatus = 'rejected';
      seller.status = 'rejected';
    } else if (rawStatus === 'suspended') {
      seller.accountStatus = 'suspended';
      seller.status = 'suspended';
    } else if (rawStatus === 'under_review' || rawStatus === 'pending') {
      seller.accountStatus = 'under_review';
      seller.status = 'pending';
    } else if (rawStatus === 'pending_otp') {
      seller.accountStatus = 'pending_otp';
      seller.status = 'pending';
    }

    await seller.save();
    invalidateSellersCache();

    console.log(`[Admin] Updated Seller "${seller.businessName}" Status to "${seller.accountStatus.toUpperCase()}"`);

    res.status(200).json({
      success: true,
      message: `Seller status updated to ${seller.accountStatus.toUpperCase()}`,
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
    invalidateSellersCache();

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

export const getAllCaptains = async (req, res, next) => {
  try {
    const now = Date.now();
    // Cache for 15 seconds unless forced with ?fresh=true
    if (!req.query.fresh && captainsCache.data && (now - captainsCache.timestamp < 15000)) {
      return res.status(200).json(captainsCache.data);
    }

    const captains = await Captain.find({})
      .select('_id name phone email currentAddress city state pinCode vehicleType walletBalance cashCollected status accountStatus membershipStatus isVerified isOnline liveLocation workingArea createdAt updatedAt')
      .sort({ _id: -1 })
      .lean()
      .exec();

    const payload = {
      success: true,
      count: captains ? captains.length : 0,
      captains: captains || [],
    };

    captainsCache = { data: payload, timestamp: now };
    return res.status(200).json(payload);
  } catch (error) {
    console.error('[Admin] Error fetching captains:', error);
    next(error);
  }
};

// Toggle Captain Status (Approve / Pending / Under Review / Reject / Suspend)
export const toggleCaptainStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawStatus = (req.body.accountStatus || req.body.status || '').toLowerCase().trim();

    const validStatuses = ['approved', 'under_review', 'pending', 'rejected', 'suspended', 'pending_otp'];
    if (!validStatuses.includes(rawStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${rawStatus}` });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }

    if (rawStatus === 'approved') {
      captain.accountStatus = 'approved';
      captain.status = 'approved';
      captain.isVerified = true;

      // Handle referral trigger on captain approval
      try {
        const cleanPhone = captain.phone ? String(captain.phone).replace(/\D/g, '').slice(-10) : '';
        let referral = await Referral.findOne({
          $or: [
            { referredId: captain._id, referredRole: 'captain' },
            ...(cleanPhone ? [
              { referredPhone: cleanPhone, referredRole: 'captain' },
              { referredPhone: `+91${cleanPhone}`, referredRole: 'captain' },
              { referredPhone: captain.phone, referredRole: 'captain' }
            ] : []),
            ...(captain.referredBy ? [{ referrerId: captain.referredBy, referredId: captain._id, referrerRole: 'captain' }] : [])
          ]
        });

        // If no referral record exists yet, but captain has referredBy, auto-create the referral record!
        if (!referral && captain.referredBy) {
          const referrerCaptain = await Captain.findById(captain.referredBy);
          if (referrerCaptain) {
            const settings = await ReferralSettings.getOrCreateSettings();
            referral = await Referral.create({
              referrerId: referrerCaptain._id,
              referrerRole: 'captain',
              referredId: captain._id,
              referredRole: 'captain',
              referralCode: referrerCaptain.referralCode || 'PROMO',
              status: 'Registered',
              rewardAmount: settings.captainRewardAmount,
              referredPhone: cleanPhone || captain.phone || '',
              referredName: captain.name || 'Captain',
            });
          }
        }

        if (referral) {
          if (!referral.referredId) referral.referredId = captain._id;
          if (captain.name && (!referral.referredName || referral.referredName === 'Captain')) {
            referral.referredName = captain.name;
          }
          if (referral.status !== 'Rewarded') {
            referral.status = 'Approved';
            referral.approvedAt = new Date();
            await referral.save();

            const settings = await ReferralSettings.getOrCreateSettings();
            if (settings.captainReferralEnabled && (settings.captainRewardTrigger === 'admin_approval' || settings.captainRewardTrigger === 'registration')) {
              await processReferralReward(referral._id);
            }
          }
        }
      } catch (refErr) {
        console.warn('[Admin] Referral trigger error on captain approval:', refErr.message);
      }
    } else if (rawStatus === 'rejected') {
      captain.accountStatus = 'rejected';
      captain.status = 'rejected';
    } else if (rawStatus === 'suspended') {
      captain.accountStatus = 'suspended';
      captain.status = 'suspended';
    } else if (rawStatus === 'under_review' || rawStatus === 'pending') {
      captain.accountStatus = 'under_review';
      captain.status = 'pending';
    } else if (rawStatus === 'pending_otp') {
      captain.accountStatus = 'pending_otp';
      captain.status = 'pending';
    }

    await captain.save();
    invalidateCaptainsCache();

    console.log(`[Admin] Updated Captain "${captain.name}" (${captain.phone}) Status to "${captain.accountStatus.toUpperCase()}"`);

    res.status(200).json({
      success: true,
      message: `Captain "${captain.name}" status updated to ${captain.accountStatus.toUpperCase()}`,
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

    invalidateCaptainsCache();

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
      .sort({ createdAt: -1 })
      .lean();

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
      .limit(200)
      .lean();

    res.status(200).json({ success: true, orders, count: orders.length });
  } catch (error) {
    next(error);
  }
};

// Update order status from Admin panel
export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, sellerStatus, captainStatus, paymentStatus } = req.body;

    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    const order = await Order.findOne(
      isMongoId ? { $or: [{ _id: orderId }, { orderId }] } : { orderId }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (sellerStatus) order.sellerStatus = sellerStatus;
    if (captainStatus) order.captainStatus = captainStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
      if (order.paymentMethod === 'COD') {
        order.paymentStatus = 'Paid';
      }
    }

    await order.save();

    console.log(`[Admin] Updated Order #${order.orderId} status to "${order.orderStatus}"`);

    res.status(200).json({
      success: true,
      message: `Order #${order.orderId} updated successfully`,
      order
    });
  } catch (error) {
    next(error);
  }
};

// Fetch orders placed by a specific user for Admin User Detail view
export const getUserOrdersForAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const isMongoId = mongoose.Types.ObjectId.isValid(userId);
    const filter = isMongoId ? { user: userId } : { user: userId };

    const orders = await Order.find(filter)
      .populate('captainId', 'name phone vehicleType')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

// Update Return Order status (Approve / Reject / Complete Return)
export const updateReturnOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { returnStatus, orderStatus, returnReason } = req.body;

    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    const order = await Order.findOne(
      isMongoId ? { $or: [{ _id: orderId }, { orderId }] } : { orderId }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (returnStatus) order.returnStatus = returnStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (returnReason) order.returnReason = returnReason;

    if (returnStatus === 'Approved' || orderStatus === 'Returned') {
      order.returnedAt = new Date();
    }

    if (returnStatus === 'Completed' || returnStatus === 'Refunded' || orderStatus === 'Refund Completed' || orderStatus === 'Returned') {
      order.refundStatus = 'Completed';
      order.refundedAt = new Date();
    }

    await order.save();
    if (order.user) invalidateUserOrdersCache(order.user);

    res.status(200).json({
      success: true,
      message: `Return status for Order #${order.orderId} updated to "${order.returnStatus || order.orderStatus}"`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Update Seller Details (Admin)
export const updateSellerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, storeName, commission, balance } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Seller ID is required' });
    }

    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' });
    }

    // Update fields if provided
    if (name) seller.ownerName = name;
    if (storeName) seller.businessName = storeName;
    if (commission !== undefined) seller.commissionPercentage = Number(commission);
    if (balance !== undefined) seller.walletBalance = Number(balance);

    await seller.save();
    invalidateSellersCache();

    res.status(200).json({
      success: true,
      message: 'Seller details updated successfully',
      seller: {
        _id: seller._id,
        ownerName: seller.ownerName,
        businessName: seller.businessName,
        commissionPercentage: seller.commissionPercentage,
        walletBalance: seller.walletBalance,
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update Captain Details (Admin)
export const updateCaptainDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, mobile, city, address, balance, cashCollected } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Captain ID is required' });
    }

    const captain = await Captain.findById(id);
    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }

    // Update fields if provided
    if (name) captain.name = name;
    if (mobile) captain.phone = mobile;
    if (city) captain.city = city;
    if (address) captain.currentAddress = address;
    if (balance !== undefined) captain.walletBalance = Number(balance);
    if (cashCollected !== undefined) captain.cashCollected = Number(cashCollected);

    await captain.save();
    invalidateCaptainsCache();

    res.status(200).json({
      success: true,
      message: 'Captain details updated successfully',
      captain: {
        _id: captain._id,
        name: captain.name,
        phone: captain.phone,
        city: captain.city,
        currentAddress: captain.currentAddress,
        walletBalance: captain.walletBalance,
        cashCollected: captain.cashCollected,
      }
    });
  } catch (error) {
    next(error);
  }
};

