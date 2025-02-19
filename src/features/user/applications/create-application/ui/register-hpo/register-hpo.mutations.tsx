import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export function useCreateRegisterHPOMutation(data: any) {
  return useMutation({
    mutationKey: ['createRegisterHPOMutation'],
    mutationFn: async () => {
      const response = await apiClient.post(API_ENDPOINTS.USERS, data);
      return response.data;
    },
  });
}
