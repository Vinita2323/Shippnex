import crypto from 'crypto';
import SellerMembershipPlan from '../models/SellerMembershipPlan.model.js';
import CaptainMembershipPlan from '../models/CaptainMembershipPlan.model.js';
import SellerMembership from '../models/SellerMembership.model.js';
import CaptainMembership from '../models/CaptainMembership.model.js';
import Seller from '../models/Seller.model.js';
import Captain from '../models/Captain.model.js';
import { razorpayInstance } from '../config/razorpay.js';

// ============================================================
// HELPER: Generate unique transaction ID
// ============================================================
const generateTransactionId = (prefix = 'TXN') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
};

// ============================================================
// HELPER: Calculate expiry date
// ============================================================
const calcExpiryDate = (startDate, durationMonths) => {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + durationMonths);
  return d;
};

// ============================================================
// HELPER: Check and auto-expire memberships
// ============================================================
const autoExpireMemberships = async () => {
  const now = new Date();
  await SellerMembership.updateMany(
    { membershipStatus: 'active', expiryDate: { $lt: now } },
    { $set: { membershipStatus: 'expired', paymentStatus: 'paid' } }
  );
  await CaptainMembership.updateMany(
    { membershipStatus: 'active', expiryDate: { $lt: now } },
    { $set: { membershipStatus: 'expired', paymentStatus: 'paid' } }
  );
  // Sync membershipStatus on Seller docs
  const expiredSellerMems = await SellerMembership.find({ membershipStatus: 'expired' }).distinct('sellerId');
  for (const sid of expiredSellerMems) {
    const hasActive = await SellerMembership.findOne({ sellerId: sid, membershipStatus: 'active' });
    if (!hasActive) await Seller.findByIdAndUpdate(sid, { membershipStatus: 'expired' });
  }
  // Sync membershipStatus on Captain docs
  const expiredCaptainMems = await CaptainMembership.find({ membershipStatus: 'expired' }).distinct('captainId');
  for (const cid of expiredCaptainMems) {
    const hasActive = await CaptainMembership.findOne({ captainId: cid, membershipStatus: 'active' });
    if (!hasActive) await Captain.findByIdAndUpdate(cid, { membershipStatus: 'expired' });
  }
};

// ============================================================
// PUBLIC: Get Seller Plans (for purchase page)
// ============================================================
export const getSellerPlans = async (req, res, next) => {
  try {
    const plans = await SellerMembershipPlan.find({ status: 'active' }).sort({ displayOrder: 1, price: 1 });
    res.status(200).json({ success: true, plans });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// PUBLIC: Get Captain Plans (for purchase page)
// ============================================================
export const getCaptainPlans = async (req, res, next) => {
  try {
    const plans = await CaptainMembershipPlan.find({ status: 'active' }).sort({ displayOrder: 1, price: 1 });
    res.status(200).json({ success: true, plans });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SELLER: Get current membership
// ============================================================
export const getSellerMembership = async (req, res, next) => {
  try {
    await autoExpireMemberships();
    const membership = await SellerMembership.findOne({
      sellerId: req.user.id,
      membershipStatus: { $in: ['active', 'pending_payment'] },
    }).populate('planId').sort({ createdAt: -1 });

    res.status(200).json({ success: true, membership: membership || null });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CAPTAIN: Get current membership
// ============================================================
export const getCaptainMembership = async (req, res, next) => {
  try {
    await autoExpireMemberships();
    const membership = await CaptainMembership.findOne({
      captainId: req.user.id,
      membershipStatus: { $in: ['active', 'pending_payment'] },
    }).populate('planId').sort({ createdAt: -1 });

    res.status(200).json({ success: true, membership: membership || null });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SELLER: Get membership history
// ============================================================
export const getSellerMembershipHistory = async (req, res, next) => {
  try {
    const memberships = await SellerMembership.find({ sellerId: req.user.id })
      .populate('planId')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, memberships });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CAPTAIN: Get membership history
// ============================================================
export const getCaptainMembershipHistory = async (req, res, next) => {
  try {
    const memberships = await CaptainMembership.find({ captainId: req.user.id })
      .populate('planId')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, memberships });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SELLER: Purchase (Online via Razorpay -> Instant Active)
// ============================================================
export const purchaseSellerMembership = async (req, res, next) => {
  try {
    const { planId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    if (!planId) return res.status(400).json({ success: false, message: 'Plan ID is required' });

    const plan = await SellerMembershipPlan.findById(planId);
    if (!plan || plan.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Plan not found or inactive' });
    }

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Online payment via Razorpay is required. COD / Manual payments are not accepted.',
      });
    }

    // Verify Razorpay HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid Razorpay signature.',
      });
    }

    // Determine start and expiry dates (extend if existing active subscription)
    const existingActive = await SellerMembership.findOne({
      sellerId: req.user.id,
      membershipStatus: 'active',
      expiryDate: { $gt: new Date() },
    });

    const startDate = existingActive ? existingActive.expiryDate : new Date();
    const expiryDate = calcExpiryDate(startDate, plan.durationMonths);

    // Cancel any existing pending payments for this seller
    await SellerMembership.updateMany(
      { sellerId: req.user.id, membershipStatus: 'pending_payment' },
      { $set: { membershipStatus: 'cancelled', paymentStatus: 'cancelled' } }
    );

    // Expire old active membership if replaced
    if (existingActive) {
      existingActive.membershipStatus = 'expired';
      await existingActive.save();
    }

    const membership = await SellerMembership.create({
      sellerId: req.user.id,
      planId: plan._id,
      planName: plan.name,
      durationType: plan.durationType,
      durationMonths: plan.durationMonths,
      priceAtPurchase: plan.price,
      membershipStatus: 'active',
      paymentStatus: 'paid',
      transactionId: razorpayOrderId,
      paymentReference: razorpayPaymentId,
      paymentMethod: 'razorpay',
      startDate,
      expiryDate,
    });

    await Seller.findByIdAndUpdate(req.user.id, { membershipStatus: 'active' });

    console.log(`[Membership] Seller ${req.user.id} activated plan ${plan.name} directly via Razorpay (${razorpayPaymentId}) until ${expiryDate}`);

    res.status(201).json({
      success: true,
      message: 'Payment verified and membership activated successfully!',
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CAPTAIN: Purchase (Online via Razorpay -> Instant Active)
// ============================================================
export const purchaseCaptainMembership = async (req, res, next) => {
  try {
    const { planId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    if (!planId) return res.status(400).json({ success: false, message: 'Plan ID is required' });

    const plan = await CaptainMembershipPlan.findById(planId);
    if (!plan || plan.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Plan not found or inactive' });
    }

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Online payment via Razorpay is required.',
      });
    }

    // Verify Razorpay HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid Razorpay signature.',
      });
    }

    const existingActive = await CaptainMembership.findOne({
      captainId: req.user.id,
      membershipStatus: 'active',
      expiryDate: { $gt: new Date() },
    });

    const startDate = existingActive ? existingActive.expiryDate : new Date();
    const expiryDate = calcExpiryDate(startDate, plan.durationMonths);

    // Cancel any existing pending payments for this captain
    await CaptainMembership.updateMany(
      { captainId: req.user.id, membershipStatus: 'pending_payment' },
      { $set: { membershipStatus: 'cancelled', paymentStatus: 'cancelled' } }
    );

    if (existingActive) {
      existingActive.membershipStatus = 'expired';
      await existingActive.save();
    }

    const membership = await CaptainMembership.create({
      captainId: req.user.id,
      planId: plan._id,
      planName: plan.name,
      durationType: plan.durationType,
      durationMonths: plan.durationMonths,
      priceAtPurchase: plan.price,
      membershipStatus: 'active',
      paymentStatus: 'paid',
      transactionId: razorpayOrderId,
      paymentReference: razorpayPaymentId,
      paymentMethod: 'razorpay',
      startDate,
      expiryDate,
    });

    await Captain.findByIdAndUpdate(req.user.id, { membershipStatus: 'active' });

    res.status(201).json({
      success: true,
      message: 'Payment verified and captain membership activated successfully!',
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// SELLER: Renew membership (Online via Razorpay -> Instant Active)
// ============================================================
export const renewSellerMembership = async (req, res, next) => {
  try {
    const { planId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    if (!planId) return res.status(400).json({ success: false, message: 'Plan ID is required' });

    const plan = await SellerMembershipPlan.findById(planId);
    if (!plan || plan.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Plan not found or inactive' });
    }

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Online payment via Razorpay is required.',
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid Razorpay signature.',
      });
    }

    const currentMembership = await SellerMembership.findOne({
      sellerId: req.user.id,
      membershipStatus: { $in: ['active', 'expired'] },
    }).sort({ createdAt: -1 });

    const existingActive = await SellerMembership.findOne({
      sellerId: req.user.id,
      membershipStatus: 'active',
      expiryDate: { $gt: new Date() },
    });

    const startDate = existingActive ? existingActive.expiryDate : new Date();
    const expiryDate = calcExpiryDate(startDate, plan.durationMonths);

    // Cancel pending payments
    await SellerMembership.updateMany(
      { sellerId: req.user.id, membershipStatus: 'pending_payment' },
      { $set: { membershipStatus: 'cancelled', paymentStatus: 'cancelled' } }
    );

    if (existingActive) {
      existingActive.membershipStatus = 'expired';
      await existingActive.save();
    }

    const membership = await SellerMembership.create({
      sellerId: req.user.id,
      planId: plan._id,
      planName: plan.name,
      durationType: plan.durationType,
      durationMonths: plan.durationMonths,
      priceAtPurchase: plan.price,
      membershipStatus: 'active',
      paymentStatus: 'paid',
      transactionId: razorpayOrderId,
      paymentReference: razorpayPaymentId,
      paymentMethod: 'razorpay',
      startDate,
      expiryDate,
      renewedFromId: currentMembership?._id || null,
    });

    await Seller.findByIdAndUpdate(req.user.id, { membershipStatus: 'active' });

    console.log(`[Membership] Seller ${req.user.id} renewed plan ${plan.name} directly via Razorpay (${razorpayPaymentId}) until ${expiryDate}`);

    res.status(200).json({
      success: true,
      message: 'Renewal successful! Your membership plan is active.',
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// CAPTAIN: Renew membership (Online via Razorpay -> Instant Active)
// ============================================================
export const renewCaptainMembership = async (req, res, next) => {
  try {
    const { planId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    if (!planId) return res.status(400).json({ success: false, message: 'Plan ID is required' });

    const plan = await CaptainMembershipPlan.findById(planId);
    if (!plan || plan.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Plan not found or inactive' });
    }

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Online payment via Razorpay is required.',
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid Razorpay signature.',
      });
    }

    const currentMembership = await CaptainMembership.findOne({
      captainId: req.user.id,
      membershipStatus: { $in: ['active', 'expired'] },
    }).sort({ createdAt: -1 });

    const existingActive = await CaptainMembership.findOne({
      captainId: req.user.id,
      membershipStatus: 'active',
      expiryDate: { $gt: new Date() },
    });

    const startDate = existingActive ? existingActive.expiryDate : new Date();
    const expiryDate = calcExpiryDate(startDate, plan.durationMonths);

    await CaptainMembership.updateMany(
      { captainId: req.user.id, membershipStatus: 'pending_payment' },
      { $set: { membershipStatus: 'cancelled', paymentStatus: 'cancelled' } }
    );

    if (existingActive) {
      existingActive.membershipStatus = 'expired';
      await existingActive.save();
    }

    const membership = await CaptainMembership.create({
      captainId: req.user.id,
      planId: plan._id,
      planName: plan.name,
      durationType: plan.durationType,
      durationMonths: plan.durationMonths,
      priceAtPurchase: plan.price,
      membershipStatus: 'active',
      paymentStatus: 'paid',
      transactionId: razorpayOrderId,
      paymentReference: razorpayPaymentId,
      paymentMethod: 'razorpay',
      startDate,
      expiryDate,
      renewedFromId: currentMembership?._id || null,
    });

    await Captain.findByIdAndUpdate(req.user.id, { membershipStatus: 'active' });

    res.status(200).json({
      success: true,
      message: 'Renewal successful! Your captain membership is active.',
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Get all Seller Plans
// ============================================================
export const adminGetSellerPlans = async (req, res, next) => {
  try {
    const plans = await SellerMembershipPlan.find().sort({ displayOrder: 1, createdAt: -1 });
    // Attach subscriber count to each plan
    const plansWithCounts = await Promise.all(
      plans.map(async (plan) => {
        const activeCount = await SellerMembership.countDocuments({ planId: plan._id, membershipStatus: 'active' });
        const totalCount = await SellerMembership.countDocuments({ planId: plan._id });
        return { ...plan.toObject(), activeSubscribers: activeCount, totalSubscribers: totalCount };
      })
    );
    res.status(200).json({ success: true, plans: plansWithCounts });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Get all Captain Plans
// ============================================================
export const adminGetCaptainPlans = async (req, res, next) => {
  try {
    const plans = await CaptainMembershipPlan.find().sort({ displayOrder: 1, createdAt: -1 });
    const plansWithCounts = await Promise.all(
      plans.map(async (plan) => {
        const activeCount = await CaptainMembership.countDocuments({ planId: plan._id, membershipStatus: 'active' });
        const totalCount = await CaptainMembership.countDocuments({ planId: plan._id });
        return { ...plan.toObject(), activeSubscribers: activeCount, totalSubscribers: totalCount };
      })
    );
    res.status(200).json({ success: true, plans: plansWithCounts });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Create Seller Plan
// ============================================================
export const adminCreateSellerPlan = async (req, res, next) => {
  try {
    const { name, durationType, durationMonths, price, description, features, status, displayOrder } = req.body;
    if (!name || !durationType || !durationMonths || price === undefined) {
      return res.status(400).json({ success: false, message: 'name, durationType, durationMonths, price are required' });
    }
    const plan = await SellerMembershipPlan.create({ name, durationType, durationMonths, price, description, features: features || [], status: status || 'active', displayOrder: displayOrder || 0 });
    res.status(201).json({ success: true, message: 'Seller plan created', plan });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Create Captain Plan
// ============================================================
export const adminCreateCaptainPlan = async (req, res, next) => {
  try {
    const { name, durationType, durationMonths, price, description, features, status, displayOrder } = req.body;
    if (!name || !durationType || !durationMonths || price === undefined) {
      return res.status(400).json({ success: false, message: 'name, durationType, durationMonths, price are required' });
    }
    const plan = await CaptainMembershipPlan.create({ name, durationType, durationMonths, price, description, features: features || [], status: status || 'active', displayOrder: displayOrder || 0 });
    res.status(201).json({ success: true, message: 'Captain plan created', plan });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Update Seller Plan
// ============================================================
export const adminUpdateSellerPlan = async (req, res, next) => {
  try {
    const plan = await SellerMembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.status(200).json({ success: true, message: 'Seller plan updated', plan });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Update Captain Plan
// ============================================================
export const adminUpdateCaptainPlan = async (req, res, next) => {
  try {
    const plan = await CaptainMembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.status(200).json({ success: true, message: 'Captain plan updated', plan });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Toggle Seller Plan status
// ============================================================
export const adminToggleSellerPlan = async (req, res, next) => {
  try {
    const plan = await SellerMembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    plan.status = plan.status === 'active' ? 'inactive' : 'active';
    await plan.save();
    res.status(200).json({ success: true, message: `Plan ${plan.status}d`, plan });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Toggle Captain Plan status
// ============================================================
export const adminToggleCaptainPlan = async (req, res, next) => {
  try {
    const plan = await CaptainMembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    plan.status = plan.status === 'active' ? 'inactive' : 'active';
    await plan.save();
    res.status(200).json({ success: true, message: `Plan ${plan.status}d`, plan });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Safe Delete Seller Plan
// ============================================================
export const adminDeleteSellerPlan = async (req, res, next) => {
  try {
    const activeCount = await SellerMembership.countDocuments({ planId: req.params.id, membershipStatus: 'active' });
    if (activeCount > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete plan: ${activeCount} active subscription(s) exist.` });
    }
    const plan = await SellerMembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.status(200).json({ success: true, message: 'Seller plan deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Safe Delete Captain Plan
// ============================================================
export const adminDeleteCaptainPlan = async (req, res, next) => {
  try {
    const activeCount = await CaptainMembership.countDocuments({ planId: req.params.id, membershipStatus: 'active' });
    if (activeCount > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete plan: ${activeCount} active subscription(s) exist.` });
    }
    const plan = await CaptainMembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.status(200).json({ success: true, message: 'Captain plan deleted' });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Get All Seller Subscriptions (with filters)
// ============================================================
export const adminGetSellerSubscriptions = async (req, res, next) => {
  try {
    const { status, search, planId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.membershipStatus = status;
    if (planId) query.planId = planId;

    let subscriptions = await SellerMembership.find(query)
      .populate('sellerId', 'businessName phone email ownerName')
      .populate('planId', 'name durationType price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      const s = search.toLowerCase();
      subscriptions = subscriptions.filter(m =>
        m.sellerId?.businessName?.toLowerCase().includes(s) ||
        m.sellerId?.phone?.includes(s) ||
        m.sellerId?.ownerName?.toLowerCase().includes(s) ||
        m.transactionId?.toLowerCase().includes(s)
      );
    }

    const total = await SellerMembership.countDocuments(query);
    res.status(200).json({ success: true, subscriptions, total });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Get All Captain Subscriptions (with filters)
// ============================================================
export const adminGetCaptainSubscriptions = async (req, res, next) => {
  try {
    const { status, search, planId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.membershipStatus = status;
    if (planId) query.planId = planId;

    let subscriptions = await CaptainMembership.find(query)
      .populate('captainId', 'name phone email')
      .populate('planId', 'name durationType price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      const s = search.toLowerCase();
      subscriptions = subscriptions.filter(m =>
        m.captainId?.name?.toLowerCase().includes(s) ||
        m.captainId?.phone?.includes(s) ||
        m.transactionId?.toLowerCase().includes(s)
      );
    }

    const total = await CaptainMembership.countDocuments(query);
    res.status(200).json({ success: true, subscriptions, total });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Confirm Seller Payment → Activate Membership
// ============================================================
export const adminConfirmSellerPayment = async (req, res, next) => {
  try {
    const membership = await SellerMembership.findById(req.params.id);
    if (!membership) return res.status(404).json({ success: false, message: 'Membership record not found' });

    if (membership.membershipStatus === 'active') {
      return res.status(400).json({ success: false, message: 'Membership is already active' });
    }

    // Determine start date — extend from active membership if renewing before expiry
    const existingActive = await SellerMembership.findOne({
      sellerId: membership.sellerId,
      membershipStatus: 'active',
      expiryDate: { $gt: new Date() },
    });

    const startDate = existingActive ? existingActive.expiryDate : new Date();
    const expiryDate = calcExpiryDate(startDate, membership.durationMonths);

    membership.startDate = startDate;
    membership.expiryDate = expiryDate;
    membership.membershipStatus = 'active';
    membership.paymentStatus = 'paid';
    membership.adminNote = req.body.adminNote || '';
    await membership.save();

    // Expire the old active membership if it existed
    if (existingActive) {
      existingActive.membershipStatus = 'expired';
      await existingActive.save();
    }

    // Update seller's membershipStatus
    await Seller.findByIdAndUpdate(membership.sellerId, { membershipStatus: 'active' });

    console.log(`[Admin] Seller membership ACTIVATED: ${membership._id}, expires ${expiryDate}`);

    res.status(200).json({ success: true, message: 'Seller membership activated successfully', membership });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Confirm Captain Payment → Activate Membership
// ============================================================
export const adminConfirmCaptainPayment = async (req, res, next) => {
  try {
    const membership = await CaptainMembership.findById(req.params.id);
    if (!membership) return res.status(404).json({ success: false, message: 'Membership record not found' });

    if (membership.membershipStatus === 'active') {
      return res.status(400).json({ success: false, message: 'Membership is already active' });
    }

    const existingActive = await CaptainMembership.findOne({
      captainId: membership.captainId,
      membershipStatus: 'active',
      expiryDate: { $gt: new Date() },
    });

    const startDate = existingActive ? existingActive.expiryDate : new Date();
    const expiryDate = calcExpiryDate(startDate, membership.durationMonths);

    membership.startDate = startDate;
    membership.expiryDate = expiryDate;
    membership.membershipStatus = 'active';
    membership.paymentStatus = 'paid';
    membership.adminNote = req.body.adminNote || '';
    await membership.save();

    if (existingActive) {
      existingActive.membershipStatus = 'expired';
      await existingActive.save();
    }

    await Captain.findByIdAndUpdate(membership.captainId, { membershipStatus: 'active' });

    console.log(`[Admin] Captain membership ACTIVATED: ${membership._id}, expires ${expiryDate}`);

    res.status(200).json({ success: true, message: 'Captain membership activated successfully', membership });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Manual expiry check trigger
// ============================================================
export const adminCheckExpiry = async (req, res, next) => {
  try {
    await autoExpireMemberships();
    res.status(200).json({ success: true, message: 'Expiry check completed' });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Get Seller Revenue stats
// ============================================================
export const adminGetSellerMembershipStats = async (req, res, next) => {
  try {
    const totalRevenue = await SellerMembership.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$priceAtPurchase' } } },
    ]);
    const activeCount = await SellerMembership.countDocuments({ membershipStatus: 'active' });
    const pendingCount = await SellerMembership.countDocuments({ membershipStatus: 'pending_payment' });
    const expiredCount = await SellerMembership.countDocuments({ membershipStatus: 'expired' });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        activeCount,
        pendingCount,
        expiredCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN: Get Captain Revenue stats
// ============================================================
export const adminGetCaptainMembershipStats = async (req, res, next) => {
  try {
    const totalRevenue = await CaptainMembership.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$priceAtPurchase' } } },
    ]);
    const activeCount = await CaptainMembership.countDocuments({ membershipStatus: 'active' });
    const pendingCount = await CaptainMembership.countDocuments({ membershipStatus: 'pending_payment' });
    const expiredCount = await CaptainMembership.countDocuments({ membershipStatus: 'expired' });

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        activeCount,
        pendingCount,
        expiredCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
// ============================================================
// PUBLIC: Create Razorpay Order
// ============================================================
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { planId, userType = 'seller', currency = 'INR' } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, message: 'Plan ID is required' });
    }

    let plan = null;
    if (userType === 'captain') {
      plan = await CaptainMembershipPlan.findById(planId);
    } else {
      plan = await SellerMembershipPlan.findById(planId);
    }

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Membership plan not found' });
    }

    const amount = plan.price;

    if (amount === undefined || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid plan amount' });
    }

    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('placeholder')) {
      console.error('[Razorpay Config Error]: Razorpay keys are missing or invalid in environment variables.');
      return res.status(500).json({ success: false, message: 'Payment gateway is not configured properly.' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency,
      receipt: generateTransactionId('RC'),
    };
    
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({ 
      success: true, 
      order,
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (error) {
    console.error('[Razorpay Order Error]:', error);
    let errorMessage = error.error?.description || error.message || 'Could not create Razorpay order';
    if (errorMessage === 'Authentication failed' || error.statusCode === 401) {
      errorMessage = 'Razorpay Authentication failed: Please verify your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Backend/.env';
    }
    res.status(500).json({ success: false, message: errorMessage, error: error.message });
  }
};
