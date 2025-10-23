// src/features/contact-form/api/postAppeal.ts
import { publicApi } from '@/shared/api/public';

// DTO interfeysini filePath bilan yangilaymiz
export interface AppealDto {
  type: 'APPEAL' | 'COMPLAINT' | 'SUGGESTION';
  fullName?: string;
  phoneNumber?: string;
  message: string;
  belongId: string;
  belongType: 'EQUIPMENT';
  filePath?: string; // YANGI (ixtiyoriy)
}

interface ApiResponse {
  success: boolean;
  AppealNumber: string;
  message: string;
}

// Funksiya endi FormData emas, balki AppealDto qabul qiladi
export const postAppeal = async (appealData: AppealDto): Promise<ApiResponse> => {
  try {
    const response = await publicApi.post<ApiResponse>('/api/v1/public/inquiries', appealData);
    return response.data;
  } catch (error) {
    console.error('Murojaat yuborishda xatolik:', error);
    throw error;
  }
};
