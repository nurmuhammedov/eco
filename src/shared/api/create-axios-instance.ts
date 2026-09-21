import axios from 'axios'
import { toast } from 'sonner'
import { cleanParams } from '@/shared/lib/api'
import { goToGuestLanding } from '@/shared/config/navigation'

/**
 * Both backends answer the same way, so they get the same instance: the same
 * parameter cleaning, the same error toasts and the same sign-out on 401. Only
 * the base URL differs, which is all this factory takes.
 */
export const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    withCredentials: true,
    baseURL,
    paramsSerializer: { indexes: null },
  })

  instance.interceptors.request.use(
    (config) => {
      if (config.params) config.params = cleanParams(config.params)

      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const location = window.location.pathname

      const isQrPath =
        location.startsWith('/qr/') || location.startsWith('/public/') || location.startsWith('/public-inquiry')
      const isLoginPath = location.startsWith('/auth/login')

      const status = error?.response?.status
      const requestUrl = error?.response?.config?.url

      const errorMessage = error.response?.data?.message
      const validationErrors = error.response?.data?.errors

      if (status === 401 && requestUrl === '/api/v1/auth/login') {
        toast.error('Login yoki parol noto‘g‘ri. Iltimos, ma’lumotlarni tekshirib, qayta urinib ko‘ring.', {
          richColors: true,
        })
      } else if (status === 401 && requestUrl === '/api/v1/users/me') {
        if (!isQrPath && !isLoginPath) {
          toast.error('Kirish ma’lumotlari topilmadi yoki noto‘g‘ri. Iltimos, tizimga qayta kiring.', {
            richColors: true,
          })
        }
      } else if (status >= 400 && status < 600) {
        if (validationErrors && Object.keys(validationErrors).length > 0) {
          Object.values(validationErrors).forEach((errMessage: any) => {
            const message = Array.isArray(errMessage) ? errMessage.join(', ') : errMessage
            toast.error(message, { richColors: true })
          })
        } else {
          toast.error(errorMessage || 'So‘rovda xatolik yuz berdi. Ma’lumotlarni tekshirib ko‘ring.', {
            richColors: true,
          })
        }
      }

      if (status === 401 && !isQrPath && !isLoginPath) goToGuestLanding()

      return Promise.reject(error)
    }
  )

  return instance
}
