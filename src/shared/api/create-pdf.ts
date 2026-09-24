import { apiClient } from '@/shared/api/api-client'
import { ApiResponse } from '@/shared/types'
import type { RequestParams } from '@/shared/api/create-api-client'

export async function createPdf(
  values: object,
  endpoint: string = '/appeals/hf/generate-pdf',
  method: 'get' | 'post' = 'post'
): Promise<ApiResponse<unknown>> {
  try {
    if (method === 'get') {
      return await apiClient.get<unknown>(endpoint, values as RequestParams)
    }
    return await apiClient.post<unknown>(endpoint, values)
  } catch (_error) {
    throw new Error('Hujjat shakllantirishda xatolik yuz berdi!')
  }
}
