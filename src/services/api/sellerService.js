import { api } from './api';

export const sellerService = {
  async list(params) {
    const { data } = await api.get('/sellers', { params });
    return data;
  },

  async getById(sellerId) {
    const { data } = await api.get(`/sellers/${sellerId}`);
    return data;
  },

  async updateProfile(sellerId, payload) {
    const { data } = await api.put(`/sellers/${sellerId}`, payload);
    return data;
  },
};
