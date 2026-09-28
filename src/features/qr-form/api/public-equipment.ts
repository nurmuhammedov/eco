import { AxiosError } from 'axios'
import { publicApi } from '@/shared/api/public'
import type { FileDto } from '@/shared/types/api'

export type PublicEquipmentStatus = 'VALID' | 'INVALID' | 'INACTIVE' | 'EXPIRED' | 'NO_DATE'

/** EquipmentViewByQr (`GET /public/equipments/{id}`): what the sticker's QR code opens */
export interface PublicEquipment {
  id: string
  type: string | null
  typeName: string | null
  attractionName: string | null
  childEquipmentName: string | null
  childEquipmentSortName: string | null
  registryNumber: string | null
  inspectorName: string | null
  registrationDate: string | null
  manufacturedAt: string | null
  acceptedAt: string | null
  servicePeriod: string | null
  riskLevel: string | null
  status: PublicEquipmentStatus | null
  location: string | null
  ownerName: string | null
  ownerIdentity: number | null
  registryFilePath: string | null
  /** Not in EquipmentViewByQr: the backend does not send it yet */
  deregisterFilePath?: string | null
  parameters: Record<string, string> | null
  files: Record<string, FileDto> | null
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
