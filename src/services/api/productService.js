import { api } from './api';

export const productService = {
  async listBySeller(sellerId) {
    const { data } = await api.get(`/sellers/${sellerId}/products`);
    return data;
  },

  async getById(productId) {
    const { data } = await api.get(`/products/${productId}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/products', payload);
    return data;
  },

  async update(productId, payload) {
    const { data } = await api.put(`/products/${productId}`, payload);
    return data;
  },

  async remove(productId) {
    await api.delete(`/products/${productId}`);
  },
};
