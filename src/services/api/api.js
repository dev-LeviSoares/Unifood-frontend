import axios from 'axios';
import { getToken, clearSession } from '../storage/storage';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000, // evita requisição pendurada indefinidamente em rede ruim/backend travado
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      // AuthProvider escuta este evento pra deslogar o estado em memória e
      // redirecionar pro login — sem isso, a UI continuava "logada" até a
      // próxima ação do usuário falhar de novo.
      window.dispatchEvent(new Event('unifood:session-expired'));
    }
    return Promise.reject(error);
  }
);
