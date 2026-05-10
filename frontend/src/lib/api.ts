import axios from 'axios';
import { API_URL } from './constants';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // enviar cookies automáticamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para redirigir a login si 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si no estamos ya en login, redirigir
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;