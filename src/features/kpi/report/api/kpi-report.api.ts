import { servicesApiClient } from '@/shared/api/services-api-client'

export interface ReportIndicator {
  indicator_name: string
  calculation_type: string
  target: number
  weight: number
  completion_percent: number
  score: number
  status: string
  note: string | null
}

export interface KpiReportItem {
  kpi_department_id: string
  department_name: string
  responsible_name?: string
  year: number
  quarter: number
  total_weight: number
  kpi_score: number
  approved_weight: number
  is_quarter_ended: boolean
  status_comment: string
  indicators: ReportIndicator[]
}

export const kpiReportAPI = {
  getReport: (params: { year: string; quarter: string }) =>
    servicesApiClient.get<KpiReportItem[]>('/kpi/report', params),
}
