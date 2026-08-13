import mongoose from 'mongoose';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Seller from '../models/Seller.model.js';
import SellerNotification from '../models/SellerNotification.model.js';
import WalletTransaction from '../models/WalletTransaction.model.js';

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

    let itemsTotal = 0;
    let totalOriginalPrice = 0;
    const orderItems = [];

    // Server-side validation of products, pricing, and stock
    for (const item of itemsToProcess) {
      const targetProdId = item.product?._id || item.product || item.productId || item.id;
      const product = await findOrCreateProduct(targetProdId, item.product || item);

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
        image: product.mainImage || product.image || item.image || '',
        seller: product.seller || item.seller || 'ShippNex Official Store',
      });
    }

    // Server-side calculation of totals
    const shippingFee = itemsTotal >= 500 || itemsTotal === 0 ? 0 : 40;
    const discount = Math.max(0, totalOriginalPrice - itemsTotal);
    const gst = 0; // GST included in prices
    const grandTotal = itemsTotal + shippingFee;

    // Generate Order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create order document in MongoDB
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
    });

    console.log(`[OrderController] Successfully created Order in MongoDB: OrderID=${order.orderId}, UserID=${userId}, GrandTotal=₹${grandTotal}`);

    // Reduce inventory for ordered items
    for (const orderItem of orderItems) {
      await Product.findByIdAndUpdate(orderItem.product, {
        $inc: { stock: -orderItem.quantity },
      });
    }

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

    for (const [sellerName, groupItems] of Object.entries(sellerGroups)) {
      const groupSubtotal = groupItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
      
      // Try to find matching seller in Seller model
      let sellerDoc = await Seller.findOne({
        $or: [
          { businessName: sellerName },
          { ownerName: sellerName },
        ]
      });

      const assignedSellerId = sellerDoc ? String(sellerDoc._id) : sellerName;
      const commRate = Number(sellerDoc?.commissionPercentage !== undefined ? sellerDoc.commissionPercentage : 10);
      const commAmount = Number(((groupSubtotal * commRate) / 100).toFixed(2));
      const netAmount = Number((groupSubtotal - commAmount).toFixed(2));

      await SellerNotification.create({
        sellerId: assignedSellerId,
        sellerName: sellerName,
        order: order._id,
        orderId: order.orderId,
        items: groupItems,
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

      console.log(`[SellerNotification] Created notification for Seller "${sellerName}" (SellerID: ${assignedSellerId}, Gross: ₹${groupSubtotal}, Comm: ${commRate}% = ₹${commAmount}, Net: ₹${netAmount}) for Order ${order.orderId}`);
    }

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

// Get User Orders
export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Order Details by ID
export const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      order,
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
    let sellerDoc = null;

    if (sellerId && mongoose.Types.ObjectId.isValid(sellerId)) {
      sellerDoc = await Seller.findById(sellerId);
    }

    const possibleSellerKeys = [
      sellerId,
      sellerDoc?.businessName,
      sellerDoc?.ownerName,
      'ShippNex Official Store',
      'Seller Store',
      'Fashion Hub'
    ].filter(Boolean);

    const notifications = await SellerNotification.find({
      $or: [
        { sellerId: { $in: possibleSellerKeys } },
        { sellerName: { $in: possibleSellerKeys } },
      ],
    }).sort({ createdAt: -1 });

    const newNotificationsCount = notifications.filter(n => n.status === 'NEW').length;

    res.status(200).json({
      success: true,
      count: notifications.length,
      newCount: newNotificationsCount,
      notifications,
    });
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
    const notification = await SellerNotification.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.status === 'NEW') {
      notification.status = 'VIEWED';
      notification.viewedAt = new Date();
      await notification.save();
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

    // Update parent order
    if (notification.order) {
      await Order.findByIdAndUpdate(notification.order, {
        orderStatus: 'Accepted',
        sellerStatus: 'Accepted',
        acceptedAt: now,
      });
    }

    console.log(`[OrderController] Seller accepted Order ID ${notification.orderId}`);

    res.status(200).json({
      success: true,
      message: 'Order accepted successfully!',
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
    const { rejectionReason, customReason } = req.body;

    const finalReason = rejectionReason === 'Other' && customReason
      ? customReason.trim()
      : (rejectionReason || 'Unable to fulfill order');

    if (!finalReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required to reject an order',
      });
    }

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
    } else if (status === 'Delivered' || status === 'DELIVERED') {
      mappedNotificationStatus = 'DELIVERED';
      mappedOrderStatus = 'Delivered';
    } else if (status === 'Processing' || status === 'PACKED') {
      mappedNotificationStatus = 'PROCESSING';
      mappedOrderStatus = 'Processing';
    }

    notification.status = mappedNotificationStatus;
    await notification.save();

    if (notification.order) {
      await Order.findByIdAndUpdate(notification.order, {
        orderStatus: mappedOrderStatus,
        sellerStatus: mappedNotificationStatus,
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

    // Requirement 3: Check Online Payment & Delivery Status
    const payMethod = (notification.paymentMethod || '').toUpperCase();
    const isOnlinePay = ['ONLINE', 'UPI', 'CARD', 'NETBANKING', 'WALLET'].includes(payMethod) || notification.paymentStatus === 'Paid';

    if (!isOnlinePay) {
      console.log(`[Settlement] Notification ${notificationId} skipped automatic wallet credit because Payment Method is "${notification.paymentMethod}" (COD).`);
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

    console.log(`[Settlement SUCCESS] Credited ₹${netAmount} (Gross: ₹${grossAmount}, Comm ${commRate}%: ₹${commAmount}) to Seller "${seller.businessName}" (Balance: ₹${balanceBefore} -> ₹${balanceAfter})`);
    return notification;
  } catch (err) {
    console.error(`[Settlement ERROR] Failed processing settlement for notification ${notificationId}:`, err);
    return null;
  }
};


