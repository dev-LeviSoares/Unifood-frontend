import { api } from './api';

/**
 * Não existia um service para cardápios — MenuForm.jsx estava salvando
 * "no vazio" (só navegava de volta, sem chamar nada). Criado seguindo o
 * mesmo padrão de productService/orderService.
 */
export const menuService = {
  async listBySeller(sellerId) {
    const { data } = await api.get(`/sellers/${sellerId}/menus`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post('/menus', payload);
    return data;
  },

  async update(menuId, payload) {
    const { data } = await api.put(`/menus/${menuId}`, payload);
    return data;
  },

  async remove(menuId) {
    await api.delete(`/menus/${menuId}`);
  },
};
