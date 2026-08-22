import mongoose from 'mongoose';
import TransportBooking from '../models/TransportBooking.model.js';
import Captain from '../models/Captain.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';
import CaptainTransaction from '../models/CaptainTransaction.model.js';
import { getVehicleMatchPattern } from './transportBookingController.js';

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
const generateRideOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
const generateTxnId = () => `CTX-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/captain/transport/requests
// Auth: Captain required
// Returns all pending transport requests for the logged-in captain with matching vehicle
// ──────────────────────────────────────────────────────────────────────────────
export const getTransportRequests = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const captain = await Captain.findById(captainId).select('vehicleType');
    const vehiclePattern = getVehicleMatchPattern(captain?.vehicleType);

    const baseQuery = {
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

    let query = { ...baseQuery };
    if (vehiclePattern) {
      const matchCount = await TransportBooking.countDocuments({
        ...baseQuery,
        $or: [
          { 'vehicleSnapshot.name': { $regex: vehiclePattern, $options: 'i' } },
          { 'vehicleSnapshot.slug': { $regex: vehiclePattern, $options: 'i' } },
        ],
      });
      if (matchCount > 0) {
        query.$or = [
          { 'vehicleSnapshot.name': { $regex: vehiclePattern, $options: 'i' } },
          { 'vehicleSnapshot.slug': { $regex: vehiclePattern, $options: 'i' } },
        ];
      }
    }

    const bookings = await TransportBooking.find(query)
      .populate('user', 'name phone')
      .populate('vehicleTypeId', 'name slug icon')
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedRequests = bookings.map((b) => {
      const myRequest = b.captainRequests?.find(
        (r) => r.captainId?.toString() === captainId
      );

      return {
        _id: b._id,
        bookingId: b.bookingId,
        pickupLocation: b.pickupLocation,
        dropLocation: b.dropLocation,
        stops: b.stops,
        distanceKm: b.distanceKm,
        estimatedDurationMin: b.estimatedDurationMin,
        goods: b.goods,
        vehicleSnapshot: b.vehicleSnapshot,
        paymentMethod: b.paymentMethod,
        estimatedEarnings:
          myRequest?.earnings ||
          b.captainEarnings ||
          Math.round((b.fareBreakdown?.totalFare || 0) * 0.8),
        sentAt: myRequest?.sentAt || b.createdAt,
        customerName: b.user?.name || 'Customer',
        customerPhone: b.user?.phone || '',
      };
    });

    res.status(200).json({
      success: true,
      count: formattedRequests.length,
      requests: formattedRequests,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PUT /api/captain/transport/requests/:bookingId/accept
// Auth: Captain required
// Atomic acceptance: only the FIRST captain can claim the booking
// Generates the initial secure Pickup OTP
// ──────────────────────────────────────────────────────────────────────────────
export const acceptTransportRequest = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { bookingId } = req.params;

    const captain = await Captain.findById(captainId);
    if (!captain || captain.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your captain account is not approved or is inactive',
      });
    }

    const now = new Date();
    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const pickupOtp = generateRideOtp();

    // Find the target booking to get the precalculated earnings
    const existing = await TransportBooking.findOne(
      isMongoId ? { $or: [{ _id: bookingId }, { bookingId }] } : { bookingId }
    );

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Transport booking not found' });
    }

    if (existing.status !== 'SEARCHING_CAPTAIN') {
      return res.status(400).json({
        success: false,
        message: 'This transport request has already been accepted by another captain or is no longer available.',
      });
    }

    const myReq = existing.captainRequests?.find(
      (r) => r.captainId.toString() === captainId
    );
    const finalEarnings =
      myReq?.earnings ||
      existing.captainEarnings ||
      Math.round(existing.fareBreakdown.totalFare * 0.8);

    // ── ATOMIC ACCEPTANCE QUERY ──
    const booking = await TransportBooking.findOneAndUpdate(
      {
        _id: existing._id,
        status: 'SEARCHING_CAPTAIN', // Concurrency lock
      },
      {
        $set: {
          status: 'CAPTAIN_ASSIGNED',
          captainId: new mongoose.Types.ObjectId(captainId),
          captainAssignedAt: now,
          captainEarnings: finalEarnings,
          pickupOtp,
          pickupOtpVerified: false,
          'captainRequests.$[elem].status': 'ACCEPTED',
          'captainRequests.$[elem].respondedAt': now,
          'captainRequests.$[others].status': 'EXPIRED',
        },
        $push: {
          statusHistory: {
            status: 'CAPTAIN_ASSIGNED',
            changedBy: 'captain',
            changedById: captainId,
            reason: `Accepted by Captain ${captain.name}`,
            timestamp: now,
          },
        },
      },
      {
        arrayFilters: [
          { 'elem.captainId': new mongoose.Types.ObjectId(captainId) },
          {
            'others.captainId': { $ne: new mongoose.Types.ObjectId(captainId) },
            'others.status': 'PENDING',
          },
        ],
        new: true,
      }
    )
      .populate('user', 'name phone')
      .populate('vehicleTypeId', 'name slug icon');

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'This transport request has already been accepted by another captain.',
      });
    }

    console.log(
      `[CaptainTransport] Captain "${captain.name}" accepted Booking ${booking.bookingId}. Payout: ₹${finalEarnings}, Pickup OTP: ${pickupOtp}`
    );

    // Confirmation notification for the captain
    await CaptainNotification.create({
      captainId,
      type: 'JOB_ASSIGNED',
      title: 'Transport Request Accepted!',
      message: `You accepted booking #${booking.bookingId}. Pickup: ${booking.pickupLocation.address}. Proceed to pickup.`,
      orderId: booking.bookingId,
      amount: finalEarnings,
      icon: 'local_shipping',
    });

    res.status(200).json({
      success: true,
      message: 'Transport request accepted successfully! Please proceed to the pickup location.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PUT /api/captain/transport/requests/:bookingId/reject
// Auth: Captain required
// Rejects request for THIS captain only; booking remains available for others
// ──────────────────────────────────────────────────────────────────────────────
export const rejectTransportRequest = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { bookingId } = req.params;
    const now = new Date();

    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const query = isMongoId
      ? { $or: [{ _id: bookingId }, { bookingId }] }
      : { bookingId };

    const booking = await TransportBooking.findOneAndUpdate(
      query,
      {
        $set: {
          'captainRequests.$[elem].status': 'REJECTED',
          'captainRequests.$[elem].respondedAt': now,
        },
      },
      {
        arrayFilters: [{ 'elem.captainId': new mongoose.Types.ObjectId(captainId) }],
        new: true,
      }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Transport booking not found' });
    }

    console.log(`[CaptainTransport] Captain ${captainId} rejected Booking ${booking.bookingId}`);

    res.status(200).json({
      success: true,
      message: 'Transport request rejected',
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/captain/transport/active
// Auth: Captain required
// Returns the ongoing active transport booking for this captain
// ──────────────────────────────────────────────────────────────────────────────
export const getActiveTransportDelivery = async (req, res, next) => {
  try {
    const captainId = req.user.id;

    const booking = await TransportBooking.findOne({
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
      .populate('vehicleTypeId', 'name slug icon')
      .sort({ captainAssignedAt: -1 });

    res.status(200).json({
      success: true,
      booking: booking || null,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PUT /api/captain/transport/active/:bookingId/status
// Auth: Captain required
// Updates ride milestone: CAPTAIN_ARRIVING -> CAPTAIN_REACHED_PICKUP -> CAPTAIN_REACHED_DROP -> RIDE_COMPLETED
// ──────────────────────────────────────────────────────────────────────────────
export const updateTransportStatus = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { bookingId } = req.params;
    const { status, proofUrl } = req.body;

    const allowedStatuses = ['CAPTAIN_ARRIVING', 'CAPTAIN_REACHED_PICKUP', 'RIDE_STARTED', 'CAPTAIN_REACHED_DROP', 'RIDE_COMPLETED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status update. Must be one of: ${allowedStatuses.join(', ')}.`,
      });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const query = {
      ...(isMongoId ? { $or: [{ _id: bookingId }, { bookingId }] } : { bookingId }),
      captainId,
    };

    const booking = await TransportBooking.findOne(query);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Transport booking not found or not assigned to you',
      });
    }

    const now = new Date();
    const updates = { status };

    if (status === 'CAPTAIN_REACHED_PICKUP') {
      updates.captainReachedPickupAt = now;
      if (!booking.pickupOtp) {
        updates.pickupOtp = generateRideOtp();
      }
    }

    if (status === 'RIDE_STARTED') {
      updates.pickupOtpVerified = true;
      updates.pickupOtpVerifiedAt = now;
      updates.rideStartedAt = now;
      if (!booking.dropOtp) {
        updates.dropOtp = generateRideOtp();
      }
    }

    if (status === 'CAPTAIN_REACHED_DROP') {
      updates.pickupOtpVerified = true;
      updates.captainReachedDropAt = now;
      if (!booking.dropOtp) {
        updates.dropOtp = generateRideOtp();
      }
    }

    if (status === 'RIDE_COMPLETED') {
      updates.pickupOtpVerified = true;
      updates.dropOtpVerified = true;
      updates.dropOtpVerifiedAt = now;
      updates.rideCompletedAt = now;
      updates.paymentStatus = 'Paid';
      if (proofUrl) updates.proofOfDeliveryUrl = proofUrl;

      // Credit wallet
      const earnings = booking.captainEarnings || Math.round((booking.fareBreakdown?.totalFare || 0) * 0.8) || 0;
      const captain = await Captain.findById(captainId);
      if (captain && earnings > 0 && booking.status !== 'RIDE_COMPLETED') {
        const balBefore = captain.walletBalance || 0;
        captain.walletBalance = balBefore + earnings;
        await captain.save();

        await CaptainTransaction.create({
          transactionId: generateTxnId(),
          captainId,
          orderId: booking.bookingId,
          type: 'CREDIT',
          amount: earnings,
          balanceBefore: balBefore,
          balanceAfter: captain.walletBalance,
          description: `Transport ride completed: ${booking.bookingId}`,
          status: 'COMPLETED',
        });

        await CaptainNotification.create({
          captainId,
          type: 'PAYMENT',
          title: 'Transport Earnings Credited!',
          message: `₹${earnings.toFixed(2)} credited to your wallet for Transport Booking #${booking.bookingId}`,
          orderId: booking.bookingId,
          amount: earnings,
          icon: 'account_balance_wallet',
        });
      }
    }

    const updatedBooking = await TransportBooking.findByIdAndUpdate(
      booking._id,
      {
        $set: updates,
        $push: {
          statusHistory: {
            status,
            changedBy: 'captain',
            changedById: captainId,
            reason: `Captain updated status to ${status}`,
            timestamp: now,
          },
        },
      },
      { new: true }
    )
      .populate('user', 'name phone')
      .populate('vehicleTypeId', 'name slug icon');

    console.log(`[CaptainTransport] Booking ${booking.bookingId} status updated to "${status}"`);

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/captain/transport/active/:bookingId/verify-pickup-otp
// Auth: Captain required
// Verifies Pickup OTP and starts the ride (RIDE_STARTED)
// Generates the Drop OTP for the next stage
// ──────────────────────────────────────────────────────────────────────────────
export const verifyPickupOtp = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { bookingId } = req.params;
    const { otp } = req.body;

    if (!otp || String(otp).trim().length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'A 4-digit Pickup OTP is required',
      });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const query = {
      ...(isMongoId ? { $or: [{ _id: bookingId }, { bookingId }] } : { bookingId }),
      captainId,
    };

    const booking = await TransportBooking.findOne(query);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Transport booking not found or not assigned to you',
      });
    }

    if (booking.pickupOtpVerified) {
      return res.status(400).json({
        success: false,
        message: 'Pickup OTP has already been verified for this booking',
      });
    }

    if (booking.status === 'CANCELLED' || booking.status === 'RIDE_COMPLETED') {
      return res.status(400).json({
        success: false,
        message: `Cannot verify pickup for a ${booking.status.toLowerCase()} booking`,
      });
    }

    // Attempt count check (prevent brute force)
    if (booking.pickupOtpAttempts >= 6) {
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect OTP attempts. Please contact customer support.',
      });
    }

    // OTP validation (supports dev bypass '0000')
    const cleanOtp = String(otp).trim();
    if (cleanOtp !== booking.pickupOtp && cleanOtp !== '0000') {
      await TransportBooking.findByIdAndUpdate(booking._id, {
        $inc: { pickupOtpAttempts: 1 },
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid Pickup OTP. Please ask the customer for the correct 4-digit code shown on their screen.',
      });
    }

    const now = new Date();
    const dropOtp = generateRideOtp();

    // ── Unlock Stage 2: RIDE_STARTED & Drop OTP Generation ──
    const updatedBooking = await TransportBooking.findByIdAndUpdate(
      booking._id,
      {
        $set: {
          pickupOtpVerified: true,
          pickupOtpVerifiedAt: now,
          status: 'RIDE_STARTED',
          rideStartedAt: now,
          dropOtp, // Generate separate Drop OTP
          dropOtpVerified: false,
        },
        $push: {
          statusHistory: {
            status: 'RIDE_STARTED',
            changedBy: 'captain',
            changedById: captainId,
            reason: 'Pickup OTP verified successfully. Goods loaded and transport ride started.',
            timestamp: now,
          },
        },
      },
      { new: true }
    )
      .populate('user', 'name phone')
      .populate('vehicleTypeId', 'name slug icon');

    console.log(
      `[CaptainTransport] Booking ${booking.bookingId} Pickup OTP verified. Ride started. Drop OTP: ${dropOtp}`
    );

    res.status(200).json({
      success: true,
      message: 'Pickup OTP verified successfully! Ride has started.',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/captain/transport/active/:bookingId/verify-drop-otp
// Auth: Captain required
// Verifies Drop OTP, completes ride, and credits Captain wallet
// ──────────────────────────────────────────────────────────────────────────────
export const verifyDropOtp = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { bookingId } = req.params;
    const { otp, proofUrl } = req.body;

    if (!otp || String(otp).trim().length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'A 4-digit Drop OTP is required',
      });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const query = {
      ...(isMongoId ? { $or: [{ _id: bookingId }, { bookingId }] } : { bookingId }),
      captainId,
    };

    const booking = await TransportBooking.findOne(query);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Transport booking not found or not assigned to you',
      });
    }

    if (booking.dropOtpVerified || booking.status === 'RIDE_COMPLETED') {
      return res.status(200).json({
        success: true,
        message: 'This transport ride has already been completed and verified',
        booking,
      });
    }

    // OTP validation (supports dev bypass '0000', dropOtp, or pickupOtp)
    const cleanOtp = String(otp).trim();
    const isDevBypass = cleanOtp === '0000';
    const isDropOtpMatch = booking.dropOtp && cleanOtp === String(booking.dropOtp).trim();
    const isPickupOtpMatch = booking.pickupOtp && cleanOtp === String(booking.pickupOtp).trim();

    if (!isDevBypass && !isDropOtpMatch && !isPickupOtpMatch) {
      await TransportBooking.findByIdAndUpdate(booking._id, {
        $inc: { dropOtpAttempts: 1 },
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please ask the recipient for the 4-digit code (or use 0000).',
      });
    }

    const now = new Date();
    const earnings = booking.captainEarnings || Math.round((booking.fareBreakdown?.totalFare || 0) * 0.8) || 0;

    // ── Complete the Booking ──
    const updatedBooking = await TransportBooking.findByIdAndUpdate(
      booking._id,
      {
        $set: {
          pickupOtpVerified: true,
          pickupOtpVerifiedAt: booking.pickupOtpVerifiedAt || now,
          dropOtpVerified: true,
          dropOtpVerifiedAt: now,
          status: 'RIDE_COMPLETED',
          rideCompletedAt: now,
          paymentStatus: 'Paid',
          ...(proofUrl ? { proofOfDeliveryUrl: proofUrl } : {}),
        },
        $push: {
          statusHistory: {
            status: 'RIDE_COMPLETED',
            changedBy: 'captain',
            changedById: captainId,
            reason: 'Drop OTP verified successfully. Goods safely delivered.',
            timestamp: now,
          },
        },
      },
      { new: true }
    )
      .populate('user', 'name phone')
      .populate('vehicleTypeId', 'name slug icon');

    // ── Credit Captain Wallet ──
    const captain = await Captain.findById(captainId);
    if (captain && earnings > 0 && booking.status !== 'RIDE_COMPLETED') {
      const balBefore = captain.walletBalance || 0;
      captain.walletBalance = balBefore + earnings;
      await captain.save();

      await CaptainTransaction.create({
        transactionId: generateTxnId(),
        captainId,
        orderId: booking.bookingId,
        type: 'CREDIT',
        amount: earnings,
        balanceBefore: balBefore,
        balanceAfter: captain.walletBalance,
        description: `Transport ride completed: ${booking.bookingId}`,
        status: 'COMPLETED',
      });

      await CaptainNotification.create({
        captainId,
        type: 'PAYMENT',
        title: 'Transport Earnings Credited!',
        message: `₹${earnings.toFixed(2)} credited to your wallet for Transport Booking #${booking.bookingId}`,
        orderId: booking.bookingId,
        amount: earnings,
        icon: 'account_balance_wallet',
      });
    }

    console.log(
      `[CaptainTransport] Booking ${booking.bookingId} completed! Payout ₹${earnings} credited to Captain ${captainId}`
    );

    res.status(200).json({
      success: true,
      message: 'Drop OTP verified! Transport ride completed successfully.',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/captain/transport/active/:bookingId/proof
// Auth: Captain required
// Submits optional photo proof of delivery
// ──────────────────────────────────────────────────────────────────────────────
export const submitTransportProof = async (req, res, next) => {
  try {
    const captainId = req.user.id;
    const { bookingId } = req.params;
    const { proofUrl } = req.body;

    if (!proofUrl) {
      return res.status(400).json({ success: false, message: 'proofUrl is required' });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const query = {
      ...(isMongoId ? { $or: [{ _id: bookingId }, { bookingId }] } : { bookingId }),
      captainId,
    };

    const booking = await TransportBooking.findOneAndUpdate(
      query,
      { $set: { proofOfDeliveryUrl: proofUrl } },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Proof of delivery submitted successfully',
      proofUrl,
    });
  } catch (error) {
    next(error);
  }
};
