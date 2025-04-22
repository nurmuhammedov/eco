import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { toast } from 'sonner';
import { CreateHPOApplicationDTO } from '@/entities/create-application';

export const createApplicationsAPI = {
  createHPOApplication: async (data: CreateHPOApplicationDTO) => {
    const response = await apiClient.post<CreateHPOApplicationDTO>(API_ENDPOINTS.APPEAL_HF, data);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }
    return response;
  },
};
