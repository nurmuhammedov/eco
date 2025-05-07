import { ApiResponse } from '@/shared/types';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export async function createPdf(data: FormData): Promise<ApiResponse<string>> {
  try {
    const response = await apiClient.post<ApiResponse<string>>(API_ENDPOINTS.GENERATE_PDF, data);
    return response.data;
  } catch (_error) {
    throw new Error('PDF generatsiya qilishda xatolik yuz berdi');
  }
}
