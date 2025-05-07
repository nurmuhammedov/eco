import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types';

export const getDocumentUrl = async (filePath: string): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.get<ApiResponse<string>>(`/documents/${filePath}`);
    return response.data;
  } catch (_error) {
    throw new Error('Hujjat URL sini olishda xatolik');
  }
};
