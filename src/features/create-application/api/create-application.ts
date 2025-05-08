import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types';

export async function createPdf<T extends Record<string, any>>(
  values: T,
  endpoint: string = '/appeals/hf/generate-pdf',
): Promise<ApiResponse<T>> {
  try {
    return await apiClient.post<T>(endpoint, values);
  } catch (_error) {
    throw new Error('PDF generatsiya qilishda xatolik yuz berdi');
  }
}

export async function getDocumentUrl(filePath: string) {
  try {
    return await apiClient.get<ApiResponse<string>>(API_ENDPOINTS.GET_FILE_BY_PATH, { path: filePath });
  } catch (_error) {
    throw new Error('Hujjat URL sini olishda xatolik');
  }
}

// Hujjatni imzolash
export async function signDocument(filePath: string): Promise<ApiResponse<string>> {
  try {
    const response = await apiClient.post<ApiResponse<string>>('/imzo', { filePath });
    return response.data;
  } catch (_error) {
    throw new Error('Hujjatni imzolashda xatolik');
  }
}

export async function createApplication<T extends Record<string, any>>(
  formData: T,
  filePath: string,
  sign: string,
  endpoint: string = '/create-application',
) {
  try {
    const response = await apiClient.post(endpoint, {
      formData,
      filePath,
      sign,
    });

    return response.data;
  } catch (_error) {
    throw new Error('Hujjat yaratishda xatolik');
  }
}
