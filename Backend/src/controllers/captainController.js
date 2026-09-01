import mongoose from 'mongoose';
import Captain from '../models/Captain.model.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Seller from '../models/Seller.model.js';
import CaptainTransaction from '../models/CaptainTransaction.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';
import SellerNotification from '../models/SellerNotification.model.js';

// ──────────────────────────────────────────────
// Helper: Generate unique IDs & query builder
// ──────────────────────────────────────────────
const generateTxnId = () => `CTX-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
const generateDeliveryOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

const buildOrderQuery = (orderId, extra = {}) => {
  const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
  return {
    ...(isMongoId ? { $or: [{ _id: orderId }, { orderId }] } : { orderId }),
    ...extra,
  };
};

// ──────────────────────────────────────────────
// GET /api/captain/profile
// ──────────────────────────────────────────────
export const getProfile = async (req, res, next) => {
  try {
    const captain = await Captain.findById(req.user.id).select('-otp -otpExpiry');
    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }
    res.json({ success: true, captain });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/profile
// ──────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      email,
      alternateMobile,
      dob,
      age,
      fatherName,
      currentAddress,
      permanentAddress,
      city,
      state,
      pinCode,
      emergencyContact,
      drivingLicenseNumber,
      rcNumber,
      vehicleInsuranceNumber,
      insuranceValidTill,
      vehicleType,
      documents,
      bankDetails,
    } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (alternateMobile !== undefined) updateFields.alternateMobile = alternateMobile;
    if (dob !== undefined) updateFields.dob = dob;
    if (age !== undefined) updateFields.age = age;
    if (fatherName !== undefined) updateFields.fatherName = fatherName;
    if (currentAddress !== undefined) updateFields.currentAddress = currentAddress;
    if (permanentAddress !== undefined) updateFields.permanentAddress = permanentAddress;
    if (city !== undefined) updateFields.city = city;
    if (state !== undefined) updateFields.state = state;
    if (pinCode !== undefined) updateFields.pinCode = pinCode;
    if (emergencyContact !== undefined) updateFields.emergencyContact = emergencyContact;
    if (drivingLicenseNumber !== undefined) updateFields.drivingLicenseNumber = drivingLicenseNumber;
    if (rcNumber !== undefined) updateFields.rcNumber = rcNumber;
    if (vehicleInsuranceNumber !== undefined) updateFields.vehicleInsuranceNumber = vehicleInsuranceNumber;
    if (insuranceValidTill !== undefined) updateFields.insuranceValidTill = insuranceValidTill;
    if (vehicleType !== undefined) updateFields.vehicleType = vehicleType;

    if (documents && typeof documents === 'object') {
      for (const [k, v] of Object.entries(documents)) {
        updateFields[`documents.${k}`] = v;
      }
    }

    if (bankDetails && typeof bankDetails === 'object') {
      for (const [k, v] of Object.entries(bankDetails)) {
        updateFields[`bankDetails.${k}`] = v;
      }
    }

    const captain = await Captain.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: false }
    );

    if (!captain) {
      return res.status(404).json({ success: false, message: 'Captain not found' });
    }

    console.log(`[Captain updateProfile] Updated DB for captain ${captain.name} (${captain._id}), doc keys:`, Object.keys(captain.documents || {}));

    res.json({ success: true, message: 'Profile updated successfully', captain });
  } catch (error) {
    console.error('[Captain updateProfile Error]:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/status
// ──────────────────────────────────────────────
export const updateOnlineStatus = async (req, res, next) => {
  try {
    const { isOnline } = req.body;
    const captain = await Captain.findByIdAndUpdate(
      req.user.id,
      { isOnline: Boolean(isOnline) },
      { new: true }
    ).select('isOnline name');

    res.json({ success: true, isOnline: captain.isOnline });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/location
// ──────────────────────────────────────────────
export const updateLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ success: false, message: 'lat and lng are required' });
    }
    await Captain.findByIdAndUpdate(req.user.id, {
      liveLocation: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
    });
    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/captain/dashboard
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
export const getDashboardStats = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const captain = await Captain.findById(captainId).select('name walletBalance isOnline');
    if (!captain) return res.status(404).json({ success: false, message: 'Captain not found' });

    const isMongoId = mongoose.Types.ObjectId.isValid(captainId);
    const captainQuery = isMongoId ? { $in: [captainId, new mongoose.Types.ObjectId(captainId)] } : captainId;

    // Today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Today's completed transactions (both e-commerce and transport)
    const todayTransactions = await CaptainTransaction.find({
      captainId: captainQuery,
      type: 'CREDIT',
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const todayEarnings = todayTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Today's assigned orders (E-Commerce)
    const todayOrders = await Order.find({
      captainId: captainQuery,
      captainAssignedAt: { $gte: startOfDay, $lte: endOfDay },
    }).select('captainStatus orderId shippingAddress items captainEarnings createdAt deliverySlot');

    // ── Transport Bookings Integration ──
    const { default: TransportBooking } = await import('../models/TransportBooking.model.js');
    const { getVehicleMatchPattern } = await import('./transportBookingController.js');

    const todayCompletedTransport = await TransportBooking.countDocuments({
      captainId: captainQuery,
      status: 'RIDE_COMPLETED',
      updatedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const deliveredToday = todayOrders.filter((o) => o.captainStatus === 'Delivered').length + todayCompletedTransport;
    const pendingOrders = await Order.find({
      $or: [
        { captainId: captainQuery, captainStatus: { $in: ['Assigned', 'Accepted', 'Reached Store', 'At Pickup', 'Picked Up', 'In Transit', 'Out for Delivery'] } },
        { captainStatus: 'Assigned' },
      ],
    })
      .populate('user', 'name phone email')
      .select('orderId shippingAddress captainStatus captainEarnings deliverySlot items createdAt captainAssignedAt paymentMethod paymentStatus itemsTotal grandTotal deliveryInstructions');

    const vehiclePattern = getVehicleMatchPattern(captain.vehicleType);

    const transportQuery = {
      status: 'SEARCHING_CAPTAIN',
      captainRequests: {
        $not: {
          $elemMatch: {
            captainId: new mongoose.Types.ObjectId(captainId),
            status: 'REJECTED',
          },
        },
      },
    };

    if (vehiclePattern) {
      transportQuery.$or = [
        { 'vehicleSnapshot.name': { $regex: vehiclePattern, $options: 'i' } },
        { 'vehicleSnapshot.slug': { $regex: vehiclePattern, $options: 'i' } },
      ];
    }

    // Pending Transport Requests matching captain vehicle
    const transportRequests = await TransportBooking.find(transportQuery)
      .populate('user', 'name phone email')
      .populate('vehicleTypeId', 'name slug icon')
      .sort({ createdAt: -1 })
      .limit(10);

    // Active Transport Ride assigned to this captain
    const activeTransport = await TransportBooking.findOne({
      captainId,
      status: {
        $in: [
          'CAPTAIN_ASSIGNED',
          'CAPTAIN_ARRIVING',
          'CAPTAIN_REACHED_PICKUP',
          'RIDE_STARTED',
          'CAPTAIN_REACHED_DROP',
        ],
      },
    })
      .populate('user', 'name phone email')
      .populate('vehicleTypeId', 'name slug icon');

    // Weekly earnings (last 7 days)
    const weeklyData = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTxns = await CaptainTransaction.find({
        captainId,
        type: 'CREDIT',
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });
      const dayTotal = dayTxns.reduce((sum, t) => sum + t.amount, 0);
      weeklyData.push({ day: days[day.getDay()], value: dayTotal });
    }

    // Total bookings (both Orders & Transport Bookings)
    const totalOrderBookings = await Order.countDocuments({ captainId });
    const totalTransportBookings = await TransportBooking.countDocuments({ captainId });
    const totalBookings = totalOrderBookings + totalTransportBookings;

    const formattedTransportRequests = transportRequests.map((b) => {
      const myReq = b.captainRequests?.find((r) => r.captainId.toString() === captainId);
      return {
        _id: b._id,
        bookingId: b.bookingId,
        pickupLocation: b.pickupLocation,
        dropLocation: b.dropLocation,
        goods: b.goods,
        vehicleSnapshot: b.vehicleSnapshot,
        distanceKm: b.distanceKm,
        estimatedDurationMin: b.estimatedDurationMin,
        paymentMethod: b.paymentMethod,
        paymentStatus: b.paymentStatus,
        captainEarnings: myReq?.earnings || b.captainEarnings || Math.round((b.fareBreakdown?.totalFare || 0) * 0.8),
        customerName: b.user?.name || 'Customer',
        customerPhone: b.user?.phone || '',
        customerEmail: b.user?.email || '',
        createdAt: b.createdAt,
        isTransport: true,
      };
    });

    let formattedActiveTransport = null;
    if (activeTransport) {
      const myReq = activeTransport.captainRequests?.find((r) => r.captainId.toString() === captainId);
      formattedActiveTransport = {
        ...activeTransport.toObject(),
        captainEarnings: myReq?.earnings || activeTransport.captainEarnings || Math.round((activeTransport.fareBreakdown?.totalFare || 0) * 0.8),
        customerName: activeTransport.user?.name || 'Customer',
        customerPhone: activeTransport.user?.phone || '',
        customerEmail: activeTransport.user?.email || '',
        isTransport: true,
      };
    }

    const totalPending = pendingOrders.length + formattedTransportRequests.length + (formattedActiveTransport ? 1 : 0);

    res.json({
      success: true,
      stats: {
        captainName: captain.name,
        isOnline: captain.isOnline,
        walletBalance: captain.walletBalance,
        todayEarnings,
        totalBookings,
        deliveredToday,
        pendingCount: totalPending,
        totalAssignedToday: todayOrders.length,
      },
      pendingOrders: pendingOrders,
      transportRequests: formattedTransportRequests,
      activeTransport: formattedActiveTransport,
      weeklyEarnings: weeklyData,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/captain/jobs?tab=deliveries|bookings|completed
// ──────────────────────────────────────────────
export const getJobs = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { tab = 'deliveries' } = req.query;

    if (tab === 'completed') {
      const completedOrders = await Order.find({ captainId, captainStatus: 'Delivered' })
        .populate('user', 'name phone')
        .sort({ updatedAt: -1, captainAssignedAt: -1 })
        .limit(50);

      const { default: TransportBooking } = await import('../models/TransportBooking.model.js');
      const completedTransport = await TransportBooking.find({ captainId, status: 'RIDE_COMPLETED' })
        .populate('user', 'name phone')
        .sort({ updatedAt: -1, createdAt: -1 })
        .limit(50);

      const formattedTransport = completedTransport.map((b) => ({
        _id: b._id,
        orderId: b.bookingId,
        bookingId: b.bookingId,
        captainEarnings: b.captainEarnings || Math.round((b.fareBreakdown?.totalFare || 0) * 0.8),
        captainStatus: 'Delivered',
        isTransport: true,
        user: b.user,
        shippingAddress: {
          fullName: b.user?.name || 'Customer',
          phone: b.user?.phone || '',
          addressLine1: b.dropLocation?.address || '',
          city: b.dropLocation?.city || '',
          state: b.dropLocation?.state || '',
        },
        pickupLocation: b.pickupLocation,
        dropLocation: b.dropLocation,
        goods: b.goods,
        items: [{ name: b.goods?.category || 'Transport Ride', quantity: b.goods?.packages || 1 }],
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      }));

      const allCompleted = [...completedOrders.map((o) => o.toObject()), ...formattedTransport].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );

      return res.json({ success: true, orders: allCompleted, count: allCompleted.length });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(captainId);
    const captainQuery = isMongoId ? { $in: [captainId, new mongoose.Types.ObjectId(captainId)] } : captainId;

    let query = { captainId: captainQuery };
    if (tab === 'deliveries' || tab === 'bookings') {
      // Both "deliveries" and "bookings" show assigned/active jobs
      query.captainStatus = { $in: ['Assigned', 'Accepted', 'Reached Store', 'At Pickup', 'Picked Up', 'In Transit', 'Out for Delivery'] };
    }

    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .sort({ captainAssignedAt: -1 })
      .limit(50);

    res.json({ success: true, orders, count: orders.length });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/jobs/:orderId/accept
// ──────────────────────────────────────────────
export const acceptJob = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const captainId = req.user.id;
    const isMongoId = mongoose.Types.ObjectId.isValid(captainId);
    const captainQuery = isMongoId ? { $in: [captainId, new mongoose.Types.ObjectId(captainId)] } : captainId;

    // Find and update order assigned to captain or available for acceptance
    const query = buildOrderQuery(orderId, {
      $or: [
        { captainId: captainQuery, captainStatus: { $in: ['Assigned', 'Accepted'] } },
        { captainStatus: 'Assigned' },
      ],
    });

    const order = await Order.findOneAndUpdate(
      query,
      {
        $set: {
          captainId: req.user.id,
          captainStatus: 'Accepted',
          captainAssignedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      const existing = await Order.findOne(buildOrderQuery(orderId));
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.status(400).json({ success: false, message: 'Order is not assigned to you or cannot be accepted' });
    }

    try {
      await SellerNotification.updateMany(
        { order: order._id },
        { $set: { status: 'Captain Accepted' } }
      );
    } catch (notifErr) {
      console.warn('[acceptJob] SellerNotification update error:', notifErr.message);
    }

    console.log(`[Captain acceptJob] Captain ${captainId} accepted Order #${order.orderId}`);
    res.json({ success: true, message: 'Job accepted', order });
  } catch (error) {
    console.error('[acceptJob ERROR]', error);
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/jobs/:orderId/reject
// ──────────────────────────────────────────────
export const rejectJob = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const captainId = req.user.id;

    const query = buildOrderQuery(orderId, { captainId });

    const order = await Order.findOneAndUpdate(
      query,
      {
        $set: {
          captainStatus: 'Rejected',
          captainId: null,
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not assigned to you' });
    }

    console.log(`[Captain rejectJob] Captain ${captainId} rejected Order #${order.orderId}`);
    res.json({ success: true, message: 'Job rejected', order });
  } catch (error) {
    console.error('[rejectJob ERROR]', error);
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/jobs/:orderId/status
// body: { status: 'Picked Up' | 'In Transit' | 'Delivered' }
// ──────────────────────────────────────────────
export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const captainId = req.user.id;

    const validStatuses = ['Accepted', 'At Pickup', 'Picked Up', 'In Transit', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const query = buildOrderQuery(orderId, { captainId });
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updates = { captainStatus: status };

    if (status === 'At Pickup') {
      updates.orderStatus = 'Reached Store / Pickup';
      try {
        await SellerNotification.updateMany(
          { order: order._id },
          { $set: { status: 'Reached Store' } }
        );
      } catch (err) {
        console.warn('[updateDeliveryStatus] Notification update error:', err.message);
      }
    }

    if (status === 'Picked Up' || status === 'In Transit') {
      updates.captainStatus = 'In Transit';
      updates.captainPickedUpAt = order.captainPickedUpAt || new Date();
      updates.orderStatus = 'Out for Delivery';
      try {
        await SellerNotification.updateMany(
          { order: order._id },
          { $set: { status: 'OUT_FOR_DELIVERY' } }
        );
      } catch (err) {
        console.warn('[updateDeliveryStatus] Notification update error:', err.message);
      }
    }

    if (status === 'Delivered') {
      updates.captainDeliveredAt = new Date();
      updates.orderStatus = 'Delivered';
      updates.status = 'Delivered';
      updates.isDelivered = true;
      updates.deliveredAt = new Date();

      if (req.body.proofUrl || req.body.proofOfDeliveryUrl) {
        updates.proofOfDeliveryUrl = req.body.proofUrl || req.body.proofOfDeliveryUrl;
      }

      try {
        await SellerNotification.updateMany(
          { order: order._id },
          {
            $set: {
              status: 'DELIVERED',
              ...(updates.proofOfDeliveryUrl ? { proofOfDeliveryUrl: updates.proofOfDeliveryUrl } : {}),
            },
          }
        );
      } catch (err) {
        console.warn('[updateDeliveryStatus] Notification update error:', err.message);
      }

      // Credit captain wallet
      const captain = await Captain.findById(captainId);
      if (captain) {
        const earnings = order.captainEarnings || 0;
        if (earnings > 0) {
          const balBefore = captain.walletBalance || 0;
          captain.walletBalance = balBefore + earnings;
          await captain.save();

          await CaptainTransaction.create({
            transactionId: generateTxnId(),
            captainId,
            order: order._id,
            orderId: order.orderId,
            type: 'CREDIT',
            amount: earnings,
            balanceBefore: balBefore,
            balanceAfter: captain.walletBalance,
            description: `Delivery completed for Order #${order.orderId}`,
            status: 'COMPLETED',
          });

          await CaptainNotification.create({
            captainId,
            type: 'PAYMENT',
            title: 'Payment Credited!',
            message: `₹${earnings.toFixed(2)} credited to your wallet for Order #${order.orderId}`,
            orderId: order.orderId,
            order: order._id,
            amount: earnings,
            icon: 'account_balance_wallet',
          });
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      { $set: updates },
      { new: true }
    );

    console.log(`[Captain updateDeliveryStatus] Order #${order.orderId} updated to captainStatus="${updates.captainStatus}", orderStatus="${updates.orderStatus || order.orderStatus}"`);

    res.json({ success: true, message: `Status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    console.error('[updateDeliveryStatus ERROR]', error);
    next(error);
  }
};

// ──────────────────────────────────────────────
// POST /api/captain/jobs/:orderId/verify-otp
// body: { otp: '1234' }
// ──────────────────────────────────────────────
export const verifyDeliveryOtp = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { otp } = req.body;
    const captainId = req.user.id;

    const query = buildOrderQuery(orderId, { captainId });
    const order = await Order.findOne(query).populate('user', 'name phone').populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Allow dev bypass with '0000'
    if (order.deliveryOtp !== otp && otp !== '0000') {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please ask the recipient.' });
    }

    res.json({ success: true, message: 'OTP verified successfully', order });
  } catch (error) {
    console.error('[verifyDeliveryOtp ERROR]', error);
    next(error);
  }
};

// ──────────────────────────────────────────────
// POST /api/captain/jobs/:orderId/proof
// body: { proofUrl: 'https://...' }
// ──────────────────────────────────────────────
export const submitProofOfDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { proofUrl } = req.body;
    const captainId = req.user.id;

    const query = buildOrderQuery(orderId, { captainId });
    const order = await Order.findOneAndUpdate(
      query,
      { $set: { proofOfDeliveryUrl: proofUrl } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    try {
      await SellerNotification.updateMany(
        { order: order._id },
        { $set: { proofOfDeliveryUrl: proofUrl } }
      );
    } catch (err) {
      console.warn('[submitProofOfDelivery] Notification update error:', err.message);
    }

    console.log(`[Captain submitProofOfDelivery] Saved proof of delivery for Order #${order.orderId}`);

    res.json({ success: true, message: 'Proof submitted', proofUrl });
  } catch (error) {
    console.error('[submitProofOfDelivery ERROR]', error);
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/captain/active-delivery
// ──────────────────────────────────────────────
export const getActiveDelivery = async (req, res, next) => {
  try {
    const captainId = req.user.id;

    let order = await Order.findOne({
      captainId,
      captainStatus: { $in: ['Accepted', 'At Pickup', 'Picked Up', 'In Transit'] },
    })
      .populate('user', 'name phone email')
      .sort({ captainAssignedAt: -1 });

    if (!order) {
      return res.json({ success: true, order: null, message: 'No active delivery' });
    }

    if (!order.deliveryOtp && order.orderStatus !== 'Delivered') {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      order.deliveryOtp = generatedOtp;
      await Order.findByIdAndUpdate(order._id, { deliveryOtp: generatedOtp });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/captain/wallet
// ──────────────────────────────────────────────
export const getWallet = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const captain = await Captain.findById(captainId).select('walletBalance bankDetails name');
    if (!captain) return res.status(404).json({ success: false, message: 'Captain not found' });

    // Weekly breakdown — last 7 days earnings
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    // Breakdown by order type (using description)
    const weeklyTransactions = await CaptainTransaction.find({
      captainId,
      type: 'CREDIT',
      createdAt: { $gte: startOfWeek },
    });

    const fromDeliveries = weeklyTransactions
      .filter(t => t.description.toLowerCase().includes('delivery'))
      .reduce((sum, t) => sum + t.amount, 0);

    const fromTransport = weeklyTransactions
      .filter(t => !t.description.toLowerCase().includes('delivery'))
      .reduce((sum, t) => sum + t.amount, 0);

    const nextPayoutDate = new Date();
    nextPayoutDate.setDate(nextPayoutDate.getDate() + ((2 - nextPayoutDate.getDay() + 7) % 7 || 7));

    res.json({
      success: true,
      wallet: {
        balance: captain.walletBalance,
        fromDeliveries,
        fromTransport,
        bankDetails: captain.bankDetails,
        nextPayoutDate: nextPayoutDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/captain/wallet/transactions?type=All|Earnings|Withdrawals
// ──────────────────────────────────────────────
export const getTransactions = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { type = 'All' } = req.query;

    let query = { captainId };
    if (type === 'Earnings') query.type = 'CREDIT';
    if (type === 'Withdrawals') query.type = 'WITHDRAWAL';

    const transactions = await CaptainTransaction.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// POST /api/captain/wallet/withdraw
// body: { amount }
// ──────────────────────────────────────────────
export const requestWithdrawal = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { amount } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
    }

    const withdrawAmount = Number(amount);
    const captain = await Captain.findById(captainId);
    if (!captain) return res.status(404).json({ success: false, message: 'Captain not found' });

    if (captain.walletBalance < withdrawAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    const balBefore = captain.walletBalance;
    captain.walletBalance -= withdrawAmount;
    await captain.save();

    const txn = await CaptainTransaction.create({
      transactionId: generateTxnId(),
      captainId,
      type: 'WITHDRAWAL',
      amount: withdrawAmount,
      balanceBefore: balBefore,
      balanceAfter: captain.walletBalance,
      description: `Withdrawal to ${captain.bankDetails?.bankName || 'Bank'} ****${(captain.bankDetails?.accountNumber || '').slice(-4)}`,
      status: 'COMPLETED',
      bankDetails: captain.bankDetails,
    });

    await CaptainNotification.create({
      captainId,
      type: 'PAYMENT',
      title: 'Withdrawal Processed',
      message: `₹${withdrawAmount.toFixed(2)} has been transferred to your ${captain.bankDetails?.bankName || 'bank'} account.`,
      amount: withdrawAmount,
      icon: 'account_balance',
    });

    res.json({
      success: true,
      message: 'Withdrawal processed successfully',
      newBalance: captain.walletBalance,
      transaction: txn,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/captain/notifications
// ──────────────────────────────────────────────
export const getNotifications = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const isMongoId = mongoose.Types.ObjectId.isValid(captainId);
    const captainQuery = isMongoId ? { $in: [captainId, new mongoose.Types.ObjectId(captainId)] } : captainId;

    const notifications = await CaptainNotification.find({ captainId: captainQuery })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/notifications/:id/read
// ──────────────────────────────────────────────
export const markNotificationRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const captainId = req.user.id;
    const isMongoId = mongoose.Types.ObjectId.isValid(captainId);
    const captainQuery = isMongoId ? { $in: [captainId, new mongoose.Types.ObjectId(captainId)] } : captainId;

    await CaptainNotification.findOneAndUpdate(
      { _id: id, captainId: captainQuery },
      { read: true }
    );

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// PUT /api/captain/notifications/read-all
// ──────────────────────────────────────────────
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const isMongoId = mongoose.Types.ObjectId.isValid(captainId);
    const captainQuery = isMongoId ? { $in: [captainId, new mongoose.Types.ObjectId(captainId)] } : captainId;

    await CaptainNotification.updateMany({ captainId: captainQuery, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// GET /api/captain/service-areas
// Returns sellers in captain's working area/city
// ──────────────────────────────────────────────
export const getServiceAreas = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const captain = await Captain.findById(captainId).select('workingArea city liveLocation');
    if (!captain) return res.status(404).json({ success: false, message: 'Captain not found' });

    // Import Seller model inline to avoid circular deps at top
    const { default: Seller } = await import('../models/Seller.model.js');

    // Find sellers in same city/working area
    const cityFilter = captain.workingArea?.city || captain.city || '';
    let sellers = [];

    if (cityFilter) {
      sellers = await Seller.find({
        $or: [
          { 'address.city': { $regex: cityFilter, $options: 'i' } },
          { city: { $regex: cityFilter, $options: 'i' } },
        ],
        status: 'approved',
      }).select('businessName fullName address serviceRadius city').limit(20);
    }

    // If no city matched or captain has no city yet, return all approved sellers (limited)
    if (sellers.length === 0) {
      sellers = await Seller.find({ status: 'approved' })
        .select('businessName fullName address serviceRadius city')
        .limit(20);
    }

    const sellersWithStatus = sellers.map((s, idx) => ({
      _id: s._id,
      name: s.businessName || s.fullName || 'Seller',
      address: s.address?.line1 || s.address?.city || 'N/A',
      city: s.address?.city || s.city || 'N/A',
      serviceRadius: s.serviceRadius || '10 km',
      // In a real geo system, we'd calculate actual distance from captain coords
      distance: ((idx + 1) * 0.8).toFixed(1) + ' km',
      status: idx < 7 ? 'IN RANGE' : 'OUT OF RANGE',
    }));

    res.json({ success: true, sellers: sellersWithStatus, captainCity: cityFilter });
  } catch (error) {
    next(error);
  }
};
