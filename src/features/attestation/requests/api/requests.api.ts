import { servicesApiClient } from '@/shared/api/services-api-client'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import type { AttestationEmployee, AttestationRequest, SubmitRequestPayload } from '@/entities/attestation/model/types'

export const requestsAPI = {
  /** Staff of the organization, from the partner training system */
  getEmployees: () => servicesApiClient.get<AttestationEmployee[]>(SERVICES_API_ENDPOINTS.EMPLOYEES),

  submit: (data: SubmitRequestPayload) =>
    servicesApiClient.post<AttestationRequest>(SERVICES_API_ENDPOINTS.REQUESTS, data),

  getById: (id: string) => servicesApiClient.get<AttestationRequest>(SERVICES_API_ENDPOINTS.REQUEST_BY_ID(id)),

  accept: (id: string) => servicesApiClient.post<AttestationRequest>(SERVICES_API_ENDPOINTS.REQUEST_ACCEPT(id), {}),

  reject: (id: string, reason: string) =>
    servicesApiClient.post<AttestationRequest>(SERVICES_API_ENDPOINTS.REQUEST_REJECT(id), { reason }),
}
