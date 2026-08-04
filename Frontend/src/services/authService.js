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
