import { servicesApiClient } from '@/shared/api/services-api-client'
import type { KpiResult, KpiTaskDetail } from '@/entities/kpi'

// Department side. Only the achieved value is sent; the percentage is computed server-side.
// Documents are uploaded to the main backend beforehand, so just the URL travels here.

export interface SaveResultDTO {
  achieved_value: number
  note?: string
  file_url?: string | null
}

export const myKpiAPI = {
  /** GET /api/v1/kpi/my-tasks?year=&quarter= */
  getMyTask: (params: { year: number; quarter: number }) =>
    servicesApiClient.get<KpiTaskDetail>('/kpi/my-tasks', params),

  /** POST /api/v1/kpi/results */
  createResult: (indicatorId: string, dto: SaveResultDTO) =>
    servicesApiClient.post<KpiResult>('/kpi/results', { ...dto, kpi_indicator_id: indicatorId }),

  /** PUT /api/v1/kpi/results/{id} */
  updateResult: (resultId: string, dto: SaveResultDTO) =>
    servicesApiClient.put<KpiResult>(`/kpi/results/${resultId}`, dto),

  /** POST /api/v1/kpi/tasks/{id}/submit */
  submitTask: (taskId: string) => servicesApiClient.post<KpiTaskDetail>(`/kpi/tasks/${taskId}/submit`, {}),
}
