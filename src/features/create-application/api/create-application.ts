import { apiClient } from '@/shared/api';

export const createApplication = async (
  formData: any,
  filePath: string,
  sign: string,
  endpoint: string = '/create-application',
) => {
  try {
    const response = await apiClient.post(endpoint, {
      formData,
      filePath,
      sign,
    });
    return response.data;
  } catch (_error) {
    return {
      success: false,
      error: 'Arizani yaratishda xatolik',
    };
  }
};
