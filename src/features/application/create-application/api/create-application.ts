import { apiClient } from '@/shared/api/api-client'
import { ApiResponse } from '@/shared/types'

export async function createPdf<T extends Record<string, any>>(
  values: T,
  endpoint: string = '/appeals/hf/generate-pdf'
): Promise<ApiResponse<T>> {
  try {
    return await apiClient.post<T>(endpoint, values)
  } catch (_error) {
    throw new Error('Hujjat shakllantirishda xatolik yuz berdi!')
  }
}
