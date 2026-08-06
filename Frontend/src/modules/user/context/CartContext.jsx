import React, { createContext, useContext, useState, useMemo } from 'react';

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

  const addToCart = (product) => {
    if (!product) return;
    const itemId = product.id || product._id;
    const price = Number(product.price ?? product.salePrice ?? 0);
    const originalPrice = Number(product.originalPrice ?? product.mrp ?? price);
    const image = product.image || product.mainImage;

    const itemToAdd = {
      ...product,
      id: itemId,
      price: price,
      originalPrice: originalPrice,
      image: image,
    };

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => String(item.id || item._id) === String(itemId));
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 0) + 1,
          price: Number(updated[existingIndex].price ?? price),
          originalPrice: Number(updated[existingIndex].originalPrice ?? originalPrice),
        };
        return updated;
      }
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => String(item.id || item._id) !== String(productId)));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (String(item.id || item._id) === String(productId)) {
            return { ...item, quantity: (item.quantity || 0) + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (productId) => {
    if (!productId) return false;
    return cartItems.some((item) => String(item.id || item._id) === String(productId));
  };

  const getItemQuantity = (productId) => {
    if (!productId) return 0;
    const item = cartItems.find((i) => String(i.id || i._id) === String(productId));
    return item ? (item.quantity || 0) : 0;
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
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
