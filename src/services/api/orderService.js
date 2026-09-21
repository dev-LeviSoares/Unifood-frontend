import { api } from './api';

export const orderService = {
  async create(payload) {
    const { data } = await api.post('/orders', payload);
    return data;
  },

  async getById(orderId) {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },

  async listByStudent(studentId) {
    const { data } = await api.get(`/students/${studentId}/orders`);
    return data;
  },

  async listBySeller(sellerId, params) {
    const { data } = await api.get(`/sellers/${sellerId}/orders`, { params });
    return data;
  },

  async updateStatus(orderId, status) {
    const { data } = await api.patch(`/orders/${orderId}/status`, { status });
    return data;
  },
};
