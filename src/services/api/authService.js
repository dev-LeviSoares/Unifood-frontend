import { api } from './api';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { user, token }
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
