import { servicesApiClient } from '@/shared/api/services-api-client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MyKpiResult {
  id: string
  completion_percent: number
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  note: string | null
  file_url: string | null
}

export interface MyKpiIndicator {
  id: string
  name: string
  calculation_type: 'PLAN' | 'PENALTY'
  target: number
  penalty_per_unit?: number | null
  weight: number
  result: MyKpiResult | null
}

export interface MyKpiTask {
  id: string
  year: number
  quarter: number
  department_name: string
  completion_rate: number
  status_text: string
  indicators: MyKpiIndicator[]
}

export interface CreateResultDTO {
  kpi_indicator_id: string
  completion_percent: number
  note?: string
  file?: File
}

export interface UpdateResultDTO {
  completion_percent: number
  note?: string
  file?: File
}

// ─── API ─────────────────────────────────────────────────────────────────────

export const myKpiAPI = {
  /**
   * GET /api/v1/kpi/my-tasks?year=2026&quarter=1
   * Bitta obyekt qaytaradi (ro'yxat emas)
   */
  getMyTask: (params: { year: number; quarter: number }) => servicesApiClient.get<MyKpiTask>('/kpi/my-tasks', params),

  /**
   * POST /api/v1/kpi/results  (multipart/form-data)
   * Yangi natija kiritish
   */
  createResult: (dto: CreateResultDTO) => {
    const formData = new FormData()
    formData.append('kpi_indicator_id', dto.kpi_indicator_id)
    formData.append('completion_percent', String(dto.completion_percent))
    if (dto.note) formData.append('note', dto.note)
    if (dto.file) formData.append('file', dto.file)

    return servicesApiClient.post<MyKpiResult>('/kpi/results', formData as any, {
      'Content-Type': 'multipart/form-data',
    })
  },

  /**
   * PUT /api/v1/kpi/results/{result_id}  (multipart/form-data)
   * Mavjud natijani yangilash (DRAFT yoki REJECTED holatda)
   */
  updateResult: (resultId: string, dto: UpdateResultDTO) => {
    const formData = new FormData()
    formData.append('completion_percent', String(dto.completion_percent))
    if (dto.note) formData.append('note', dto.note)
    if (dto.file) formData.append('file', dto.file)

    return servicesApiClient.put<MyKpiResult>(`/kpi/results/${resultId}`, formData as any, {
      'Content-Type': 'multipart/form-data',
    })
  },

  /**
   * POST /api/v1/kpi/tasks/{task_id}/submit
   * Barcha natijalarni HR ga yuborish (PENDING holatga o'tkazish)
   */
  submitTask: (taskId: string) => servicesApiClient.post<{ message: string }>(`/kpi/tasks/${taskId}/submit`, {}),
}
