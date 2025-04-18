// use-upload-files.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/shared/api';
import { AxiosProgressEvent } from 'axios';

export interface UploadResponse {
  urls: string[];
}

interface UploadFilesOptions {
  endpoint?: string;
  fieldName?: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

const DEFAULT_OPTIONS: UploadFilesOptions = {
  endpoint: '/attachments/registry-files',
  fieldName: 'file',
};

export const useUploadFiles = (options?: UploadFilesOptions) => {
  const { endpoint, fieldName, onUploadProgress } = { ...DEFAULT_OPTIONS, ...options };

  return useMutation<string[], Error, File[]>({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append(fieldName || 'file', file));

      // API klientga headers va onUploadProgress ni to'g'ri uzatish
      const response = await apiClient.post<string[]>(
        endpoint || '/attachments/registry-files',
        formData,
        { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      );

      if (!response.success) {
        throw new Error(response.message || 'Fayl yuklashda xatolik yuz berdi');
      }

      return response.data;
    },
  });
};
