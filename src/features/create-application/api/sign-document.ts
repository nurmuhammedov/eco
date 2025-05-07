import { apiClient } from '@/shared/api';

export const signDocument = async (filePath: string) => {
  try {
    const response = await apiClient.post('/imzo', { filePath });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Hujjatni imzolashda xatolik',
    };
  }
};
