import { servicesApiClient } from '@/shared/api/services-api-client'
import type { KpiCalculationType, KpiTask, KpiTaskDetail } from '@/entities/kpi'

export interface KpiIndicatorPayload {
  name: string
  calculation_type: KpiCalculationType
  target: number
  penalty_per_unit?: number | null
  weight: number
}

export interface CreateKpiTaskDTO {
  year: number
  quarter: number
  kpi_department_id: string
  indicators: KpiIndicatorPayload[]
}

export interface UpdateKpiTaskDTO {
  indicators: KpiIndicatorPayload[]
}

const BASE_URL = '/kpi/tasks'

export const kpiTasksAPI = {
  getAll: (params: { year: number; quarter: number }) => servicesApiClient.get<KpiTask[]>(BASE_URL, params),

  getOne: (id: string) => servicesApiClient.get<KpiTaskDetail>(`${BASE_URL}/${id}`),

  create: (data: CreateKpiTaskDTO) => servicesApiClient.post<KpiTaskDetail>(BASE_URL, data),

  update: (id: string, data: UpdateKpiTaskDTO) => servicesApiClient.put<KpiTaskDetail>(`${BASE_URL}/${id}`, data),

  delete: (id: string) => servicesApiClient.delete(`${BASE_URL}/${id}`),

  approveResult: (indicatorId: string, data?: { hr_comment?: string }) =>
    servicesApiClient.post(`/kpi/indicators/${indicatorId}/approve`, data ?? {}),

  rejectResult: (indicatorId: string, data: { hr_comment: string }) =>
    servicesApiClient.post(`/kpi/indicators/${indicatorId}/reject`, data),
}
