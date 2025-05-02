import axios from 'axios';
import { apiConfig } from '@/shared/api/constants';

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: apiConfig.baseURL,
  paramsSerializer: { indexes: null },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Please login again.');
    }
    return Promise.reject(error);
  },
);
