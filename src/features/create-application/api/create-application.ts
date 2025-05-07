import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types';

export async function createPdf(
  data: FormData,
  endpoint: string = '/appeals/hf/generate-pdf',
): Promise<ApiResponse<string>> {
  try {
    const response = await apiClient.post<ApiResponse<string>>(endpoint, data);
    return response.data;
  } catch (_error) {
    throw new Error('PDF generatsiya qilishda xatolik yuz berdi');
  }
}

export async function getDocumentUrl(filePath: string): Promise<ApiResponse<string>> {
  try {
    const response = await apiClient.get<ApiResponse<string>>(`/documents/${filePath}`);
    return response.data;
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

export async function createApplication(
  formData: any,
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
  } catch (error) {
    throw new Error('Hujjat yaratishda xatolik');
  }
}
