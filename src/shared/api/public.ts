import axios from 'axios';

// Vite loyihalari uchun .env fayllaridan o'zgaruvchilarni olishning to'g'ri usuli
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Dastur ishga tushishidan oldin .env faylida o'zgaruvchi borligini tekshirish
if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_URL .env faylida aniqlanmagan! Iltimos, loyihaning root papkasida .env faylini yarating va VITE_API_URL=... deb yozing.',
  );
}

// Avtorizatsiya tokenini qo'shmaydigan yangi API so'rovchisi
export const publicApi = axios.create({
  baseURL: API_BASE_URL,
});
