import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToWishlist = (product) => {
    if (!product) return false;
    const itemId = product.id || product._id;
    const normalizedProduct = { ...product, id: itemId };
    let added = false;
    setWishlistItems((prevItems) => {
      if (!prevItems.some((item) => String(item.id || item._id) === String(itemId))) {
        added = true;
        return [...prevItems, normalizedProduct];
      }
      return prevItems;
    });
    return added;
  };

  const removeFromWishlist = (productId) => {
    if (!productId) return;
    setWishlistItems((prevItems) => prevItems.filter((item) => String(item.id || item._id) !== String(productId)));
  };
  
  const toggleWishlist = (product) => {
    if (!product) return false;
    const itemId = product.id || product._id;
    const normalizedProduct = { ...product, id: itemId };
    let isAdded = false;
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => String(item.id || item._id) === String(itemId));
      if (exists) {
        return prevItems.filter((item) => String(item.id || item._id) !== String(itemId));
      }
      isAdded = true;
      return [...prevItems, normalizedProduct];
    });
    return isAdded;
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some((item) => String(item.id || item._id) === String(productId));
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
