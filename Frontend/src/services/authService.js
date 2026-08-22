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
  registerCaptain: async (formData) => {
    const response = await API.post('/auth/captain/register', formData);
    return response.data;
  },

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

export const captainService = {
  // Auth (existing)
  getAllCaptains: async () => {
    const response = await API.get('/admin/captains');
    return response.data;
  },
  toggleCaptainStatus: async (id, status) => {
    const response = await API.put(`/admin/captains/${id}/status`, { status });
    return response.data;
  },
  deleteCaptain: async (id) => {
    const response = await API.delete(`/admin/captains/${id}`);
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await API.get('/captain/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await API.put('/captain/profile', data);
    return response.data;
  },

  // Status & Location
  updateOnlineStatus: async (isOnline) => {
    const response = await API.put('/captain/status', { isOnline });
    return response.data;
  },
  updateLocation: async (lat, lng) => {
    const response = await API.put('/captain/location', { lat, lng });
    return response.data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await API.get('/captain/dashboard');
    return response.data;
  },

  // Jobs
  getJobs: async (tab = 'deliveries') => {
    const response = await API.get(`/captain/jobs?tab=${tab}`);
    return response.data;
  },
  acceptJob: async (orderId) => {
    const response = await API.put(`/captain/jobs/${orderId}/accept`);
    return response.data;
  },
  rejectJob: async (orderId) => {
    const response = await API.put(`/captain/jobs/${orderId}/reject`);
    return response.data;
  },
  updateDeliveryStatus: async (orderId, status, payload = {}) => {
    const response = await API.put(`/captain/jobs/${orderId}/status`, { status, ...payload });
    return response.data;
  },

  // Active Delivery
  getActiveDelivery: async () => {
    const response = await API.get('/captain/active-delivery');
    return response.data;
  },
  verifyDeliveryOtp: async (orderId, otp) => {
    const response = await API.post(`/captain/jobs/${orderId}/verify-otp`, { otp });
    return response.data;
  },
  submitProofOfDelivery: async (orderId, proofUrl) => {
    const response = await API.post(`/captain/jobs/${orderId}/proof`, { proofUrl });
    return response.data;
  },

  // Wallet
  getWallet: async () => {
    const response = await API.get('/captain/wallet');
    return response.data;
  },
  getTransactions: async (type = 'All') => {
    const response = await API.get(`/captain/wallet/transactions?type=${type}`);
    return response.data;
  },
  requestWithdrawal: async (amount) => {
    const response = await API.post('/captain/wallet/withdraw', { amount });
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await API.get('/captain/notifications');
    return response.data;
  },
  markNotificationRead: async (id) => {
    const response = await API.put(`/captain/notifications/${id}/read`);
    return response.data;
  },
  markAllNotificationsRead: async () => {
    const response = await API.put('/captain/notifications/read-all');
    return response.data;
  },

  // Service Areas
  getServiceAreas: async () => {
    const response = await API.get('/captain/service-areas');
    return response.data;
  },

  // Admin: Available Captains for assignment
  getAvailableCaptains: async () => {
    const response = await API.get('/admin/captains/available');
    return response.data;
  },
  assignCaptainToOrder: async (orderId, captainId, captainEarnings = 0) => {
    const response = await API.put(`/admin/orders/${orderId}/assign-captain`, { captainId, captainEarnings });
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    try {
      const response = await API.get('/auth/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await API.put('/auth/user/profile', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};


