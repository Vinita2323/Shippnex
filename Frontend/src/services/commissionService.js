import API from './api';

export const commissionService = {
  // Get active commission settings (Admin)
  getAdminCommissionSettings: async () => {
    const response = await API.get('/admin/commission-settings');
    return response.data;
  },

  // Update commission settings (Admin)
  updateAdminCommissionSettings: async (payload) => {
    const response = await API.put('/admin/commission-settings', payload);
    return response.data;
  },

  // Get current rates (Public / Seller / Captain)
  getCurrentRates: async () => {
    const response = await API.get('/commission-settings/current');
    return response.data;
  },

  // Get commission transaction reports with multi-filters (Admin)
  getAdminCommissionReports: async (params = {}) => {
    const response = await API.get('/admin/commission-reports', { params });
    return response.data;
  },
};

export default commissionService;
