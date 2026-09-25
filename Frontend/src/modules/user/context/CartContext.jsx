import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { cartService } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';

const CartContext = createContext();

// Rapid +/- taps are coalesced into a single network call after this pause,
// instead of firing one request per click (the previous cause of cart actions
// appearing to "hang" for many seconds while a backlog of requests drained).
const SYNC_DEBOUNCE_MS = 450;

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
  const { isAuthenticated: authContextIsAuthenticated, isAuthInitializing, userRole } = useAuth();

  const cartItemsRef = useRef(cartItems);
  useEffect(() => {
    cartItemsRef.current = cartItems;
  }, [cartItems]);

  // Tracks product ids with a scheduled/in-flight server sync so an
  // in-between fetchCart()/reconcile doesn't clobber the optimistic value.
  const pendingSyncIds = useRef(new Set());
  const syncTimers = useRef({});

  useEffect(() => {
    return () => {
      Object.values(syncTimers.current).forEach(clearTimeout);
    };
  }, []);

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
    const path = typeof window !== 'undefined' && window.location ? window.location.pathname : '';
    const isPortalRoute =
      path.startsWith('/admin') ||
      path.startsWith('/super-admin') ||
      path.startsWith('/seller') ||
      path.startsWith('/captain') ||
      path.startsWith('/delivery');

    const userToken = typeof window !== 'undefined' ? localStorage.getItem('shippnex_user_token') : null;

    // Only fetch cart if not in a back-office portal and user token is actually present
    if (isPortalRoute || isAuthInitializing || !userToken || (userRole && userRole !== 'user')) {
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
      if (err?.response?.status === 401) {
        localStorage.removeItem('shippnex_user_token');
        setCartItems([]);
      } else if (err?.response?.status !== 403) {
        console.error('Failed to fetch server cart:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [authContextIsAuthenticated, isAuthInitializing, userRole]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Merge authoritative server cart into local state without discarding
  // optimistic edits that are still mid-flight for other products.
  const reconcileServerCart = useCallback((serverItems) => {
    const formatted = formatCartItems(serverItems);
    setCartItems((prev) => {
      const merged = [...formatted];
      prev.forEach((localItem) => {
        const pid = String(localItem.productId || localItem.id);
        if (pendingSyncIds.current.has(pid)) {
          const idx = merged.findIndex((m) => String(m.productId) === pid);
          if (idx > -1) merged[idx] = localItem;
          else merged.push(localItem);
        }
      });
      return merged;
    });
    localStorage.setItem('shippnex_local_cart', JSON.stringify(formatted));
  }, []);

  const runSync = useCallback(async (productId) => {
    const key = String(productId);
    const item = cartItemsRef.current.find((i) => String(i.productId || i.id) === key);

    try {
      let res;
      if (!item || (item.quantity || 0) <= 0) {
        res = await cartService.removeFromCart(productId);
      } else {
        res = await cartService.updateCartItem(productId, undefined, item.quantity, item);
      }
      if (res && res.success && res.cart) {
        reconcileServerCart(res.cart.items || []);
      }
      return res;
    } catch (err) {
      console.error('Cart sync failed for product', productId, err);
      // Roll back to authoritative server state (e.g. stock ran out mid-edit)
      fetchCart();
      throw err;
    } finally {
      pendingSyncIds.current.delete(key);
    }
  }, [reconcileServerCart, fetchCart]);

  // immediate:true (buy-now / remove) lets the caller see real success/failure.
  // Debounced background syncs swallow the error here since runSync already
  // rolled the optimistic state back to the server's authoritative version.
  const scheduleSync = useCallback((productId, { immediate = false } = {}) => {
    const key = String(productId);
    pendingSyncIds.current.add(key);

    if (syncTimers.current[key]) {
      clearTimeout(syncTimers.current[key]);
      delete syncTimers.current[key];
    }

    if (immediate) {
      return runSync(key);
    }

    return new Promise((resolve) => {
      syncTimers.current[key] = setTimeout(() => {
        delete syncTimers.current[key];
        runSync(key).catch(() => {}).finally(resolve);
      }, SYNC_DEBOUNCE_MS);
    });
  }, [runSync]);

  const addToCart = async (product, quantity = 1, options = {}) => {
    if (!product) return { success: false };

    const productId = product.id || product._id;

    // Wait for auth initialization before checking authentication
    if (isAuthInitializing) {
      return { requiresAuth: true, message: 'Initializing authentication' };
    }

    // Reject unauthenticated requests and save pending action
    if (!authContextIsAuthenticated) {
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

    // Update local cart instantly so the UI reflects the change on click,
    // instead of waiting on the network round trip.
    const price = Number(product.salePrice ?? product.price ?? 0);
    const originalPrice = Number(product.mrp ?? product.originalPrice ?? price);

    setCartItems((prev) => {
      const idx = prev.findIndex((i) => String(i.productId || i.id) === String(productId));
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: (next[idx].quantity || 0) + Number(quantity) };
        return next;
      }
      return [
        ...prev,
        {
          ...product,
          id: productId,
          productId,
          name: product.name,
          image: product.image || product.mainImage,
          price,
          originalPrice,
          quantity: Number(quantity),
        },
      ];
    });

    if (options.isBuyNow) {
      // Buy-now heads straight to checkout, so confirm the write actually landed
      // (and surface the real error instead of assuming success).
      try {
        const res = await scheduleSync(productId, { immediate: true });
        if (res && res.success) return { success: true };
        return { success: false, message: res?.message || 'Failed to add item to cart' };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || 'Failed to add item to cart' };
      }
    }

    scheduleSync(productId);
    return { success: true };
  };

  const updateQuantity = async (productId, delta, exactQty) => {
    if (!authContextIsAuthenticated) return;

    setCartItems((prev) => {
      const idx = prev.findIndex((i) => String(i.productId || i.id) === String(productId));
      if (idx === -1) return prev;
      const current = prev[idx];
      const newQty = exactQty !== undefined ? Number(exactQty) : (current.quantity || 0) + Number(delta);
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== idx);
      }
      const next = [...prev];
      next[idx] = { ...current, quantity: newQty };
      return next;
    });

    scheduleSync(productId);
  };

  const removeFromCart = async (productId) => {
    if (!authContextIsAuthenticated) return;

    const key = String(productId);
    if (syncTimers.current[key]) {
      clearTimeout(syncTimers.current[key]);
      delete syncTimers.current[key];
    }

    setCartItems((prev) => prev.filter((i) => String(i.productId || i.id) !== key));
    try {
      await scheduleSync(productId, { immediate: true });
    } catch {
      // runSync already rolled the optimistic removal back via fetchCart().
    }
  };

  const clearCart = async () => {
    Object.values(syncTimers.current).forEach(clearTimeout);
    syncTimers.current = {};
    pendingSyncIds.current.clear();

    if (!authContextIsAuthenticated) {
      setCartItems([]);
      return;
    }
    setCartItems([]);
    try {
      await cartService.clearCart();
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
