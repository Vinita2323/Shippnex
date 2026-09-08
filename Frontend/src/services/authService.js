import API from './api';
import { registerFCMToken, removeFCMToken } from './pushNotificationService';

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
      // Register FCM Push Token on login (SOP Step 7)
      registerFCMToken(true, 'user').catch(() => {});
    }
    return response.data;
  },

  // Seller Auth
  registerSeller: async (formData) => {
    const response = await API.post('/auth/seller/register', formData);
    return response.data;
  },

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
        // Register FCM Push Token on login (SOP Step 7)
        registerFCMToken(true, 'seller').catch(() => {});
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  sellerLogin: async (phone, password) => {
    const response = await API.post('/auth/seller/login', { phone, password });
    if (response.data.token) {
      localStorage.setItem('shippnex_seller_token', response.data.token);
      localStorage.setItem('shippnex_seller_data', JSON.stringify(response.data.seller));
      registerFCMToken(true, 'seller').catch(() => {});
    }
    return response.data;
  },

  sellerResetPassword: async (phone, otp, newPassword) => {
    const response = await API.post('/auth/seller/reset-password', { phone, otp, newPassword });
    if (response.data.token) {
      localStorage.setItem('shippnex_seller_token', response.data.token);
      localStorage.setItem('shippnex_seller_data', JSON.stringify(response.data.seller));
      registerFCMToken(true, 'seller').catch(() => {});
    }
    return response.data;
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
    try {
      const response = await API.post('/auth/captain/verify-otp', { phone, otp });
      if (response.data.token) {
        localStorage.setItem('shippnex_captain_token', response.data.token);
        localStorage.setItem('shippnex_captain_data', JSON.stringify(response.data.captain));
        // Register FCM Push Token on login (SOP Step 7)
        registerFCMToken(true, 'captain').catch(() => {});
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  captainLogin: async (phone, password) => {
    const response = await API.post('/auth/captain/login', { phone, password });
    if (response.data.token) {
      localStorage.setItem('shippnex_captain_token', response.data.token);
      localStorage.setItem('shippnex_captain_data', JSON.stringify(response.data.captain));
      registerFCMToken(true, 'captain').catch(() => {});
    }
    return response.data;
  },

  captainResetPassword: async (phone, otp, newPassword) => {
    const response = await API.post('/auth/captain/reset-password', { phone, otp, newPassword });
    if (response.data.token) {
      localStorage.setItem('shippnex_captain_token', response.data.token);
      localStorage.setItem('shippnex_captain_data', JSON.stringify(response.data.captain));
      registerFCMToken(true, 'captain').catch(() => {});
    }
    return response.data;
  },

  // Admin Auth
  adminLogin: async (email, password) => {
    const response = await API.post('/auth/admin/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('shippnex_admin_token', response.data.token);
      localStorage.setItem('shippnex_admin_data', JSON.stringify(response.data.admin));
      registerFCMToken(true, 'admin').catch(() => {});
    }
    return response.data;
  },

  // Logout utility
  logout: (role) => {
    removeFCMToken(role).catch(() => {});

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

// Client-side in-memory cache and request deduplication for frequently fetched static data
const clientMemCache = {
  banners: { data: null, timestamp: 0, promise: null },
  categories: { data: null, timestamp: 0, promise: null },
  sellerPlans: { data: null, timestamp: 0, promise: null },
  captainPlans: { data: null, timestamp: 0, promise: null },
};

export const clearClientCache = (key) => {
  if (key && clientMemCache[key]) {
    clientMemCache[key] = { data: null, timestamp: 0, promise: null };
  } else if (!key) {
    Object.keys(clientMemCache).forEach((k) => {
      clientMemCache[k] = { data: null, timestamp: 0, promise: null };
    });
  }
};

export const bannerService = {
  getBanners: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && clientMemCache.banners.data && (now - clientMemCache.banners.timestamp < 60000)) {
      return clientMemCache.banners.data;
    }
    if (clientMemCache.banners.promise) {
      return clientMemCache.banners.promise;
    }

    clientMemCache.banners.promise = API.get('/banners')
      .then((response) => {
        clientMemCache.banners.data = response.data;
        clientMemCache.banners.timestamp = Date.now();
        clientMemCache.banners.promise = null;
        return response.data;
      })
      .catch((err) => {
        clientMemCache.banners.promise = null;
        throw err;
      });

    return clientMemCache.banners.promise;
  },
  createBanner: async (data) => {
    clearClientCache('banners');
    const response = await API.post('/banners', data);
    return response.data;
  },
  updateBanner: async (id, data) => {
    clearClientCache('banners');
    const response = await API.put(`/banners/${id}`, data);
    return response.data;
  },
  deleteBanner: async (id) => {
    clearClientCache('banners');
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
  getCategories: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && clientMemCache.categories.data && (now - clientMemCache.categories.timestamp < 60000)) {
      return clientMemCache.categories.data;
    }
    if (clientMemCache.categories.promise) {
      return clientMemCache.categories.promise;
    }

    clientMemCache.categories.promise = API.get('/categories')
      .then((response) => {
        clientMemCache.categories.data = response.data;
        clientMemCache.categories.timestamp = Date.now();
        clientMemCache.categories.promise = null;
        return response.data;
      })
      .catch((err) => {
        clientMemCache.categories.promise = null;
        throw err;
      });

    return clientMemCache.categories.promise;
  },
  getAllCategories: async (forceRefresh = false) => {
    return categoryService.getCategories(forceRefresh);
  },
  createCategory: async (data) => {
    clearClientCache('categories');
    const response = await API.post('/categories', data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    clearClientCache('categories');
    const response = await API.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    clearClientCache('categories');
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

// Fast Client-Side Cache for User Orders
let userOrdersClientCache = { data: null, timestamp: 0 };

export const clearUserOrdersCache = () => {
  userOrdersClientCache = { data: null, timestamp: 0 };
  try {
    sessionStorage.removeItem('shippnex_user_orders_cache');
  } catch (e) {}
};

export const getCachedUserOrders = () => {
  if (userOrdersClientCache.data) return userOrdersClientCache.data;
  try {
    const raw = sessionStorage.getItem('shippnex_user_orders_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.orders)) {
        userOrdersClientCache = { data: parsed, timestamp: Date.now() };
        return parsed;
      }
    }
  } catch (e) {}
  return null;
};

export const orderService = {
  placeOrder: async (orderData) => {
    clearUserOrdersCache();
    const response = await API.post('/orders', orderData);
    return response.data;
  },
  getOrders: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && userOrdersClientCache.data && (now - userOrdersClientCache.timestamp < 30000)) {
      return userOrdersClientCache.data;
    }
    const response = await API.get('/orders');
    if (response.data && response.data.success) {
      userOrdersClientCache = { data: response.data, timestamp: now };
      try {
        sessionStorage.setItem('shippnex_user_orders_cache', JSON.stringify(response.data));
      } catch (e) {}
    }
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

// Fast Client-Side In-Memory Cache for Instant UI Rendering
const adminClientCache = {
  sellers: { data: null, timestamp: 0 },
  captains: { data: null, timestamp: 0 },
  users: { data: null, timestamp: 0 },
};

export const clearAdminClientCache = (key) => {
  if (key && adminClientCache[key]) {
    adminClientCache[key] = { data: null, timestamp: 0 };
  } else {
    Object.keys(adminClientCache).forEach(k => {
      adminClientCache[k] = { data: null, timestamp: 0 };
    });
  }
};

// Fast Client-Side Cache for Captain Dashboard
let captainDashboardClientCache = {
  data: (() => {
    try {
      const saved = sessionStorage.getItem('shippnex_captain_dashboard_cache');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })(),
  timestamp: 0,
};

export const clearCaptainDashboardClientCache = () => {
  captainDashboardClientCache = { data: null, timestamp: 0 };
  try {
    sessionStorage.removeItem('shippnex_captain_dashboard_cache');
  } catch (e) {}
};

export const getCachedCaptainDashboard = () => {
  if (captainDashboardClientCache.data) return captainDashboardClientCache.data;
  try {
    const saved = sessionStorage.getItem('shippnex_captain_dashboard_cache');
    if (saved) {
      const parsed = JSON.parse(saved);
      captainDashboardClientCache = { data: parsed, timestamp: Date.now() };
      return parsed;
    }
  } catch (e) {}
  return null;
};

export const captainService = {
  // Auth (existing)
  getAllCaptains: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && adminClientCache.captains.data && (now - adminClientCache.captains.timestamp < 30000)) {
      return adminClientCache.captains.data;
    }
    const response = await API.get('/admin/captains');
    if (response.data && response.data.success) {
      adminClientCache.captains = { data: response.data, timestamp: now };
    }
    return response.data;
  },
  toggleCaptainStatus: async (id, status) => {
    clearAdminClientCache('captains');
    clearCaptainDashboardClientCache();
    const response = await API.put(`/admin/captains/${id}/status`, { status });
    return response.data;
  },
  updateCaptainStatus: async (id, status) => {
    clearAdminClientCache('captains');
    clearCaptainDashboardClientCache();
    const response = await API.put(`/admin/captains/${id}/status`, { status });
    return response.data;
  },
  deleteCaptain: async (id) => {
    clearAdminClientCache('captains');
    clearCaptainDashboardClientCache();
    const response = await API.delete(`/admin/captains/${id}`);
    return response.data;
  },
  getAvailableCaptains: async () => {
    const response = await API.get('/admin/captains/available');
    return response.data;
  },

  // Profile & Account
  getProfile: async () => {
    const response = await API.get('/captain/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    clearCaptainDashboardClientCache();
    const response = await API.put('/captain/profile', data);
    return response.data;
  },
  deleteAccount: async (reason = '', feedback = '') => {
    clearCaptainDashboardClientCache();
    const response = await API.delete('/captain/account', { data: { reason, feedback } });
    return response.data;
  },

  // Status & Location
  updateOnlineStatus: async (isOnline) => {
    clearCaptainDashboardClientCache();
    const response = await API.put('/captain/status', { isOnline });
    return response.data;
  },
  updateLocation: async (lat, lng) => {
    const response = await API.put('/captain/location', { lat, lng });
    return response.data;
  },

  // Dashboard
  getDashboardStats: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && captainDashboardClientCache.data && (now - captainDashboardClientCache.timestamp < 15000)) {
      return captainDashboardClientCache.data;
    }
    const response = await API.get('/captain/dashboard');
    if (response.data && response.data.success) {
      captainDashboardClientCache = { data: response.data, timestamp: now };
      try {
        sessionStorage.setItem('shippnex_captain_dashboard_cache', JSON.stringify(response.data));
      } catch (e) {}
    }
    return response.data;
  },

  // Jobs
  getJobs: async (tab = 'deliveries') => {
    const response = await API.get(`/captain/jobs?tab=${tab}`);
    return response.data;
  },
  acceptJob: async (orderId) => {
    clearCaptainDashboardClientCache();
    const response = await API.put(`/captain/jobs/${orderId}/accept`);
    return response.data;
  },
  rejectJob: async (orderId) => {
    clearCaptainDashboardClientCache();
    const response = await API.put(`/captain/jobs/${orderId}/reject`);
    return response.data;
  },
  updateDeliveryStatus: async (orderId, status, payload = {}) => {
    clearCaptainDashboardClientCache();
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

export const membershipService = {
  // ── Seller (user-facing) ──────────────────────────────────
  getSellerPlans: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && clientMemCache.sellerPlans.data && (now - clientMemCache.sellerPlans.timestamp < 60000)) {
      return clientMemCache.sellerPlans.data;
    }
    if (clientMemCache.sellerPlans.promise) {
      return clientMemCache.sellerPlans.promise;
    }

    clientMemCache.sellerPlans.promise = API.get('/membership/seller/plans')
      .then((response) => {
        clientMemCache.sellerPlans.data = response.data;
        clientMemCache.sellerPlans.timestamp = Date.now();
        clientMemCache.sellerPlans.promise = null;
        return response.data;
      })
      .catch((err) => {
        clientMemCache.sellerPlans.promise = null;
        throw err;
      });

    return clientMemCache.sellerPlans.promise;
  },
  createRazorpayOrder: async (planId, userType = 'seller') => {
    const response = await API.post('/membership/razorpay/create-order', { planId, userType });
    return response.data;
  },
  getSellerMembership: async () => {
    const response = await API.get('/membership/seller/current');
    return response.data;
  },
  getSellerMembershipHistory: async () => {
    const response = await API.get('/membership/seller/history');
    return response.data;
  },
  purchaseSellerMembership: async (payload) => {
    const response = await API.post('/membership/seller/purchase', payload);
    return response.data;
  },
  renewSellerMembership: async (payload) => {
    const response = await API.post('/membership/seller/renew', payload);
    return response.data;
  },

  // ── Captain (user-facing) ─────────────────────────────────
  getCaptainPlans: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && clientMemCache.captainPlans.data && (now - clientMemCache.captainPlans.timestamp < 60000)) {
      return clientMemCache.captainPlans.data;
    }
    if (clientMemCache.captainPlans.promise) {
      return clientMemCache.captainPlans.promise;
    }

    clientMemCache.captainPlans.promise = API.get('/membership/captain/plans')
      .then((response) => {
        clientMemCache.captainPlans.data = response.data;
        clientMemCache.captainPlans.timestamp = Date.now();
        clientMemCache.captainPlans.promise = null;
        return response.data;
      })
      .catch((err) => {
        clientMemCache.captainPlans.promise = null;
        throw err;
      });

    return clientMemCache.captainPlans.promise;
  },
  getCaptainMembership: async () => {
    const response = await API.get('/membership/captain/current');
    return response.data;
  },
  getCaptainMembershipHistory: async () => {
    const response = await API.get('/membership/captain/history');
    return response.data;
  },
  purchaseCaptainMembership: async (payload) => {
    const response = await API.post('/membership/captain/purchase', payload);
    return response.data;
  },
  renewCaptainMembership: async (payload) => {
    const response = await API.post('/membership/captain/renew', payload);
    return response.data;
  },

  // ── Admin: Seller Plans ───────────────────────────────────
  adminGetSellerPlans: async () => {
    const response = await API.get('/membership/admin/seller/plans');
    return response.data;
  },
  adminCreateSellerPlan: async (data) => {
    clearClientCache('sellerPlans');
    const response = await API.post('/membership/admin/seller/plans', data);
    return response.data;
  },
  adminUpdateSellerPlan: async (id, data) => {
    clearClientCache('sellerPlans');
    const response = await API.put(`/membership/admin/seller/plans/${id}`, data);
    return response.data;
  },
  adminToggleSellerPlan: async (id) => {
    clearClientCache('sellerPlans');
    const response = await API.put(`/membership/admin/seller/plans/${id}/toggle`);
    return response.data;
  },
  adminDeleteSellerPlan: async (id) => {
    clearClientCache('sellerPlans');
    const response = await API.delete(`/membership/admin/seller/plans/${id}`);
    return response.data;
  },

  // ── Admin: Captain Plans ──────────────────────────────────
  adminGetCaptainPlans: async () => {
    const response = await API.get('/membership/admin/captain/plans');
    return response.data;
  },
  adminCreateCaptainPlan: async (data) => {
    clearClientCache('captainPlans');
    const response = await API.post('/membership/admin/captain/plans', data);
    return response.data;
  },
  adminUpdateCaptainPlan: async (id, data) => {
    clearClientCache('captainPlans');
    const response = await API.put(`/membership/admin/captain/plans/${id}`, data);
    return response.data;
  },
  adminToggleCaptainPlan: async (id) => {
    clearClientCache('captainPlans');
    const response = await API.put(`/membership/admin/captain/plans/${id}/toggle`);
    return response.data;
  },
  adminDeleteCaptainPlan: async (id) => {
    clearClientCache('captainPlans');
    const response = await API.delete(`/membership/admin/captain/plans/${id}`);
    return response.data;
  },

  // ── Admin: Subscriptions ──────────────────────────────────
  adminGetSellerSubscriptions: async (params = {}) => {
    const response = await API.get('/membership/admin/seller/subscriptions', { params });
    return response.data;
  },
  adminGetCaptainSubscriptions: async (params = {}) => {
    const response = await API.get('/membership/admin/captain/subscriptions', { params });
    return response.data;
  },
  adminConfirmSellerPayment: async (id, adminNote = '') => {
    const response = await API.put(`/membership/admin/seller/subscriptions/${id}/confirm-payment`, { adminNote });
    return response.data;
  },
  adminConfirmCaptainPayment: async (id, adminNote = '') => {
    const response = await API.put(`/membership/admin/captain/subscriptions/${id}/confirm-payment`, { adminNote });
    return response.data;
  },

  // ── Admin: Stats ──────────────────────────────────────────
  adminGetSellerStats: async () => {
    const response = await API.get('/membership/admin/seller/stats');
    return response.data;
  },
  adminGetCaptainStats: async () => {
    const response = await API.get('/membership/admin/captain/stats');
    return response.data;
  },
  adminCheckExpiry: async () => {
    const response = await API.post('/membership/admin/check-expiry');
    return response.data;
  },
};

export const policyService = {
  getPolicies: async (params = {}) => {
    const response = await API.get('/policies', { params });
    return response.data;
  },
  getPolicy: async (target, type) => {
    const response = await API.get(`/policies/${target}/${type}`);
    return response.data;
  },
  savePolicy: async (data) => {
    const response = await API.post('/policies', data);
    return response.data;
  },
  deletePolicy: async (id) => {
    const response = await API.delete(`/policies/${id}`);
    return response.data;
  },
};

export const fcmService = {
  saveToken: async (token, platform = 'web') => {
    const response = await API.post('/fcm-tokens/save', { token, platform });
    return response.data;
  },
  saveMobileToken: async (token) => {
    const response = await API.post('/fcm-tokens/mobile/save', { token });
    return response.data;
  },
  removeToken: async (token, platform = 'web') => {
    const response = await API.delete('/fcm-tokens/remove', { data: { token, platform } });
    return response.data;
  },
  sendTestPush: async () => {
    const response = await API.post('/fcm-tokens/test');
    return response.data;
  },
};

export const sellerService = {
  getPublicSellers: async (params = {}) => {
    try {
      const response = await API.get('/sellers', { params });
      return response.data;
    } catch (err) {
      console.warn('Failed to fetch public sellers from API, returning local fallbacks:', err.message);
      return { success: false, sellers: [] };
    }
  },
  getSellerStore: async (id) => {
    try {
      const response = await API.get(`/sellers/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Failed to fetch seller store from API:', err.message);
      return { success: false, seller: null, products: [] };
    }
  }
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await API.get('/admin/dashboard/stats');
    return response.data;
  },
  getOrders: async () => {
    const response = await API.get('/admin/orders');
    return response.data;
  },
  getUsers: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && adminClientCache.users.data && (now - adminClientCache.users.timestamp < 30000)) {
      return adminClientCache.users.data;
    }
    const response = await API.get('/admin/users');
    if (response.data && response.data.success) {
      adminClientCache.users = { data: response.data, timestamp: now };
    }
    return response.data;
  },
  getSellers: async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && adminClientCache.sellers.data && (now - adminClientCache.sellers.timestamp < 30000)) {
      return adminClientCache.sellers.data;
    }
    const response = await API.get('/admin/sellers');
    if (response.data && response.data.success) {
      adminClientCache.sellers = { data: response.data, timestamp: now };
    }
    return response.data;
  },
  toggleSellerStatus: async (id, status) => {
    clearAdminClientCache('sellers');
    const response = await API.put(`/admin/sellers/${id}/status`, { status });
    return response.data;
  },
  updateSellerCommission: async (id, commissionPercentage) => {
    clearAdminClientCache('sellers');
    const response = await API.put(`/admin/sellers/${id}/commission`, { commissionPercentage });
    return response.data;
  },
  getCaptains: async (forceRefresh = false) => {
    return captainService.getAllCaptains(forceRefresh);
  },
  toggleCaptainStatus: async (id, status) => {
    return captainService.toggleCaptainStatus(id, status);
  },
  deleteCaptain: async (id) => {
    return captainService.deleteCaptain(id);
  },
  assignCaptainToOrder: async (orderId, captainId, captainEarnings = 0) => {
    const response = await API.put(`/admin/orders/${orderId}/assign-captain`, { captainId, captainEarnings });
    return response.data;
  },
};

export const profileEditRequestService = {
  submitEditRequest: async (payload) => {
    const response = await API.post('/profile-edit-requests/submit', payload);
    return response.data;
  },
  getMyPendingEditRequest: async () => {
    const response = await API.get('/profile-edit-requests/my-pending');
    return response.data;
  },
  getAdminEditRequests: async (params = {}) => {
    const response = await API.get('/profile-edit-requests/admin', { params });
    return response.data;
  },
  getAdminEditRequestById: async (id) => {
    const response = await API.get(`/profile-edit-requests/admin/${id}`);
    return response.data;
  },
  approveEditRequest: async (id) => {
    const response = await API.put(`/profile-edit-requests/admin/${id}/approve`);
    return response.data;
  },
  rejectEditRequest: async (id, adminNote = '') => {
    const response = await API.put(`/profile-edit-requests/admin/${id}/reject`, { adminNote });
    return response.data;
  },
};




