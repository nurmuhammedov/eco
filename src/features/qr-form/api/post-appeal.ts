import { AxiosError } from 'axios'
import { publicApi } from '@/shared/api/public'

export interface AppealDto {
  type: 'APPEAL' | 'COMPLAINT' | 'SUGGESTION'
  fullName?: string
  phoneNumber?: string
  message: string
  belongId: string
  belongType: 'EQUIPMENT'
  filePath?: string
}

export interface AppealApiResponse {
  success: boolean
  message: string
  data?: any
}

export const postAppeal = async (appealData: AppealDto): Promise<AppealApiResponse> => {
  try {
    const response = await publicApi.post<AppealApiResponse>('/api/v1/public/inquiries', appealData)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Murojaatni yuborishda xatolik yuz berdi. Internetni tekshiring.')
  }
}
