import { publicApi } from '@/shared/api/public';

interface UploadApiResponse {
  message: string;
  errors: null;
  data: string; // Fayl yo'li `data` maydonida string sifatida keladi
}

export const uploadFile = async (file: File): Promise<UploadApiResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await publicApi.post<UploadApiResponse>('/api/v1/public/attachments/inquiries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fayl yuklashda xatolik:', error);
    throw new Error("Faylni yuklab bo'lmadi.");
  }
};
