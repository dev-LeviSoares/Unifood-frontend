import { api } from './api';

export const authService = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  async registerStudent(payload) {
    const { data } = await api.post('/auth/register/student', payload);
    return data;
  },

  /**
   * @param {FormData} formData - inclui os campos de texto + o arquivo de
   *   foto opcional (`photo`). O axios detecta FormData automaticamente e
   *   define o Content-Type multipart/form-data com o boundary correto.
   */
  async registerSeller(formData) {
    const { data } = await api.post('/auth/register/seller', formData);
    return data;
  },

  async requestPasswordRecovery(identifier) {
    const { data } = await api.post('/auth/recover-password', { identifier });
    return data;
  },
};
