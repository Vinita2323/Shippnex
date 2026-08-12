import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    let token;
    const currentPath = window.location.pathname;
    const requestUrl = config.url || '';

    if (currentPath.startsWith('/seller') || requestUrl.includes('/seller')) {
      token =
        localStorage.getItem('shippnex_seller_token') ||
        localStorage.getItem('shippnex_user_token');
    } else if (currentPath.startsWith('/admin') || requestUrl.includes('/admin')) {
      token =
        localStorage.getItem('shippnex_admin_token') ||
        localStorage.getItem('shippnex_user_token');
    } else if (
      currentPath.startsWith('/captain') ||
      currentPath.startsWith('/delivery') ||
      requestUrl.includes('/captain')
    ) {
      token =
        localStorage.getItem('shippnex_captain_token') ||
        localStorage.getItem('shippnex_user_token');
    } else {
      token =
        localStorage.getItem('shippnex_user_token') ||
        localStorage.getItem('shippnex_seller_token') ||
        localStorage.getItem('shippnex_captain_token') ||
        localStorage.getItem('shippnex_admin_token');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear user auth data
      localStorage.removeItem('shippnex_user_token');
      localStorage.removeItem('shippnex_user_data');

      // If we are on a protected user page, redirect to login
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/verify-otp')) {
        sessionStorage.setItem('shippnex_auth_expired_redirect', window.location.pathname);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
