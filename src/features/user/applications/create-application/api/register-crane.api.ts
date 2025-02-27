import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export function useCreateRegisterCraneMutation() {
  return useMutation({
    mutationKey: ['createRegisterCraneMutation'],
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.USERS, data);
      return response.data;
    },
  });
}
