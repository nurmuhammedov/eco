import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface UploadResponse {
  urls: string[];
}

export const useUploadFiles = () => {
  return useMutation<UploadResponse, Error, File[]>({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response = await axios.post<UploadResponse>(
        '/api/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      return response.data;
    },
  });
};
