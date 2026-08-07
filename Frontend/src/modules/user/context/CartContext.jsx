import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { cartService } from '../../../services/authService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = () => {
    return !!localStorage.getItem('shippnex_user_token');
  };

  // Format backend cart items for frontend consumption
  const formatCartItems = (backendItems = []) => {
    return backendItems.map((item) => {
      const prod = item.product || {};
      const price = Number(prod.salePrice ?? prod.price ?? 0);
      const originalPrice = Number(prod.mrp ?? prod.originalPrice ?? price);
      return {
        ...prod,
        id: prod._id || prod.id,
        productId: prod._id || prod.id,
        name: prod.name,
        image: prod.image || prod.mainImage,
        price,
        originalPrice,
        quantity: item.quantity,
      };
    });
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated()) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res && res.success && res.cart) {
        setCartItems(formatCartItems(res.cart.items || []));
      }
    } catch (err) {
      console.error('Failed to fetch server cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (product, quantity = 1, options = {}) => {
    if (!product) return { success: false };

    const productId = product.id || product._id;

    // Reject unauthenticated requests and save pending action
    if (!isAuthenticated()) {
      const pendingAction = {
        type: options.isBuyNow ? 'BUY_NOW' : 'ADD_TO_CART',
        product,
        quantity,
        returnUrl: options.returnUrl || window.location.pathname,
      };
      localStorage.setItem('shippnex_pending_action', JSON.stringify(pendingAction));
      if (options.navigate) {
        options.navigate('/login');
      }
      return { requiresAuth: true };
    }

    try {
      const res = await cartService.addToCart(productId, quantity, product);
      if (res && res.success && res.cart) {
        const formatted = formatCartItems(res.cart.items || []);
        setCartItems(formatted);
        localStorage.setItem('shippnex_local_cart', JSON.stringify(formatted));
        return { success: true };
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, message: err.response?.data?.message || 'Failed to add item to cart' };
    }
  };

  const updateQuantity = async (productId, delta, exactQty) => {
    if (!isAuthenticated()) return;
    try {
      const targetProd = cartItems.find((i) => String(i.id || i._id) === String(productId));
      const res = await cartService.updateCartItem(productId, delta, exactQty, targetProd);
      if (res && res.success && res.cart) {
        const formatted = formatCartItems(res.cart.items || []);
        setCartItems(formatted);
        localStorage.setItem('shippnex_local_cart', JSON.stringify(formatted));
      }
    } catch (err) {
      console.error('Error updating cart item quantity:', err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated()) return;
    try {
      const res = await cartService.removeFromCart(productId);
      if (res && res.success && res.cart) {
        const formatted = formatCartItems(res.cart.items || []);
        setCartItems(formatted);
        localStorage.setItem('shippnex_local_cart', JSON.stringify(formatted));
      }
    } catch (err) {
      console.error('Error removing item from cart:', err);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated()) {
      setCartItems([]);
      return;
    }
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const isInCart = (productId) => {
    if (!productId) return false;
    const target = String(productId);
    return cartItems.some((item) => {
      const id1 = String(item.id || '');
      const id2 = String(item._id || '');
      const id3 = String(item.productId || '');
      const sku = String(item.sku || '');
      return id1 === target || id2 === target || id3 === target || sku === target;
    });
  };

  const getItemQuantity = (productId) => {
    if (!productId) return 0;
    const item = cartItems.find((i) => String(i.id || i._id) === String(productId));
    return item ? item.quantity || 0 : 0;
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const p = Number(item.price ?? item.salePrice ?? 0);
      return total + p * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  const originalTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const op = Number(item.originalPrice ?? item.mrp ?? item.price ?? item.salePrice ?? 0);
      return total + op * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    cartCount,
    cartTotal,
    originalTotal,
    fetchCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
