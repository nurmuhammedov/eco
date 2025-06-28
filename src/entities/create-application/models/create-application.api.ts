import {
  CreateAttestationDTO,
  CreateCraneApplicationDTO,
  CreateHPOApplicationDTO,
  CreateLiftApplicationDTO,
} from '@/entities/create-application';
import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { toast } from 'sonner';

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
  createCraneApplication: async (data: CreateCraneApplicationDTO) => {
    const response = await apiClient.post<CreateCraneApplicationDTO>(API_ENDPOINTS.APPEAL_EQUIPMENT_CRANE, data);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }
    return response;
  },
  createLiftApplication: async (data: CreateLiftApplicationDTO) => {
    const response = await apiClient.post<CreateLiftApplicationDTO>(API_ENDPOINTS.APPEAL_EQUIPMENT_ELEVATOR, data);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }
    return response;
  },
  createAttestationApplication: async (data: CreateAttestationDTO) => {
    const response = await apiClient.post<CreateAttestationDTO>(API_ENDPOINTS.APPEALS_ATTESTATION, data);
    if (!response.success && response.errors) {
      toast.error(Object.values(response.errors).join(', '), {
        richColors: true,
      });
    }
    return response;
  },
};
