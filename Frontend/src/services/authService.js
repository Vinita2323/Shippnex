import API from './api';

export const authService = {
  // User Auth
  sendUserOtp: async (phone) => {
    const response = await API.post('/auth/user/send-otp', { phone });
    return response.data;
  },

  verifyUserOtp: async (phone, otp) => {
    const response = await API.post('/auth/user/verify-otp', { phone, otp });
    if (response.data.token) {
      localStorage.setItem('shippnex_user_token', response.data.token);
      localStorage.setItem('shippnex_user_data', JSON.stringify(response.data.user));
      const uName = response.data.user?.name || response.data.user?.phone || 'User';
      localStorage.setItem('shippnex_user_name', uName);
      if (response.data.user?.email) {
        localStorage.setItem('shippnex_user_email', response.data.user.email);
      }
      if (response.data.user?.phone) {
        localStorage.setItem('shippnex_user_phone', response.data.user.phone);
      }
      if (response.data.user?.addresses && Array.isArray(response.data.user.addresses)) {
        localStorage.setItem('shippnex_saved_addresses', JSON.stringify(response.data.user.addresses));
      }
    }
    return response.data;
  },

  // Seller Auth
  sendSellerOtp: async (phone) => {
    const response = await API.post('/auth/seller/send-otp', { phone });
    return response.data;
  },

  verifySellerOtp: async (phone, otp) => {
    try {
      const response = await API.post('/auth/seller/verify-otp', { phone, otp });
      if (response.data.token) {
        localStorage.setItem('shippnex_seller_token', response.data.token);
        localStorage.setItem('shippnex_seller_data', JSON.stringify(response.data.seller));
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  getSellerProfile: async () => {
    const response = await API.get('/auth/seller/profile');
    if (response.data.seller) {
      localStorage.setItem('shippnex_seller_data', JSON.stringify(response.data.seller));
    }
    return response.data;
  },

  updateSellerProfile: async (profileData) => {
    const response = await API.put('/auth/seller/profile', profileData);
    if (response.data.seller) {
      localStorage.setItem('shippnex_seller_data', JSON.stringify(response.data.seller));
    }
    return response.data;
  },


  // Captain Auth
  sendCaptainOtp: async (phone) => {
    const response = await API.post('/auth/captain/send-otp', { phone });
    return response.data;
  },

  verifyCaptainOtp: async (phone, otp) => {
    const response = await API.post('/auth/captain/verify-otp', { phone, otp });
    if (response.data.token) {
      localStorage.setItem('shippnex_captain_token', response.data.token);
      localStorage.setItem('shippnex_captain_data', JSON.stringify(response.data.captain));
    }
    return response.data;
  },

  // Admin Auth
  adminLogin: async (email, password) => {
    const response = await API.post('/auth/admin/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('shippnex_admin_token', response.data.token);
      localStorage.setItem('shippnex_admin_data', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  // Logout utility
  logout: (role) => {
    if (role === 'user') {
      localStorage.removeItem('shippnex_user_token');
      localStorage.removeItem('shippnex_user_data');
      localStorage.removeItem('shippnex_user_name');
      localStorage.removeItem('shippnex_user_email');
      localStorage.removeItem('shippnex_user_phone');
      localStorage.removeItem('shippnex_user_dob');
      localStorage.removeItem('shippnex_saved_addresses');
      localStorage.removeItem('shippnex_selected_checkout_address');
      localStorage.removeItem('shippnex_pending_action');
      sessionStorage.removeItem('shippnex_auth_expired_redirect');
    } else if (role === 'seller') {
      localStorage.removeItem('shippnex_seller_token');
      localStorage.removeItem('shippnex_seller_data');
    } else if (role === 'captain') {
      localStorage.removeItem('shippnex_captain_token');
      localStorage.removeItem('shippnex_captain_data');
    } else if (role === 'admin') {
      localStorage.removeItem('shippnex_admin_token');
      localStorage.removeItem('shippnex_admin_data');
    }
  },
};

export const bannerService = {
  getBanners: async () => {
    const response = await API.get('/banners');
    return response.data;
  },
  createBanner: async (data) => {
    const response = await API.post('/banners', data);
    return response.data;
  },
  updateBanner: async (id, data) => {
    const response = await API.put(`/banners/${id}`, data);
    return response.data;
  },
  deleteBanner: async (id) => {
    const response = await API.delete(`/banners/${id}`);
    return response.data;
  },
  uploadImage: async (formData, folder = 'banners') => {
    const response = await API.post(`/upload?folder=${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const categoryService = {
  getCategories: async () => {
    const response = await API.get('/categories');
    return response.data;
  },
  getAllCategories: async () => {
    const response = await API.get('/categories');
    return response.data;
  },
  createCategory: async (data) => {
    const response = await API.post('/categories', data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await API.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await API.delete(`/categories/${id}`);
    return response.data;
  },
};

export const productService = {
  getProducts: async (params = {}) => {
    const response = await API.get('/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (data) => {
    const response = await API.post('/products', data);
    return response.data;
  },
  updateProduct: async (id, data) => {
    const response = await API.put(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await API.get('/cart');
    return response.data;
  },
  addToCart: async (productId, quantity = 1, productData = null) => {
    const response = await API.post('/cart/add', { productId, quantity, product: productData });
    return response.data;
  },
  syncCart: async (items = []) => {
    const response = await API.post('/cart/sync', { items });
    return response.data;
  },
  updateCartItem: async (productId, delta, quantity, productData = null) => {
    const response = await API.put('/cart/update', { productId, delta, quantity, product: productData });
    return response.data;
  },
  removeFromCart: async (productId) => {
    const response = await API.delete(`/cart/remove/${productId}`);
    return response.data;
  },
  clearCart: async () => {
    const response = await API.delete('/cart/clear');
    return response.data;
  },
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await API.get('/wishlist');
    return response.data;
  },
  toggleWishlist: async (productId) => {
    const response = await API.post('/wishlist/toggle', { productId });
    return response.data;
  },
  syncWishlist: async (productIds) => {
    const response = await API.post('/wishlist/sync', { productIds });
    return response.data;
  },
};

export const addressService = {
  getAddresses: async () => {
    const response = await API.get('/user/addresses');
    return response.data;
  },
  addAddress: async (addressData) => {
    const response = await API.post('/user/addresses', addressData);
    return response.data;
  },
  updateAddress: async (addressId, addressData) => {
    const response = await API.put(`/user/addresses/${addressId}`, addressData);
    return response.data;
  },
  deleteAddress: async (addressId) => {
    const response = await API.delete(`/user/addresses/${addressId}`);
    return response.data;
  },
  setDefaultAddress: async (addressId) => {
    const response = await API.put(`/user/addresses/${addressId}/default`);
    return response.data;
  },
};

export const orderService = {
  placeOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },
  getOrders: async () => {
    const response = await API.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },
  getSellerNotifications: async () => {
    const response = await API.get('/orders/seller/notifications');
    return response.data;
  },
  markNotificationViewed: async (id) => {
    const response = await API.put(`/orders/seller/notifications/${id}/view`);
    return response.data;
  },
  acceptSellerOrder: async (id) => {
    const response = await API.put(`/orders/seller/notifications/${id}/accept`);
    return response.data;
  },
  rejectSellerOrder: async (id, payload) => {
    const response = await API.put(`/orders/seller/notifications/${id}/reject`, payload);
    return response.data;
  },
  updateSellerOrderStatus: async (id, status, payload = {}) => {
    const response = await API.put(`/orders/seller/notifications/${id}/status`, { status, ...payload });
    return response.data;
  },
};

export const walletService = {
  getSellerWallet: async () => {
    const response = await API.get('/wallet/seller');
    return response.data;
  },
  requestWithdrawal: async (payload) => {
    const response = await API.post('/wallet/seller/withdraw', payload);
    return response.data;
  },
  getAdminSettlements: async () => {
    const response = await API.get('/wallet/admin/settlements');
    return response.data;
  },
  getAdminWithdrawals: async () => {
    const response = await API.get('/wallet/admin/withdrawals');
    return response.data;
  },
  updateWithdrawalStatus: async (id, status, adminRemark = '') => {
    const response = await API.put(`/wallet/admin/withdrawals/${id}/status`, { status, adminRemark });
    return response.data;
  },
  updateSellerCommission: async (sellerId, commissionPercentage) => {
    const response = await API.put(`/admin/sellers/${sellerId}/commission`, { commissionPercentage });
    return response.data;
  },
};


