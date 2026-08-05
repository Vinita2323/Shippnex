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
    // Check for user, seller, captain, or admin token
    const token =
      localStorage.getItem('shippnex_user_token') ||
      localStorage.getItem('shippnex_seller_token') ||
      localStorage.getItem('shippnex_captain_token') ||
      localStorage.getItem('shippnex_admin_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
