import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { ISearchParams } from '@/shared/types'
import {
  AddEmployeeDto,
  AttestationReportDto,
  AttestationView,
  IConductAttestationPayload,
} from '../model/attestation.types'

type AttestationData = AttestationView | AttestationReportDto

export const attestationAPI = {
  getAll: async (params: ISearchParams) => {
    const { data } = await apiClient.getWithPagination<AttestationData>(API_ENDPOINTS.ATTESTATION, params)
    return data
  },

  create: async (payload: AddEmployeeDto) => {
    const { data } = await apiClient.post('/employee', payload)
    return data
  },
}

export const conductAttestation = async (payload: IConductAttestationPayload): Promise<void> => {
  await apiClient.post(`/attestation/conduct`, payload)
}
