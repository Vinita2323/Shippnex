import mongoose from 'mongoose';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Seller from '../models/Seller.model.js';
import SellerNotification from '../models/SellerNotification.model.js';
import WalletTransaction from '../models/WalletTransaction.model.js';
import Captain from '../models/Captain.model.js';
import CaptainNotification from '../models/CaptainNotification.model.js';
import PlatformLedger from '../models/PlatformLedger.model.js';
import CommissionSettings from '../models/CommissionSettings.model.js';
import RefundRequest from '../models/RefundRequest.model.js';
import { 
  sendNotificationToUser, 
  sendNotificationToSeller, 
  sendNotificationToCaptain 
} from '../utils/pushNotificationHelper.js';

// Helper: Clean base64 image strings or invalid dummy links
const cleanImage = (img) => {
  if (!img || typeof img !== 'string') return '';
  const trimmed = img.trim();
  if (trimmed.includes('photo-1586201375761-83865001e31c')) return '';
  return trimmed;
};

// High-speed In-memory Cache for Seller Notifications
const sellerNotifCache = new Map();
const sellerDocCache = new Map();
export const invalidateSellerNotifCache = () => {
  sellerNotifCache.clear();
};

// Helper: Generate delivery OTP
const genDeliveryOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

// Helper: Find all eligible captains for a delivery
export const findAllEligibleCaptains = async (deliveryCity = '', deliveryState = '', deliveryPincode = '', sellerCity = '', sellerPincode = '') => {
  const cleanCity = (deliveryCity || sellerCity || '').trim();
  const cleanPincode = (deliveryPincode || sellerPincode || '').trim();
  const cleanState = (deliveryState || '').trim();

  // Tier 1: Match by Pincode / Local Area
  if (cleanPincode) {
    const pinCaptains = await Captain.find({
      status: { $ne: 'rejected' },
      isOnline: true,
      $or: [
        { pinCode: cleanPincode },
        { currentAddress: { $regex: cleanPincode, $options: 'i' } },
        { permanentAddress: { $regex: cleanPincode, $options: 'i' } },
        { 'workingArea.area': { $regex: cleanPincode, $options: 'i' } },
      ],
    }).sort({ createdAt: 1 });
    if (pinCaptains.length > 0) return pinCaptains;
  }

  // Tier 2: Match by City / Working Area
  if (cleanCity) {
    const cityCaptains = await Captain.find({
      status: { $ne: 'rejected' },
      isOnline: true,
      $or: [
        { city: { $regex: cleanCity, $options: 'i' } },
        { currentAddress: { $regex: cleanCity, $options: 'i' } },
        { 'workingArea.city': { $regex: cleanCity, $options: 'i' } },
        { 'workingArea.district': { $regex: cleanCity, $options: 'i' } },
      ],
    }).sort({ createdAt: 1 });
    if (cityCaptains.length > 0) return cityCaptains;
  }

  // Tier 3: Match by State
  if (cleanState) {
    const stateCaptains = await Captain.find({
      status: { $ne: 'rejected' },
      isOnline: true,
      $or: [
        { state: { $regex: cleanState, $options: 'i' } },
        { 'workingArea.state': { $regex: cleanState, $options: 'i' } },
      ],
    }).sort({ createdAt: 1 });
    if (stateCaptains.length > 0) return stateCaptains;
  }

  // Tier 4: All online captains
  const allOnline = await Captain.find({ status: { $ne: 'rejected' }, isOnline: true }).sort({ updatedAt: -1 });
  if (allOnline.length > 0) return allOnline;

  // Fallback: All active captains
  return Captain.find({ status: { $ne: 'rejected' } }).sort({ updatedAt: -1 }).limit(10);
};

// Helper: Auto-assign captain and create notification
export const autoAssignCaptainToOrder = async (notification) => {
  try {
    const parentOrder = await Order.findById(notification.order);
    if (parentOrder && (!parentOrder.captainId || parentOrder.captainStatus === 'Rejected')) {
      const deliveryCity = notification.deliveryAddress?.city || parentOrder.shippingAddress?.city || '';
      const deliveryState = notification.deliveryAddress?.state || parentOrder.shippingAddress?.state || '';
      const deliveryPincode = notification.deliveryAddress?.pincode || parentOrder.shippingAddress?.pinCode || parentOrder.shippingAddress?.pincode || '';
      
      // Look up seller city/pincode for pickup location proximity
      let sellerCity = '';
      let sellerPincode = '';
      if (notification.sellerId) {
        try {
          const sellerDoc = await Seller.findById(notification.sellerId);
          if (sellerDoc) {
            sellerCity = sellerDoc.city || sellerDoc.warehouseLocation?.city || '';
            sellerPincode = sellerDoc.pinCode || sellerDoc.warehouseLocation?.pincode || '';
          }
        } catch (e) {}
      }

      // Fetch dynamic active captain commission rate
      let captainCommRate = parentOrder.captainCommissionRate;
      if (captainCommRate === undefined || captainCommRate === null) {
        try {
          const commSettings = await CommissionSettings.getOrCreateActiveSettings();
          captainCommRate = commSettings?.captainCommission || 5;
        } catch (e) {
          captainCommRate = 5;
        }
      }

      const captainEarnings = parentOrder.captainEarnings > 0 
        ? parentOrder.captainEarnings 
        : Math.max(15, Math.round(((notification.totalAmount || parentOrder.grandTotal || 0) * (captainCommRate / 100)) * 100) / 100);

      const eligibleCaptains = await findAllEligibleCaptains(deliveryCity, deliveryState, deliveryPincode, sellerCity, sellerPincode);

      if (eligibleCaptains && eligibleCaptains.length > 0) {
        const nearestCaptain = eligibleCaptains[0];
        const otp = genDeliveryOtp();

        await Order.findByIdAndUpdate(parentOrder._id, {
          captainId: nearestCaptain._id,
          captainStatus: 'Assigned',
          deliveryOtp: otp,
          captainCommissionRate: captainCommRate,
          captainCommissionAmount: Math.round(((notification.totalAmount || parentOrder.grandTotal || 0) * (captainCommRate / 100)) * 100) / 100,
          captainEarnings,
          captainEarning: captainEarnings,
          captainAssignedAt: new Date(),
        });

        // Save assigned captain info on SellerNotification too
        notification.captainId = nearestCaptain._id;
        notification.captainName = nearestCaptain.name || 'Delivery Captain';
        notification.captainPhone = nearestCaptain.phone || '';
        await notification.save();

        // Broadcast notifications to all eligible online captains
        for (const captain of eligibleCaptains) {
          await CaptainNotification.create({
            captainId: captain._id,
            type: 'JOB_ASSIGNED',
            title: 'New Delivery Assigned!',
            message: `Order #${notification.orderId} from ${notification.sellerName || 'Seller'} — Drop: ${deliveryCity || 'Customer Address'}. Payout: ₹${captainEarnings.toFixed(2)}. Report to pickup immediately.`,
            orderId: notification.orderId,
            order: parentOrder._id,
            amount: captainEarnings,
            icon: 'local_shipping',
          });

          // Trigger FCM Push Notification to Captain device
          sendNotificationToCaptain(captain._id, {
            title: '🛵 New Delivery Assigned!',
            body: `Order #${notification.orderId} — Pickup from ${notification.sellerName || 'Store'}. Payout: ₹${captainEarnings.toFixed(2)}`,
            data: {
              type: 'delivery_assigned',
              orderId: notification.orderId,
              link: '/captain/dashboard',
            },
          }).catch(() => {});
        }

        console.log(`[CaptainAssign] Dispatched Order #${notification.orderId} to ${eligibleCaptains.length} captains (Primary: "${nearestCaptain.name}" - ${nearestCaptain.phone}). OTP: ${otp}, Payout: ₹${captainEarnings}`);
        return nearestCaptain;
      } else {
        console.warn(`[CaptainAssign] No approved/active captain found for Order #${notification.orderId} in ${deliveryCity || 'any area'}.`);
      }
    }
  } catch (err) {
    console.error(`[CaptainAssign ERROR] Failed to auto-assign captain for Order #${notification.orderId}:`, err.message);
  }
  return null;
};


// Helper to find existing product or auto-create fallback for seed/mock frontend items
const findOrCreateProduct = async (productId, productData = {}) => {
  if (!productId) return null;

  // 1. Try finding by ObjectId
  if (mongoose.Types.ObjectId.isValid(productId)) {
    const existing = await Product.findById(productId);
    if (existing) return existing;
  }

  // 2. Try finding by SKU or Name
  let existing = await Product.findOne({
    $or: [
      { sku: String(productId) },
      { name: String(productData.name || productId) },
    ],
  });
  if (existing) return existing;

  // 3. Auto-create product for seed/mock items so DB holds valid reference
  const name = productData.name || `Product ${productId}`;
  const price = Number(productData.salePrice || productData.price || 99);
  const mrp = Number(productData.mrp || productData.originalPrice || price * 1.2);

  const created = await Product.create({
    name,
    sku: String(productId),
    salePrice: price,
    mrp: mrp,
    stock: 100,
    category: productData.category || 'Grocery',
    mainImage: productData.image || productData.mainImage || '',
    seller: productData.seller || 'ShippNex Official Store',
  });

  return created;
};

// Place Order
export const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      shippingAddress,
      deliverySlot = { date: 'Today', time: 'Express Delivery' },
      deliveryInstructions = '',
      paymentMethod = 'COD',
      items: rawBodyItems,
    } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Valid shipping address with Full Name, Phone, and Street Address is required',
      });
    }

    // Retrieve user document to inspect cart array or rawBodyItems
    let userDoc = await User.findById(userId);
    let itemsToProcess = [];

    if (userDoc && userDoc.cart && userDoc.cart.length > 0) {
      itemsToProcess = userDoc.cart;
    } else if (rawBodyItems && Array.isArray(rawBodyItems) && rawBodyItems.length > 0) {
      itemsToProcess = rawBodyItems;
    }

    if (!itemsToProcess || itemsToProcess.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Cannot place order.',
      });
    }

    // Parallel server-side validation of products, pricing, and stock
    const resolvedItems = await Promise.all(
      itemsToProcess.map(async (item) => {
        const targetProdId = item.product?._id || item.product || item.productId || item.id;
        const product = await findOrCreateProduct(targetProdId, item.product || item);
        return { item, product };
      })
    );

    let itemsTotal = 0;
    let totalOriginalPrice = 0;
    const orderItems = [];

    for (const { item, product } of resolvedItems) {
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `One or more products in your cart are no longer available.`,
        });
      }

      const qty = Math.max(1, Number(item.quantity || 1));

      if (product.stock !== undefined && product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${qty}`,
        });
      }

      const unitPrice = Number(product.salePrice || product.price || item.price || 0);
      const originalUnitPrice = Number(product.mrp || product.originalPrice || item.originalPrice || unitPrice);

      itemsTotal += unitPrice * qty;
      totalOriginalPrice += originalUnitPrice * qty;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: unitPrice,
        originalPrice: originalUnitPrice,
        quantity: qty,
        image: cleanImage(product.mainImage || product.image || item.image || (product.variants?.[0]?.image) || '') || product.mainImage || product.image || item.image || '',
        seller: product.seller || item.seller || 'ShippNex Official Store',
      });
    }

    // Fetch dynamic commission & delivery settings
    let globalSellerCommRate = 10;
    let globalCaptainCommRate = 5;
    let deliveryChargeRate = 40;
    let freeDeliveryMinOrderRate = 500;
    let isFreeDeliveryActive = true;
    try {
      const commSettings = await CommissionSettings.getOrCreateActiveSettings();
      if (commSettings) {
        globalSellerCommRate = Number(commSettings.sellerCommission !== undefined ? commSettings.sellerCommission : 10);
        globalCaptainCommRate = Number(commSettings.captainCommission !== undefined ? commSettings.captainCommission : 5);
        deliveryChargeRate = Number(commSettings.deliveryCharge !== undefined ? commSettings.deliveryCharge : 40);
        freeDeliveryMinOrderRate = Number(commSettings.freeDeliveryMinOrder !== undefined ? commSettings.freeDeliveryMinOrder : 500);
        isFreeDeliveryActive = commSettings.isFreeDeliveryEnabled !== undefined ? Boolean(commSettings.isFreeDeliveryEnabled) : true;
      }
    } catch (e) {
      console.warn('[OrderController] Error reading CommissionSettings, using fallback rates:', e.message);
    }

    // Server-side calculation of totals using dynamic delivery rules
    const isFreeShipping = itemsTotal === 0 || (isFreeDeliveryActive && itemsTotal >= freeDeliveryMinOrderRate);
    const shippingFee = isFreeShipping ? 0 : deliveryChargeRate;
    const discount = Math.max(0, totalOriginalPrice - itemsTotal);
    const gst = 0; // GST included in prices
    const grandTotal = itemsTotal + shippingFee;

    // Generate Order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const sellerCommissionAmount = Number(((itemsTotal * globalSellerCommRate) / 100).toFixed(2));
    const sellerEarning = Number((itemsTotal - sellerCommissionAmount).toFixed(2));

    const captainCommissionAmount = Number(((grandTotal * globalCaptainCommRate) / 100).toFixed(2));
    const captainEarnings = Math.max(15, Math.round(captainCommissionAmount * 100) / 100);

    // Create order document in MongoDB with frozen rate snapshots
    const order = await Order.create({
      orderId,
      user: userId,
      items: orderItems,
      shippingAddress,
      deliverySlot,
      deliveryInstructions,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      sellerStatus: 'Pending',
      itemsTotal,
      shippingFee,
      discount,
      gst,
      grandTotal,
      sellerCommissionRate: globalSellerCommRate,
      sellerCommissionAmount,
      sellerEarning,
      captainCommissionRate: globalCaptainCommRate,
      captainCommissionAmount,
      captainEarnings,
      captainEarning: captainEarnings,
    });

    console.log(`[OrderController] Successfully created Order in MongoDB: OrderID=${order.orderId}, UserID=${userId}, GrandTotal=₹${grandTotal}, SellerComm=${globalSellerCommRate}%, CaptainComm=${globalCaptainCommRate}%`);

    // Parallel stock reduction for all ordered items
    const stockUpdates = orderItems.map((orderItem) =>
      Product.findByIdAndUpdate(orderItem.product, {
        $inc: { stock: -orderItem.quantity },
      })
    );

    // -------------------------------------------------------------
    // MULTI-SELLER ORDER SPLITTING & SELLER NOTIFICATION CREATION
    // -------------------------------------------------------------
    const sellerGroups = {};
    for (const item of orderItems) {
      const sellerName = item.seller || 'ShippNex Official Store';
      if (!sellerGroups[sellerName]) {
        sellerGroups[sellerName] = [];
      }
      sellerGroups[sellerName].push(item);
    }

    const sellerNotificationPromises = Object.entries(sellerGroups).map(async ([sellerName, groupItems]) => {
      const groupSubtotal = groupItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

      // Try to find matching seller in Seller model
      let sellerDoc = null;
      if (mongoose.Types.ObjectId.isValid(sellerName)) {
        sellerDoc = await Seller.findById(sellerName).lean();
      }
      if (!sellerDoc) {
        sellerDoc = await Seller.findOne({
          $or: [
            { phone: sellerName },
            { businessName: sellerName },
            { ownerName: sellerName },
          ],
        }).lean();
      }

      const assignedSellerId = sellerDoc ? String(sellerDoc._id) : sellerName;
      const actualSellerName = sellerDoc ? (sellerDoc.businessName || sellerDoc.ownerName || sellerName) : sellerName;
      const commRate = Number(sellerDoc?.commissionPercentage !== undefined ? sellerDoc.commissionPercentage : globalSellerCommRate);
      const commAmount = Number(((groupSubtotal * commRate) / 100).toFixed(2));
      const netAmount = Number((groupSubtotal - commAmount).toFixed(2));

      const notification = await SellerNotification.create({
        sellerId: assignedSellerId,
        sellerName: actualSellerName,
        order: order._id,
        orderId: order.orderId,
        items: groupItems.map(it => ({ ...it, image: cleanImage(it.image) })),
        customerDetails: {
          name: shippingAddress.fullName || userDoc?.name || 'Customer',
          phone: shippingAddress.phone || userDoc?.phone || '',
          email: shippingAddress.email || userDoc?.email || '',
        },
        deliveryAddress: shippingAddress,
        deliverySlot,
        paymentMethod,
        paymentStatus: order.paymentStatus,
        totalAmount: groupSubtotal,
        commissionRate: commRate,
        commissionAmount: commAmount,
        netSellerAmount: netAmount,
        settlementStatus: 'PENDING',
        status: 'NEW',
      });

      invalidateSellerNotifCache();

      // Asynchronous non-blocking push notification to seller
      setImmediate(() => {
        sendNotificationToSeller(assignedSellerId, {
          title: '🔔 New Order Received!',
          body: `Order #${order.orderId} from ${shippingAddress.fullName || 'Customer'} (₹${groupSubtotal.toFixed(2)}). Open to accept.`,
          data: {
            type: 'new_order',
            orderId: order.orderId,
            link: '/seller/orders',
          },
        }).catch(() => {});
      });

      console.log(`[SellerNotification] Created notification for Seller "${actualSellerName}" (SellerID: ${assignedSellerId}, Gross: ₹${groupSubtotal}, Comm: ${commRate}% = ₹${commAmount}, Net: ₹${netAmount}) for Order ${order.orderId}`);
      return notification;
    });

    // Execute stock updates and seller notifications concurrently
    await Promise.all([...stockUpdates, ...sellerNotificationPromises]);

    // Asynchronous non-blocking push notification to user
    setImmediate(() => {
      sendNotificationToUser(userId, {
        title: 'Order Placed Successfully! 🎉',
        body: `Your order #${order.orderId} of ₹${grandTotal} has been placed. We are assigning the store.`,
        data: {
          type: 'order_placed',
          orderId: order.orderId,
          link: '/profile',
        },
      }).catch(() => {});
    });

    // Clear user cart array in User collection after successful order creation
    let isUserUpdated = false;
    if (!userDoc) {
      userDoc = await User.findById(userId);
    }
    if (userDoc) {
      userDoc.cart = [];
      isUserUpdated = true;
    }

    if (userDoc) {
      const submittedName = req.body.name || req.body.fullName || (shippingAddress && shippingAddress.fullName) || '';
      const submittedEmail = req.body.email || (shippingAddress && shippingAddress.email) || '';
      const submittedPhone = req.body.phone || (shippingAddress && shippingAddress.phone) || '';

      // 1. Update Name if missing or default placeholder ("User", "Customer")
      if (submittedName && submittedName.trim().length > 0) {
        const cleanName = submittedName.trim();
        if (!userDoc.name || userDoc.name === 'User' || userDoc.name === 'Customer' || userDoc.name.trim() === '') {
          userDoc.name = cleanName;
          isUserUpdated = true;
        }
      }

      // 2. Update Email if missing/empty
      if (submittedEmail && submittedEmail.trim().length > 0) {
        const cleanEmail = submittedEmail.trim().toLowerCase();
        if (!userDoc.email || userDoc.email.trim() === '') {
          userDoc.email = cleanEmail;
          isUserUpdated = true;
        }
      }

      // 3. Update Phone if missing
      if (submittedPhone && submittedPhone.trim().length > 0) {
        const cleanPhone = submittedPhone.trim();
        if (!userDoc.phone || userDoc.phone.trim() === '') {
          userDoc.phone = cleanPhone;
          isUserUpdated = true;
        }
      }

      // 4. Save Shipping Address to User's saved addresses array if not already present
      if (shippingAddress && shippingAddress.addressLine1) {
        const cleanShippingName = (shippingAddress.fullName && shippingAddress.fullName !== 'User' && shippingAddress.fullName !== 'Customer')
          ? shippingAddress.fullName
          : (userDoc.name && userDoc.name !== 'User' && userDoc.name !== 'Customer' ? userDoc.name : 'Customer');

        shippingAddress.fullName = cleanShippingName;

        const addrLine1 = shippingAddress.addressLine1.trim().toLowerCase();
        const addrCity = (shippingAddress.city || '').trim().toLowerCase();
        const addrZip = (shippingAddress.pincode || shippingAddress.zip || '').trim();

        const existingAddressIndex = userDoc.addresses.findIndex((a) => {
          const l1 = (a.addressLine1 || a.address || '').trim().toLowerCase();
          const c = (a.city || '').trim().toLowerCase();
          const z = (a.pincode || a.zip || '').trim();
          return l1 === addrLine1 && c === addrCity && z === addrZip;
        });

        if (existingAddressIndex >= 0) {
          if (!userDoc.addresses[existingAddressIndex].fullName || userDoc.addresses[existingAddressIndex].fullName === 'User' || userDoc.addresses[existingAddressIndex].fullName === 'Customer') {
            userDoc.addresses[existingAddressIndex].fullName = cleanShippingName;
            isUserUpdated = true;
          }
        } else {
          userDoc.addresses.push({
            fullName: cleanShippingName,
            phone: shippingAddress.phone || userDoc.phone,
            altPhone: shippingAddress.altPhone || '',
            email: shippingAddress.email || userDoc.email,
            addressLine1: shippingAddress.addressLine1,
            addressLine2: shippingAddress.addressLine2 || '',
            landmark: shippingAddress.landmark || '',
            city: shippingAddress.city || 'Noida',
            state: shippingAddress.state || 'Uttar Pradesh',
            pincode: shippingAddress.pincode || shippingAddress.zip || '201301',
            country: shippingAddress.country || 'India',
            addressType: shippingAddress.addressType || shippingAddress.type || 'Home',
            isDefault: userDoc.addresses.length === 0,
          });
          isUserUpdated = true;
        }
      }

      // Also clean up any addresses containing placeholder names
      if (userDoc.name && userDoc.name !== 'User' && userDoc.name !== 'Customer') {
        userDoc.addresses.forEach((a) => {
          if (!a.fullName || a.fullName === 'User' || a.fullName === 'Customer') {
            a.fullName = userDoc.name;
            isUserUpdated = true;
          }
        });
      }

      if (isUserUpdated) {
        await userDoc.save();
        console.log(`[OrderController] Successfully updated User profile for User ID ${userId}: Name="${userDoc.name}", Email="${userDoc.email}"`);
      }
    }

    invalidateUserOrdersCache(userId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
      user: userDoc
        ? {
            id: userDoc._id,
            _id: userDoc._id,
            name: userDoc.name,
            email: userDoc.email,
            phone: userDoc.phone,
            role: userDoc.role,
            addresses: userDoc.addresses,
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// In-memory cache for user orders
const userOrdersCache = new Map();

export const invalidateUserOrdersCache = (userId) => {
  if (userId) {
    userOrdersCache.delete(String(userId));
  } else {
    userOrdersCache.clear();
  }
};

// Get User Orders (Ultra-Fast Response with In-Memory Caching & Lean Projection)
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const now = Date.now();

    // Cache hit (15 seconds TTL)
    if (!req.query.fresh && userOrdersCache.has(userId)) {
      const cached = userOrdersCache.get(userId);
      if (now - cached.timestamp < 15000) {
        return res.status(200).json(cached.data);
      }
    }

    const orders = await Order.find({ user: userId })
      .select('orderId items shippingAddress deliverySlot paymentMethod paymentStatus orderStatus returnStatus returnReason returnedAt refundStatus refundedAt sellerStatus rejectionReason itemsTotal shippingFee discount gst grandTotal createdAt updatedAt')
      .populate({ path: 'items.product', select: 'name mainImage image category' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const sanitizedOrders = (orders || []).map(order => {
      if (Array.isArray(order.items)) {
        order.items = order.items.map(it => {
          let resolvedImage = it.image;
          if (!resolvedImage || (typeof resolvedImage === 'string' && resolvedImage.includes('photo-1586201375761-83865001e31c'))) {
            resolvedImage = it.product?.mainImage || it.product?.image || '';
          }
          return {
            ...it,
            image: resolvedImage || it.image || '',
          };
        });
      }
      return order;
    });

    const responsePayload = {
      success: true,
      orders: sanitizedOrders,
    };

    userOrdersCache.set(userId, { data: responsePayload, timestamp: now });

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

// Get Order Details by ID (supports MongoDB _id or orderId string)
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = await Order.findOne({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
        { orderId: id },
      ],
    })
      .populate('captainId', 'name phone vehicleType liveLocation')
      .populate('items.product', 'name mainImage image price salePrice');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Auto-generate deliveryOtp if missing so customer can see it on /track-order
    if (!order.deliveryOtp && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Rejected') {
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      order.deliveryOtp = generatedOtp;
      await Order.findByIdAndUpdate(order._id, { deliveryOtp: generatedOtp });
    }

    const orderObj = order.toObject ? order.toObject() : order;
    if (Array.isArray(orderObj.items)) {
      orderObj.items = orderObj.items.map(it => {
        let resolvedImage = it.image;
        if (!resolvedImage || (typeof resolvedImage === 'string' && resolvedImage.includes('photo-1586201375761-83865001e31c'))) {
          resolvedImage = it.product?.mainImage || it.product?.image || '';
        }
        return {
          ...it,
          image: resolvedImage || it.image || '',
        };
      });
    }

    res.status(200).json({
      success: true,
      order: orderObj,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------------
// SELLER SPECIFIC ORDER & NOTIFICATION CONTROLLER ENDPOINTS
// -------------------------------------------------------------------

// @desc    Get Seller Incoming Notifications & Order History
// @route   GET /api/orders/seller/notifications
// @access  Private/Seller
export const getSellerNotifications = async (req, res, next) => {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const limit = req.query.limit !== undefined 
      ? (Number(req.query.limit) === 0 ? 0 : Math.min(50, Math.max(1, Number(req.query.limit)))) 
      : 20;
    const page = Math.max(1, Number(req.query.page) || 1);

    const now = Date.now();
    const cacheKey = `${sellerId}_p${page}_l${limit}`;
    const cached = sellerNotifCache.get(cacheKey);
    if (cached && (now - cached.timestamp < 3500)) {
      return res.status(200).json(cached.data);
    }

    let sellerDoc = sellerDocCache.get(sellerId)?.doc;
    if (!sellerDoc && mongoose.Types.ObjectId.isValid(sellerId)) {
      sellerDoc = await Seller.findById(sellerId).select('businessName ownerName phone').lean();
      if (sellerDoc) {
        sellerDocCache.set(sellerId, { doc: sellerDoc, timestamp: now });
      }
    }

    const possibleSellerKeys = [
      sellerId,
      sellerDoc?._id ? String(sellerDoc._id) : null,
      sellerDoc?.businessName,
      sellerDoc?.ownerName,
      sellerDoc?.phone
    ].filter(Boolean);

    const query = {
      $or: [
        { sellerId: { $in: possibleSellerKeys } },
        { sellerName: { $in: possibleSellerKeys } },
      ],
    };

    let dbQuery = SellerNotification.find(query)
      .select('sellerId sellerName order orderId items.name items.price items.originalPrice items.quantity items.image items.product customerDetails deliveryAddress deliverySlot paymentMethod paymentStatus totalAmount status rejectionReason commissionRate commissionAmount netSellerAmount settlementStatus proofOfDeliveryUrl captainId captainName captainPhone viewedAt acceptedAt rejectedAt settledAt createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    if (limit > 0) {
      dbQuery = dbQuery.skip((page - 1) * limit).limit(limit);
    }

    const [rawNotifications, newNotificationsCount] = await Promise.all([
      dbQuery,
      SellerNotification.countDocuments({ ...query, status: 'NEW' }),
    ]);

    const notifications = rawNotifications.map(n => {
      if (Array.isArray(n.items)) {
        n.items = n.items.map(it => {
          if (typeof it.image === 'string' && it.image.includes('photo-1586201375761-83865001e31c')) {
            it.image = it.product?.mainImage || it.product?.image || '';
          }
          return it;
        });
      }
      return n;
    });

    const responsePayload = {
      success: true,
      count: notifications.length,
      newCount: newNotificationsCount,
      notifications,
    };

    sellerNotifCache.set(cacheKey, { data: responsePayload, timestamp: now });

    res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Seller Notification as Viewed
// @route   PUT /api/orders/seller/notifications/:id/view
// @access  Private/Seller
export const markNotificationViewed = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    const notification = await SellerNotification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.status === 'NEW') {
      notification.status = 'VIEWED';
      notification.viewedAt = new Date();
      await notification.save();
      invalidateSellerNotifCache();
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept Seller Order
// @route   PUT /api/orders/seller/notifications/:id/accept
// @access  Private/Seller
export const acceptSellerOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Order notification not found' });
    }
    const notification = await SellerNotification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Order notification not found' });
    }

    if (notification.status === 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: 'Order notification is already rejected',
      });
    }

    const now = new Date();
    notification.status = 'ACCEPTED';
    if (!notification.acceptedAt) {
      notification.acceptedAt = now;
    }
    await notification.save();
    invalidateSellerNotifCache();

    // Update parent order
    if (notification.order) {
      await Order.findByIdAndUpdate(notification.order, {
        orderStatus: 'Accepted',
        sellerStatus: 'Accepted',
        acceptedAt: now,
      });
    }

    console.log(`[OrderController] Seller accepted Order ID ${notification.orderId}`);

    // Auto-assign nearest available captain and notify them immediately
    await autoAssignCaptainToOrder(notification);

    res.status(200).json({
      success: true,
      message: 'Order accepted successfully and assigned to nearest delivery captain!',
      notification,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Reject Seller Order
// @route   PUT /api/orders/seller/notifications/:id/reject
// @access  Private/Seller
export const rejectSellerOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: 'Order notification not found' });
    }

    const rawBody = req.body || {};
    const rejectionReason = typeof rawBody === 'string' ? rawBody : (rawBody.rejectionReason || rawBody.reason);
    const customReason = rawBody.customReason;

    const finalReason = rejectionReason === 'Other' && customReason
      ? customReason.trim()
      : (rejectionReason || 'Unable to fulfill order');

    const notification = await SellerNotification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Order notification not found' });
    }

    if (notification.status === 'ACCEPTED' || notification.status === 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: `Order notification is already ${notification.status.toLowerCase()}`,
      });
    }

    const now = new Date();
    notification.status = 'REJECTED';
    notification.rejectionReason = finalReason;
    notification.rejectedAt = now;
    await notification.save();
    invalidateSellerNotifCache();

    // Restore stock for items in this notification
    if (Array.isArray(notification.items)) {
      for (const item of notification.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    // Update parent order
    if (notification.order) {
      await Order.findByIdAndUpdate(notification.order, {
        orderStatus: 'Rejected',
        sellerStatus: 'Rejected',
        rejectionReason: finalReason,
        rejectedAt: now,
      });
    }

    console.log(`[OrderController] Seller rejected Order ID ${notification.orderId}. Reason: "${finalReason}"`);

    res.status(200).json({
      success: true,
      message: 'Order rejected successfully',
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Seller Order Status (Accept, Reject, Out for Delivery, Delivered)
// @route   PUT /api/orders/seller/notifications/:id/status
// @access  Private/Seller
export const updateSellerOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const notification = await SellerNotification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Order notification not found' });
    }

    const now = new Date();
    let mappedNotificationStatus = status;
    let mappedOrderStatus = status;

    if (status === 'ACCEPTED' || status === 'Accepted') {
      mappedNotificationStatus = 'ACCEPTED';
      mappedOrderStatus = 'Accepted';
      notification.acceptedAt = now;
      await autoAssignCaptainToOrder(notification);
    } else if (status === 'REJECTED' || status === 'Rejected') {
      mappedNotificationStatus = 'REJECTED';
      mappedOrderStatus = 'Rejected';
      notification.rejectedAt = now;
      notification.rejectionReason = rejectionReason || 'Unable to fulfill order';
      
      // Restore stock for items
      if (Array.isArray(notification.items)) {
        for (const item of notification.items) {
          if (item.product) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
          }
        }
      }
    } else if (status === 'Out for Delivery' || status === 'OUT_FOR_DELIVERY') {
      mappedNotificationStatus = 'OUT_FOR_DELIVERY';
      mappedOrderStatus = 'Out for Delivery';
      await autoAssignCaptainToOrder(notification);
    } else if (status === 'Delivered' || status === 'DELIVERED') {
      mappedNotificationStatus = 'DELIVERED';
      mappedOrderStatus = 'Delivered';
      notification.paymentStatus = 'Paid';
    } else if (status === 'Processing' || status === 'PACKED') {
      mappedNotificationStatus = 'PROCESSING';
      mappedOrderStatus = 'Processing';
    }

    notification.status = mappedNotificationStatus;
    await notification.save();
    invalidateSellerNotifCache();

    if (notification.order) {
      await Order.findByIdAndUpdate(notification.order, {
        orderStatus: mappedOrderStatus,
        sellerStatus: mappedNotificationStatus,
        ...(mappedNotificationStatus === 'DELIVERED' ? { paymentStatus: 'Paid' } : {}),
        ...(mappedNotificationStatus === 'REJECTED' ? { rejectionReason: notification.rejectionReason } : {}),
      });
    }

    console.log(`[OrderController] Updated Order ID ${notification.orderId} status to "${mappedOrderStatus}"`);

    // Automatic Settlement Trigger upon Delivery
    if (mappedNotificationStatus === 'DELIVERED') {
      await processSellerSettlement(notification._id);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${mappedOrderStatus}`,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Process Automatic Seller Settlement
export const processSellerSettlement = async (notificationId) => {
  try {
    // Atomic check & lock: find notification with settlementStatus: 'PENDING'
    const notification = await SellerNotification.findOneAndUpdate(
      { 
        _id: notificationId, 
        settlementStatus: 'PENDING'
      },
      { 
        $set: { 
          settlementStatus: 'SETTLED', 
          settledAt: new Date() 
        } 
      },
      { new: true }
    );

    if (!notification) {
      console.log(`[Settlement] Notification ${notificationId} is already settled or not eligible.`);
      return null;
    }

    // Payment Verification: Online Pay or Delivered COD (which marks paymentStatus = 'Paid')
    const payMethod = (notification.paymentMethod || '').toUpperCase();
    const isPayCompleted = ['ONLINE', 'UPI', 'CARD', 'NETBANKING', 'WALLET'].includes(payMethod) || notification.paymentStatus === 'Paid' || notification.status === 'DELIVERED';

    if (!isPayCompleted) {
      console.log(`[Settlement] Notification ${notificationId} skipped automatic wallet credit because Payment is not completed.`);
      return notification;
    }

    // Find matching seller in Seller model
    let seller = await Seller.findById(notification.sellerId);
    if (!seller && mongoose.Types.ObjectId.isValid(notification.sellerId) === false) {
      seller = await Seller.findOne({ 
        $or: [
          { phone: notification.sellerId },
          { businessName: notification.sellerName },
          { ownerName: notification.sellerName }
        ]
      });
    }

    if (!seller) {
      console.warn(`[Settlement] Seller document not found for sellerId/sellerName: "${notification.sellerId}" / "${notification.sellerName}"`);
      return notification;
    }

    const grossAmount = Number(notification.totalAmount || 0);
    const commRate = Number(notification.commissionRate !== undefined ? notification.commissionRate : (seller.commissionPercentage || 10));
    const commAmount = Number(((grossAmount * commRate) / 100).toFixed(2));
    const netAmount = Number((grossAmount - commAmount).toFixed(2));

    const balanceBefore = Number(seller.walletBalance || 0);
    const balanceAfter = Number((balanceBefore + netAmount).toFixed(2));

    // Update seller financial balances atomically
    seller.walletBalance = balanceAfter;
    seller.totalEarnings = Number(((seller.totalEarnings || 0) + netAmount).toFixed(2));
    seller.totalCommissionDeducted = Number(((seller.totalCommissionDeducted || 0) + commAmount).toFixed(2));
    await seller.save();

    // Create Wallet Transaction Record
    const txnId = `TXN-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;
    await WalletTransaction.create({
      transactionId: txnId,
      sellerId: String(seller._id),
      order: notification.order,
      orderId: notification.orderId,
      notification: notification._id,
      type: 'CREDIT',
      grossAmount,
      commissionRate: commRate,
      commissionAmount: commAmount,
      netAmount,
      balanceBefore,
      balanceAfter,
      paymentMethod: notification.paymentMethod || 'ONLINE',
      settlementStatus: 'SETTLED',
      description: `Wallet credit for Delivered Order #${notification.orderId} (Net ₹${netAmount} after ${commRate}% commission ₹${commAmount})`,
    });

    // Central Platform Ledger: Record Seller Net Earning
    await PlatformLedger.create({
      transactionId: `TXN-LED-SEL-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`,
      category: 'SELLER_EARNING',
      type: 'CREDIT',
      amount: netAmount,
      source: 'PLATFORM_TREASURY',
      destination: 'SELLER',
      entityType: 'SELLER',
      entityId: String(seller._id),
      entityName: seller.businessName || seller.ownerName || 'Seller',
      referenceModel: 'Order',
      referenceId: notification.orderId,
      referenceObjId: notification.order,
      status: 'SUCCESS',
      balanceBefore,
      balanceAfter,
      description: `Seller net earning credited for Order #${notification.orderId}`,
      metadata: { grossAmount, commRate, commAmount, netAmount },
    }).catch(err => console.warn('[PlatformLedger] Seller earning log failed:', err.message));

    // Central Platform Ledger: Record Platform Commission
    if (commAmount > 0) {
      await PlatformLedger.create({
        transactionId: `TXN-LED-COMM-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`,
        category: 'PLATFORM_COMMISSION',
        type: 'CREDIT',
        amount: commAmount,
        source: 'SELLER_ORDER',
        destination: 'PLATFORM_TREASURY',
        entityType: 'SELLER',
        entityId: String(seller._id),
        entityName: seller.businessName || seller.ownerName || 'Seller',
        referenceModel: 'Order',
        referenceId: notification.orderId,
        referenceObjId: notification.order,
        status: 'SUCCESS',
        description: `Platform commission (${commRate}%) earned on Order #${notification.orderId}`,
        metadata: { grossAmount, commRate, commAmount },
      }).catch(err => console.warn('[PlatformLedger] Commission log failed:', err.message));
    }

    console.log(`[Settlement SUCCESS] Credited ₹${netAmount} (Gross: ₹${grossAmount}, Comm ${commRate}%: ₹${commAmount}) to Seller "${seller.businessName}" (Balance: ₹${balanceBefore} -> ₹${balanceAfter})`);
    return notification;
  } catch (err) {
    console.error(`[Settlement ERROR] Failed processing settlement for notification ${notificationId}:`, err);
    return null;
  }
};

// @desc   Request Return on Delivered Order
// @route  POST /api/orders/:id/return
// @access Private/User
export const requestOrderReturn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, remarks } = req.body;

    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid reason for the return request.' });
    }

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const order = await Order.findOne(
      isMongoId 
        ? { $or: [{ _id: id }, { orderId: id }], user: req.user.id }
        : { orderId: id, user: req.user.id }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or unauthorized.' });
    }

    const currentStatus = order.orderStatus || order.status || '';
    const isDelivered = ['Delivered', 'DELIVERED', 'Completed'].includes(currentStatus) || order.captainStatus === 'Delivered';
    if (!isDelivered) {
      return res.status(400).json({
        success: false,
        message: `Only delivered orders are eligible for return. Current status is "${currentStatus}".`,
      });
    }

    if (order.returnStatus && ['Pending', 'Approved', 'Completed'].includes(order.returnStatus)) {
      return res.status(400).json({
        success: false,
        message: `A return request has already been submitted for this order (Status: ${order.returnStatus}).`,
      });
    }

    const formattedReason = String(reason).trim();
    const cleanRemarks = remarks ? String(remarks).trim() : '';
    const fullReasonText = cleanRemarks ? `${formattedReason} - ${cleanRemarks}` : formattedReason;

    order.orderStatus = 'Return Requested';
    order.returnStatus = 'Pending';
    order.returnReason = fullReasonText;
    order.returnedAt = new Date();
    await order.save();

    invalidateUserOrdersCache(req.user.id);

    // Create RefundRequest record for Admin Financials / SuperAdmin Refund Management
    const refundId = `REFUND-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`;
    const refundReq = await RefundRequest.create({
      refundId,
      orderId: order.orderId,
      order: order._id,
      userId: req.user.id,
      userName: order.shippingAddress?.fullName || req.user.name || 'Customer',
      userPhone: order.shippingAddress?.phone || req.user.phone || '',
      amount: order.grandTotal || 0,
      reason: fullReasonText,
      status: 'REQUESTED',
      paymentMethod: order.paymentMethod || 'COD',
      remarks: cleanRemarks,
    }).catch(err => console.warn('[RefundRequest] Creation error:', err.message));

    // Update Seller Notifications so seller dashboard shows return request
    await SellerNotification.updateMany(
      { order: order._id },
      {
        $set: {
          status: 'RETURNED',
          rejectionReason: `Customer Return Requested: ${fullReasonText}`,
        }
      }
    ).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Return request submitted successfully. Our team will review and process your return shortly.',
      order,
      refundRequest: refundReq || null,
    });
  } catch (error) {
    console.error('[OrderController] Error requesting order return:', error);
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// Razorpay Payment Integration
// ──────────────────────────────────────────────────────────────────────────────

import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TRZdg2aAOYv4KK',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'Zu7lopLZWWZtA4T0R5Z2ORhU',
});

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: 'Amount and orderId are required' });
    }

    const options = {
      amount: Math.round(amount),
      currency: 'INR',
      receipt: `order_${orderId}_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Link the Razorpay order to the local order so the webhook can find it. Best-effort:
    // the webhook falls back to the receipt, so a failure here must not break checkout.
    try {
      await Order.updateOne(
        {
          user: req.user.id,
          $or: [
            { orderId: String(orderId) },
            ...(/^[a-f0-9]{24}$/i.test(String(orderId)) ? [{ _id: orderId }] : []),
          ],
        },
        { $set: { 'razorpay.orderId': razorpayOrder.id } }
      );
    } catch (linkError) {
      console.warn('[Razorpay Create Order] Could not link Razorpay order to local order:', linkError.message);
    }

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error('[Razorpay Create Order Error]', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details are missing' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'Zu7lopLZWWZtA4T0R5Z2ORhU');
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update order payment status
    const order = await Order.findOne({
      $or: [{ _id: orderId }, { orderId: orderId }]
    });

    if (order) {
      order.paymentStatus = 'Paid';
      order.paymentMethod = 'ONLINE';
      // Record the verified payment so a late `payment.failed` webhook for an earlier
      // attempt cannot overwrite it.
      order.razorpay.orderId = razorpay_order_id;
      order.razorpay.paymentId = razorpay_payment_id;
      order.razorpay.paymentStatus = 'captured';
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      orderId: order?._id,
    });
  } catch (error) {
    console.error('[Razorpay Verify Payment Error]', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};


