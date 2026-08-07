import mongoose from 'mongoose';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

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
