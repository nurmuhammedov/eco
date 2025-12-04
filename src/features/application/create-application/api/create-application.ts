import { apiClient } from '@/shared/api'
import { ApiResponse } from '@/shared/types'

export async function createPdf<T extends Record<string, any>>(
  values: T,
  endpoint: string = '/appeals/hf/generate-pdf'
): Promise<ApiResponse<T>> {
  try {
    return await apiClient.post<T>(endpoint, values)
  } catch (_error) {
    throw new Error('PDF generatsiya qilishda xatolik yuz berdi')
  }
}
