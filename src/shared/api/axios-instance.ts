import axios from 'axios';

export const axiosInstance = axios.create({
  withCredentials: true,
  paramsSerializer: { indexes: null },
  baseURL: import.meta.env.VITE_API_URL,
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
