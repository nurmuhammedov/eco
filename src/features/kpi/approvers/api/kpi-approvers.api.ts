import { serviceData, servicesApiClient } from '@/shared/api/services-api-client'

export interface KpiApprover {
  id: string
  user_id: string
  username: string
  name: string
  can_assign: boolean
}

export interface KpiApproverCandidate {
  id: string
  name: string
  username: string
  role: string
}

export interface SaveKpiApproversDTO {
  approvers: { user_id: string; can_assign: boolean }[]
}

export const APPROVERS_ENDPOINT = '/kpi/approvers'
export const CANDIDATES_ENDPOINT = '/kpi/approver-candidates'

export const kpiApproversAPI = {
  getAll: async () => serviceData<KpiApprover[]>(await servicesApiClient.get<KpiApprover[]>(APPROVERS_ENDPOINT)),

  getCandidates: async () =>
    serviceData<KpiApproverCandidate[]>(await servicesApiClient.get<KpiApproverCandidate[]>(CANDIDATES_ENDPOINT)),

  save: (data: SaveKpiApproversDTO) => servicesApiClient.put<KpiApprover[]>(APPROVERS_ENDPOINT, data),
}
