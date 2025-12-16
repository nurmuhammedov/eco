import { publicApi } from '@/shared/api/public'
import { AxiosError } from 'axios'

export interface UploadApiResponse {
  message: string
  errors: any
  data: string
}

export const uploadFile = async (file: File): Promise<UploadApiResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await publicApi.post<UploadApiResponse>('/api/v1/public/attachments/inquiries', formData)
    return response.data
  } catch (error) {
    console.error('Fayl yuklashda xatolik:', error)
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("Faylni yuklash imkonsiz bo'ldi. Internetni tekshiring yoki qaytadan urining.")
  }
}
