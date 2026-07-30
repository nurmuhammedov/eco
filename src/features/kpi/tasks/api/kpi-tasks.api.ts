import { servicesApiClient } from '@/shared/api/services-api-client'

export interface KpiIndicator {
  id?: string
  name: string
  calculation_type: 'PLAN' | 'PENALTY'
  target: number
  penalty_per_unit?: number | null
  weight: number
  result?: {
    id: string
    completion_percent: number
    note: string | null
    file_url: string | null
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
    hr_comment?: string | null
    submitted_at?: string | null
    reviewed_at?: string | null
    created_at?: string | null
  } | null
}

export interface KpiTask {
  id: string
  year: number
  quarter: number
  kpi_department_id: string
  department_name: string
  indicator_count: number
  status_text: string
  has_results: boolean
  completion_rate?: number
}

export interface KpiTaskDetail {
  id: string
  year: number
  quarter: number
  kpi_department_id: string
  department_name: string
  completion_rate?: number
  indicators: KpiIndicator[]
}

export interface CreateKpiTaskDTO {
  year: number
  quarter: number
  kpi_department_id: string
  indicators: Omit<KpiIndicator, 'id' | 'result'>[]
}

export interface UpdateKpiTaskDTO {
  indicators: Omit<KpiIndicator, 'id' | 'result'>[]
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
