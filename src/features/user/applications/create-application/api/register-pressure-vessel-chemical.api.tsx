import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINTS, apiClient } from '@/shared/api';

export function useCreateRegisterPressureVesselMutation() {
  return useMutation({
    mutationKey: ['createRegisterPressureVesselMutation'],
    mutationFn: async (data: any) => {
      const response = await apiClient.post(API_ENDPOINTS.USERS, data);
      return response.data;
    },
  });
}
