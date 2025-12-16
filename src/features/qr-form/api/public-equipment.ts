import { AxiosError } from 'axios'
import { publicApi } from '@/shared/api/public'

export interface PublicEquipment {
  id: string
  type: string
  attractionName: string
  childEquipmentName?: string
  childEquipmentSortName?: string
  registryNumber: string
  inspectorName?: string
  registrationDate?: string
  manufacturedAt?: string
  acceptedAt?: string
  servicePeriod?: string
  riskLevel?: string
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'NO_DATE'
  location?: string
  ownerName?: string
  ownerIdentity?: string
  registryFilePath?: string
}

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export const getPublicEquipmentById = async (id: string): Promise<PublicEquipment> => {
  try {
    const { data } = await publicApi.get<ApiResponse<PublicEquipment>>(`/api/v1/public/equipments/${id}`)
    return data.data
  } catch (error) {
    console.error('Public equipment API error:', error)

    if (error instanceof AxiosError) {
      if (error.response?.status === 404) {
        throw new Error('Ushbu ID bo‘yicha qurilma topilmadi.')
      }
      if (error.response?.status === 500) {
        throw new Error('Serverda xatolik yuz berdi. Birozdan so‘ng urinib ko‘ring.')
      }
    }

    throw new Error('Ma’lumotlarni yuklashda xatolik yuz berdi.')
  }
}
