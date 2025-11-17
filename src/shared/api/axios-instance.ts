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
    const location = window.location.pathname;
    const qrPathRegex = /^\/qr\/[^/]+\/equipments\/?$/;

    const isQrPath = qrPathRegex.test(location);
    const isLoginPath = location.startsWith('/auth/login');

    const status = error?.response?.status;
    const requestUrl = error?.response?.config?.url;
    const errorMessage = error.response?.data?.message;

    if (status === 401 && requestUrl === '/api/v1/auth/login') {
      toast.error(
        errorMessage || 'Login yoki parol noto‘g‘ri. Iltimos, ma’lumotlarni tekshirib, qayta urinib ko‘ring.',
        {
          richColors: true,
        },
      );
    } else if (status === 401 && requestUrl === '/api/v1/users/me') {
      if (!isQrPath && !isLoginPath) {
        toast.error(errorMessage || 'Kirish maʼlumotlari topilmadi yoki noto‘g‘ri. Iltimos, tizimga qayta kiring.', {
          richColors: true,
        });
      }
    } else if (status >= 400 && status < 600) {
      toast.error(errorMessage || 'So‘rovda xatolik yuz berdi. Ma’lumotlarni tekshirib ko‘ring.', {
        richColors: true,
      });
    }

    if (status === 401) {
      if (!isQrPath && !isLoginPath) {
        window.location.replace('/auth/login');
      } else {
        console.log('Redirect is ignored on QR or Login page.');
      }
    }

    return Promise.reject(error);
  },
);
