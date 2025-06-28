import { API_ENDPOINTS, apiClient } from '@/shared/api';
import { ISearchParams } from '@/shared/types';
import { AddEmployeeDto, AttestationReportDto, AttestationView } from '../model/attestation.types';

type AttestationData = AttestationView | AttestationReportDto;

export const attestationAPI = {
  getAll: async (params: ISearchParams) => {
    const { data } = await apiClient.getWithPagination<AttestationData>(API_ENDPOINTS.ATTESTATION, params);
    return data;
  },

  create: async (payload: AddEmployeeDto) => {
    const { data } = await apiClient.post('/employee', payload);
    return data;
  },
};
