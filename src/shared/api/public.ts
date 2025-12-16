import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_URL .env faylida aniqlanmagan! Iltimos, loyihaning root papkasida .env faylini yarating va VITE_API_URL=... deb yozing.'
  )
}

export const publicApi = axios.create({
  baseURL: API_BASE_URL,
})
