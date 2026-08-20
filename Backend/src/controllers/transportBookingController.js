import mongoose from 'mongoose';
import TransportBooking from '../models/TransportBooking.model.js';
import VehicleType from '../models/VehicleType.model.js';
import Captain from '../models/Captain.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';
import CaptainTransaction from '../models/CaptainTransaction.model.js';
import { haversineDistance, estimateDuration } from '../utils/haversine.js';
import { calculateFare } from '../utils/fareCalculator.js';
import { generateBookingId } from '../utils/generateBookingId.js';

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────

// Statuses that mean a booking is "active" (user cannot create another)
const ACTIVE_STATUSES = [
  'SEARCHING_CAPTAIN',
  'CAPTAIN_ASSIGNED',
  'CAPTAIN_ARRIVING',
  'CAPTAIN_REACHED_PICKUP',
  'RIDE_STARTED',
  'CAPTAIN_REACHED_DROP',
];

// Statuses that are terminal (cannot be cancelled or modified by user)
const TERMINAL_STATUSES = ['RIDE_COMPLETED', 'CANCELLED'];

// Captain earnings percentage of the total fare
const CAPTAIN_EARNINGS_RATE = 0.8; // 80% of total fare goes to captain

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Validate lat/lng values if provided
 */
const isValidCoord = (lat, lng) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) return true; // optional
  const latN = parseFloat(lat);
  const lngN = parseFloat(lng);
  return (
    !isNaN(latN) && !isNaN(lngN) &&
    latN >= -90 && latN <= 90 &&
    lngN >= -180 && lngN <= 180
  );
};

/**
 * Generate a 4-digit ride OTP
 */
const generateRideOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

/**
 * Build a flexible regex pattern to match vehicle types across captain profiles and vehicle models.
 */
export const getVehicleMatchPattern = (vehicleNameOrSlug) => {
  if (!vehicleNameOrSlug) return null;
  const v = String(vehicleNameOrSlug).toLowerCase();
  if (v.includes('bike') || v.includes('motorcycle') || v.includes('two') || v.includes('2')) {
    return 'motorcycle|bike|two|2';
  }
  if (v.includes('three') || v.includes('3') || v.includes('auto')) {
    return '3 wheeler|three|auto';
  }
  if (v.includes('mini') || v.includes('ace') || v.includes('tata')) {
    return 'mini|ace|tata';
  }
  if (v.includes('pickup') || v.includes('bolero') || v.includes('8ft')) {
    return 'pickup|bolero|8ft';
  }
  return v;
};

/**
 * Find all eligible, online, and approved captains with the EXACT matching vehicle type near the pickup location.
 */
const findEligibleCaptains = async (pickupLocation, vehicleSnapshot) => {
  const city = pickupLocation?.city || '';
  const state = pickupLocation?.state || '';
  const vehicleName = vehicleSnapshot?.name || vehicleSnapshot?.slug || '';

  // Base eligibility query: approved & online
  const query = {
    status: 'approved',
    isOnline: true,
  };

  // Strict Vehicle Type filter
  const vehiclePattern = getVehicleMatchPattern(vehicleName);
  if (vehiclePattern) {
    query.vehicleType = { $regex: vehiclePattern, $options: 'i' };
  }

  // Geo / Area filter
  const locationConditions = [];
  if (city) {
    locationConditions.push({ city: { $regex: city, $options: 'i' } });
    locationConditions.push({ 'workingArea.city': { $regex: city, $options: 'i' } });
  }
  if (state) {
    locationConditions.push({ state: { $regex: state, $options: 'i' } });
    locationConditions.push({ 'workingArea.state': { $regex: state, $options: 'i' } });
  }

  if (locationConditions.length > 0) {
    query.$or = locationConditions;
  }

  // Find matching captains with this vehicle (limit to nearest 10 captains)
  let captains = await Captain.find(query).limit(10);

  // If none found in specific city/state, try all online & approved captains with this matching vehicle
  if (captains.length === 0 && vehiclePattern) {
    captains = await Captain.find({
      status: 'approved',
      isOnline: true,
      vehicleType: { $regex: vehiclePattern, $options: 'i' },
    }).limit(10);
  }

  // Fallback: If no captain with that vehicle exists yet, allow all approved & online captains to receive request
  if (captains.length === 0) {
    captains = await Captain.find({
      status: 'approved',
      isOnline: true,
    }).limit(10);
  }

  return captains;
};

/**
 * Dispatch booking requests to all eligible captains.
 * Records PENDING entries in booking.captainRequests and creates captain notifications.
 * Does NOT assign a captain or change booking.status.
 */
const dispatchTransportRequests = async (booking) => {
  try {
    const eligibleCaptains = await findEligibleCaptains(
      booking.pickupLocation,
      booking.vehicleSnapshot
    );

    if (!eligibleCaptains || eligibleCaptains.length === 0) {
      console.warn(
        `[TransportDispatch] No online captains found for booking ${booking.bookingId} in ${booking.pickupLocation?.city || 'any area'}`
      );
      return;
    }

    const captainEarnings = Math.round(
      booking.fareBreakdown.totalFare * CAPTAIN_EARNINGS_RATE * 100
    ) / 100;

    const now = new Date();
    const requests = eligibleCaptains.map((captain) => ({
      captainId: captain._id,
      status: 'PENDING',
      earnings: captainEarnings,
      sentAt: now,
      respondedAt: null,
    }));

    // Update booking document with dispatched requests (status remains SEARCHING_CAPTAIN)
    await TransportBooking.findByIdAndUpdate(booking._id, {
      $set: {
        captainRequests: requests,
        captainEarnings,
      },
    });

    // Send notifications to all eligible captains
    const notificationPromises = eligibleCaptains.map((captain) =>
      CaptainNotification.create({
        captainId: captain._id,
        type: 'JOB_ASSIGNED',
        title: 'New Transport Request!',
        message: `Pickup: ${booking.pickupLocation.address} → Drop: ${booking.dropLocation.address}. Est. Payout: ₹${captainEarnings.toFixed(2)}. Tap to accept.`,
        orderId: booking.bookingId,
        amount: captainEarnings,
        icon: 'local_shipping',
      })
    );

    await Promise.allSettled(notificationPromises);

    console.log(
      `[TransportDispatch] Dispatched request for booking ${booking.bookingId} to ${eligibleCaptains.length} captains. Booking remains in SEARCHING_CAPTAIN.`
    );
  } catch (err) {
    console.error(`[TransportDispatch ERROR] Booking ${booking.bookingId}:`, err.message);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/transport/fare-estimate
// Auth: user required
// Calculate fare for given locations + vehicle type (NO booking created)
// ──────────────────────────────────────────────────────────────────────────────
export const getFareEstimate = async (req, res, next) => {
  try {
    const { pickupLocation, dropLocation, vehicleTypeId } = req.body;

    // ── Validation ────────────────────────────────────────────────────
    if (!pickupLocation || !pickupLocation.address) {
      return res.status(400).json({ success: false, message: 'Pickup location address is required' });
    }
    if (!dropLocation || !dropLocation.address) {
      return res.status(400).json({ success: false, message: 'Drop location address is required' });
    }
    if (pickupLocation.address.trim() === dropLocation.address.trim()) {
      return res.status(400).json({ success: false, message: 'Pickup and drop locations cannot be the same' });
    }
    if (!vehicleTypeId || !mongoose.Types.ObjectId.isValid(vehicleTypeId)) {
      return res.status(400).json({ success: false, message: 'A valid vehicle type ID is required' });
    }
    if (!isValidCoord(pickupLocation.lat, pickupLocation.lng) || !isValidCoord(dropLocation.lat, dropLocation.lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinate values. Latitude must be -90 to 90, longitude -180 to 180' });
    }

    // ── Fetch vehicle ─────────────────────────────────────────────────
    const vehicle = await VehicleType.findOne({ _id: vehicleTypeId, isActive: true });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Selected vehicle type is not available' });
    }

    // ── Calculate distance ────────────────────────────────────────────
    let distanceKm = null;
    let estimatedDurationMin = null;

    const hasPickupCoords = pickupLocation.lat != null && pickupLocation.lng != null;
    const hasDropCoords = dropLocation.lat != null && dropLocation.lng != null;

    if (hasPickupCoords && hasDropCoords) {
      distanceKm = haversineDistance(
        parseFloat(pickupLocation.lat),
        parseFloat(pickupLocation.lng),
        parseFloat(dropLocation.lat),
        parseFloat(dropLocation.lng)
      );
      estimatedDurationMin = estimateDuration(distanceKm);
    } else {
      // Fallback: no coordinates provided — use 5 km default estimate
      distanceKm = 5.0;
      estimatedDurationMin = estimateDuration(distanceKm);
    }

    // ── Calculate fare ────────────────────────────────────────────────
    const fareBreakdown = calculateFare(vehicle, distanceKm);

    res.status(200).json({
      success: true,
      estimate: {
        distanceKm,
        estimatedDurationMin,
        vehicleName: vehicle.name,
        vehicleSlug: vehicle.slug,
        fareBreakdown,
        coordsUsed: hasPickupCoords && hasDropCoords,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/transport/bookings
// Auth: user required
// Create a new transport booking — fare is always recalculated server-side
// ──────────────────────────────────────────────────────────────────────────────
export const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      pickupLocation,
      dropLocation,
      stops = [],
      goods,
      vehicleTypeId,
      paymentMethod = 'CASH',
    } = req.body;

    // ── Validation ────────────────────────────────────────────────────
    if (!pickupLocation || !pickupLocation.address?.trim()) {
      return res.status(400).json({ success: false, message: 'Pickup location address is required' });
    }
    if (!dropLocation || !dropLocation.address?.trim()) {
      return res.status(400).json({ success: false, message: 'Drop location address is required' });
    }
    if (pickupLocation.address.trim() === dropLocation.address.trim()) {
      return res.status(400).json({ success: false, message: 'Pickup and drop locations cannot be the same' });
    }
    if (!vehicleTypeId || !mongoose.Types.ObjectId.isValid(vehicleTypeId)) {
      return res.status(400).json({ success: false, message: 'A valid vehicle type ID is required' });
    }
    if (!['CASH', 'UPI', 'CARD', 'WALLET'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method. Must be CASH, UPI, CARD, or WALLET' });
    }
    if (!goods || !goods.category || !goods.weightKg || !goods.packages) {
      return res.status(400).json({ success: false, message: 'Goods details (category, weight, packages) are required' });
    }
    if (!['Furniture', 'Electronics', 'Groceries', 'Textiles', 'Hardware', 'Other'].includes(goods.category)) {
      return res.status(400).json({ success: false, message: 'Invalid goods category' });
    }
    if (parseFloat(goods.weightKg) <= 0) {
      return res.status(400).json({ success: false, message: 'Goods weight must be greater than 0' });
    }
    if (parseInt(goods.packages) < 1) {
      return res.status(400).json({ success: false, message: 'Number of packages must be at least 1' });
    }
    if (!isValidCoord(pickupLocation.lat, pickupLocation.lng) || !isValidCoord(dropLocation.lat, dropLocation.lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinate values provided' });
    }
    if (stops.length > 3) {
      return res.status(400).json({ success: false, message: 'Maximum 3 intermediate stops are allowed' });
    }

    // ── Prevent duplicate active bookings ─────────────────────────────
    const existingActive = await TransportBooking.findOne({
      user: userId,
      status: { $in: ACTIVE_STATUSES },
    });
    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active transport booking. Please complete or cancel it before creating a new one.',
        activeBookingId: existingActive.bookingId,
      });
    }

    // ── Fetch & validate vehicle ──────────────────────────────────────
    const vehicle = await VehicleType.findOne({ _id: vehicleTypeId, isActive: true });
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Selected vehicle type is not available' });
    }

    // ── Recalculate distance (server-side, never trust frontend) ──────
    const hasPickupCoords = pickupLocation.lat != null && pickupLocation.lng != null;
    const hasDropCoords = dropLocation.lat != null && dropLocation.lng != null;

    let distanceKm = 5.0; // default fallback
    let estimatedDurationMin = estimateDuration(5.0);

    if (hasPickupCoords && hasDropCoords) {
      distanceKm = haversineDistance(
        parseFloat(pickupLocation.lat),
        parseFloat(pickupLocation.lng),
        parseFloat(dropLocation.lat),
        parseFloat(dropLocation.lng)
      );
      estimatedDurationMin = estimateDuration(distanceKm);
    }

    // ── Recalculate fare (server-side, never trust frontend) ──────────
    const fareBreakdown = calculateFare(vehicle, distanceKm);

    // ── Build vehicle snapshot (freeze pricing at booking time) ───────
    const vehicleSnapshot = {
      name: vehicle.name,
      slug: vehicle.slug,
      capacityKg: vehicle.capacityKg,
      baseFare: vehicle.baseFare,
      perKmFare: vehicle.perKmFare,
      minimumFare: vehicle.minimumFare,
      platformFee: vehicle.platformFee,
    };

    // ── Sanitize stops ────────────────────────────────────────────────
    const sanitizedStops = stops
      .filter((s) => s && s.address && s.address.trim())
      .map((s) => ({
        address: s.address.trim(),
        city: s.city || '',
        lat: s.lat != null ? parseFloat(s.lat) : null,
        lng: s.lng != null ? parseFloat(s.lng) : null,
      }));

    // ── Create booking document ───────────────────────────────────────
    const bookingId = generateBookingId();
    const now = new Date();

    const booking = await TransportBooking.create({
      bookingId,
      user: userId,
      pickupLocation: {
        address: pickupLocation.address.trim(),
        landmark: pickupLocation.landmark || '',
        city: pickupLocation.city || '',
        state: pickupLocation.state || '',
        pincode: pickupLocation.pincode || '',
        lat: hasPickupCoords ? parseFloat(pickupLocation.lat) : null,
        lng: hasPickupCoords ? parseFloat(pickupLocation.lng) : null,
      },
      dropLocation: {
        address: dropLocation.address.trim(),
        landmark: dropLocation.landmark || '',
        city: dropLocation.city || '',
        state: dropLocation.state || '',
        pincode: dropLocation.pincode || '',
        lat: hasDropCoords ? parseFloat(dropLocation.lat) : null,
        lng: hasDropCoords ? parseFloat(dropLocation.lng) : null,
      },
      stops: sanitizedStops,
      distanceKm,
      estimatedDurationMin,
      goods: {
        category: goods.category,
        weightKg: parseFloat(goods.weightKg),
        packages: parseInt(goods.packages),
        instructions: goods.instructions || '',
      },
      vehicleTypeId: vehicle._id,
      vehicleSnapshot,
      fareBreakdown,
      paymentMethod,
      paymentStatus: 'Pending',
      status: 'SEARCHING_CAPTAIN',
      statusHistory: [
        {
          status: 'SEARCHING_CAPTAIN',
          changedBy: 'system',
          changedById: null,
          reason: 'Booking created by user',
          timestamp: now,
        },
      ],
    });

    console.log(`[TransportBooking] Created: ${bookingId} for user ${userId}. Fare: ₹${fareBreakdown.totalFare}, Distance: ${distanceKm} km`);

    // ── Dispatch requests to eligible captains asynchronously ──────────
    // Does NOT assign any captain; keeps status at SEARCHING_CAPTAIN.
    dispatchTransportRequests(booking).catch((err) =>
      console.error(`[TransportDispatch ASYNC ERROR] ${booking.bookingId}:`, err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Searching for nearby captains...',
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        status: 'SEARCHING_CAPTAIN',
        distanceKm: booking.distanceKm,
        estimatedDurationMin: booking.estimatedDurationMin,
        fareBreakdown: booking.fareBreakdown,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        stops: booking.stops,
        goods: booking.goods,
        vehicleSnapshot: booking.vehicleSnapshot,
        captainId: null,
        captainAssignedAt: null,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/transport/bookings
// Auth: user required
// Returns all transport bookings for the logged-in user (newest first)
// ──────────────────────────────────────────────────────────────────────────────
export const getUserBookings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, limit = 20, page = 1 } = req.query;

    const query = { user: userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await TransportBooking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('captainId', 'name phone vehicleType liveLocation')
      .select('-statusHistory -__v');

    const total = await TransportBooking.countDocuments(query);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/transport/bookings/active
// Auth: user required
// Returns the current active booking (if any) — used for ride tracking screen
// ──────────────────────────────────────────────────────────────────────────────
export const getActiveBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const booking = await TransportBooking.findOne({
      user: userId,
      status: { $in: ACTIVE_STATUSES },
    })
      .sort({ createdAt: -1 })
      .populate('captainId', 'name phone vehicleType liveLocation isOnline')
      .select('-__v');

    res.status(200).json({
      success: true,
      booking: booking || null,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET /api/transport/bookings/:bookingId
// Auth: user required
// Returns full details of a specific booking — only the booking owner can access
// ──────────────────────────────────────────────────────────────────────────────
export const getBookingById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;

    // Support both MongoDB _id and human-readable bookingId
    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const query = isMongoId
      ? { $or: [{ _id: bookingId }, { bookingId }], user: userId }
      : { bookingId, user: userId };

    const booking = await TransportBooking.findOne(query)
      .populate('captainId', 'name phone vehicleType documents.profilePhoto liveLocation isOnline')
      .populate('vehicleTypeId', 'name slug icon')
      .select('-__v');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// PUT /api/transport/bookings/:bookingId/cancel
// Auth: user required
// Cancel a booking — only allowed in SEARCHING_CAPTAIN or CAPTAIN_ASSIGNED
// ──────────────────────────────────────────────────────────────────────────────
export const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const { reason = '' } = req.body;

    // Find the booking and verify ownership
    const isMongoId = mongoose.Types.ObjectId.isValid(bookingId);
    const query = isMongoId
      ? { $or: [{ _id: bookingId }, { bookingId }], user: userId }
      : { bookingId, user: userId };

    const booking = await TransportBooking.findOne(query);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // ── Status validation ─────────────────────────────────────────────
    if (TERMINAL_STATUSES.includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already ${booking.status.replace('_', ' ').toLowerCase()}`,
      });
    }

    if (booking.status === 'RIDE_STARTED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a ride that has already started',
      });
    }

    const now = new Date();

    // Expire any pending captain requests
    const updatedCaptainRequests = (booking.captainRequests || []).map((reqItem) => {
      if (reqItem.status === 'PENDING') {
        return { ...reqItem.toObject(), status: 'EXPIRED', respondedAt: now };
      }
      return reqItem;
    });

    const updated = await TransportBooking.findByIdAndUpdate(
      booking._id,
      {
        $set: {
          status: 'CANCELLED',
          cancelledBy: 'user',
          cancellationReason: reason.trim(),
          cancelledAt: now,
          captainRequests: updatedCaptainRequests,
        },
        $push: {
          statusHistory: {
            status: 'CANCELLED',
            changedBy: 'user',
            changedById: userId,
            reason: reason.trim() || 'Cancelled by user',
            timestamp: now,
          },
        },
      },
      { new: true }
    );

    // Notify assigned captain if one was already assigned
    if (booking.captainId) {
      try {
        await CaptainNotification.create({
          captainId: booking.captainId,
          type: 'JOB_CANCELLED',
          title: 'Transport Job Cancelled',
          message: `Booking ${booking.bookingId} has been cancelled by the user.`,
          orderId: booking.bookingId,
          icon: 'cancel',
        });
      } catch (notifErr) {
        console.warn(`[TransportCancel] Captain notification failed: ${notifErr.message}`);
      }
    }

    console.log(`[TransportBooking] Cancelled: ${booking.bookingId} by user ${userId}. Reason: ${reason || 'none'}`);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: {
        bookingId: updated.bookingId,
        status: updated.status,
        cancelledAt: updated.cancelledAt,
        cancellationReason: updated.cancellationReason,
      },
    });
  } catch (error) {
    next(error);
  }
};
