import axios from 'axios';
import { getToken, getRefreshToken, setToken } from '../utils/Auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
console.log('api',api);
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          refreshToken
        );

        const newToken = response.data.data.token;

        setToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;