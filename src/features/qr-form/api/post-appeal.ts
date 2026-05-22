import { AxiosError } from 'axios'
import { publicApi } from '@/shared/api/public'

export interface AppealDto {
  belongId?: string
  type: 'APPEAL' | 'RISK_APPEAL' | 'SUGGESTION'
  belongType?: 'EQUIPMENT' | 'XRAY' | 'HF' | 'IRS' | (string & {})
  message: string
  fullName?: string | null
  phoneNumber?: string
  filePathList: string[]
  regionId: number
  location: string
  occurredAt: string
  cardNumber?: string | null
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
