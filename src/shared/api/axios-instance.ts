import axios from 'axios';
import { apiConfig } from '@/shared/api/constants';
import { cleanParams } from '@/shared/lib';
import { toast } from 'sonner';

export const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: apiConfig.baseURL,
  paramsSerializer: { indexes: null },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.params) {
      config.params = cleanParams(config.params);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const location: string = window.location.pathname;
    if (error?.response?.status === 401) {
      if (
        location === '/auth/login' ||
        location === '/auth/login/admin' ||
        location === '/auth/login/' ||
        location === '/auth/login/admin/'
      ) {
        console.log('Redirecting to login...');
      } else {
        window.location.replace('/auth/login');
      }
    }

    if (error?.response?.status <= 499 && error?.response?.status !== 401 && error?.response?.status !== 404) {
      toast.error(
        error.response?.data?.message || 'Serverda nomaʼlum xatolik yuz berdi. Xatolik haqida xabar bering!',
        { richColors: true },
      );
    } else if (error?.response?.status >= 500) {
      toast.error('Serverda nomaʼlum xatolik yuz berdi. Xatolik haqida xabar bering!', { richColors: true });
    } else if (error?.response?.status === 401 && error?.response?.config?.url === '/api/v1/users/me') {
      if (
        location === '/auth/login' ||
        location === '/auth/login/admin' ||
        location === '/auth/login/' ||
        location === '/auth/login/admin/'
      ) {
        console.log('Redirecting to login...');
      } else {
        toast.error('Kirish maʼlumotlari topilmadi yoki noto‘g‘ri. Iltimos, tizimga qayta kiring.', {
          richColors: true,
        });
      }
    } else if (error?.response?.status === 401 && error?.response?.config?.url === '/api/v1/auth/login') {
      toast.error('Login yoki parol noto‘g‘ri. Iltimos, ma’lumotlarni tekshirib, qayta urinib ko‘ring.', {
        richColors: true,
      });
    } else if (error?.response?.status === 404) {
      toast.error('So‘ralgan xizmat topilmadi. Iltimos, keyinroq qayta urinib ko‘ring', { richColors: true });
    }
    return Promise.reject(error);
  },
);

// Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error),
// );

// Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn('Unauthorized: Please login again.');
//     }
//     return Promise.reject(error);
//   },
// );
