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
    const isLoginPath = location.startsWith('/auth/login'); // Barcha /auth/login... manzillarini qamrab oladi

    const status = error?.response?.status;
    const requestUrl = error?.response?.config?.url;
    const errorMessage = error.response?.data?.message;

    // 1. Eng aniq holat: Login so'rovida 401 xatolik
    if (status === 401 && requestUrl === '/api/v1/auth/login') {
      toast.error(
        errorMessage || 'Login yoki parol noto‘g‘ri. Iltimos, ma’lumotlarni tekshirib, qayta urinib ko‘ring.',
        {
          richColors: true,
        },
      );
    }
    // 2. Foydalanuvchi ma'lumotini olishda 401 xatolik
    else if (status === 401 && requestUrl === '/api/v1/users/me') {
      if (!isQrPath && !isLoginPath) {
        toast.error(errorMessage || 'Kirish maʼlumotlari topilmadi yoki noto‘g‘ri. Iltimos, tizimga qayta kiring.', {
          richColors: true,
        });
      }
    }
    // 3. Boshqa 4xx (Client) xatoliklari uchun umumiy xabar
    else if (status >= 400 && status < 500) {
      toast.error(errorMessage || 'So‘rovda xatolik yuz berdi. Ma’lumotlarni tekshirib ko‘ring.', {
        richColors: true,
      });
    }

    // Redirect logikasi: Faqat 401 xatolik uchun
    if (status === 401) {
      if (!isQrPath && !isLoginPath) {
        // Faqat QR va Login sahifalarida bo'lmasa redirect qilamiz
        window.location.replace('/auth/login');
      } else {
        console.log('Redirect is ignored on QR or Login page.');
      }
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
