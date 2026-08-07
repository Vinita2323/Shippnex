import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';

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

// Get user cart directly from User document
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('cart.product');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      cart: {
        items: user.cart || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart inside User document
export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, product: productPayload } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await findOrCreateProduct(productId, productPayload);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock !== undefined && product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.cart) user.cart = [];

    const existingIndex = user.cart.findIndex(
      (item) => item.product && item.product.toString() === product._id.toString()
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += Number(quantity);
    } else {
      user.cart.push({ product: product._id, quantity: Number(quantity) });
    }

    await user.save();
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: {
        items: user.cart || [],
      },
    });
  } catch (error) {
    console.error('Error in addToCart controller:', error);
    next(error);
  }
};

// Update cart item quantity inside User document
export const updateCartItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, delta, quantity, product: productPayload } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await findOrCreateProduct(productId, productPayload);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const targetDbId = product._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.cart) user.cart = [];

    const existingIndex = user.cart.findIndex(
      (item) => item.product && item.product.toString() === targetDbId
    );

    let targetQty = 1;

    if (existingIndex > -1) {
      if (quantity !== undefined) {
        targetQty = Number(quantity);
      } else if (delta !== undefined) {
        targetQty = user.cart[existingIndex].quantity + Number(delta);
      } else {
        targetQty = user.cart[existingIndex].quantity;
      }

      if (targetQty <= 0) {
        user.cart.splice(existingIndex, 1);
      } else {
        user.cart[existingIndex].quantity = targetQty;
      }
    } else {
      if (quantity !== undefined) {
        targetQty = Number(quantity);
      } else if (delta !== undefined) {
        targetQty = Math.max(1, Number(delta));
      }

      if (targetQty > 0) {
        user.cart.push({ product: product._id, quantity: targetQty });
      }
    }

    await user.save();
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: {
        items: user.cart || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart inside User document
export const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const product = await findOrCreateProduct(productId);
    const targetDbId = product ? product._id.toString() : String(productId);

    if (user.cart) {
      user.cart = user.cart.filter(
        (item) => item.product && item.product.toString() !== targetDbId
      );
      await user.save();
      await user.populate('cart.product');
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: user.cart || [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart inside User document
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user) {
      user.cart = [];
      await user.save();
    }
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { items: [] },
    });
  } catch (error) {
    next(error);
  }
};

// Sync bulk cart items into User document
export const syncCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items = [] } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.cart) user.cart = [];

    for (const item of items) {
      const prodId = item.productId || item.id || item._id;
      const product = await findOrCreateProduct(prodId, item);
      if (product) {
        const existingIndex = user.cart.findIndex(
          (i) => i.product && i.product.toString() === product._id.toString()
        );
        if (existingIndex > -1) {
          user.cart[existingIndex].quantity = Math.max(1, Number(item.quantity || user.cart[existingIndex].quantity));
        } else {
          user.cart.push({ product: product._id, quantity: Math.max(1, Number(item.quantity || 1)) });
        }
      }
    }

    await user.save();
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart synced successfully',
      cart: {
        items: user.cart || [],
      },
    });
  } catch (error) {
    next(error);
  }
};
