// Shared KPI types. Source of truth: services (Laravel) API — /api/v1/kpi/*

export type KpiResultStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'

export type KpiTaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING' | 'REJECTED' | 'APPROVED'

export type KpiCalculationType = 'PLAN' | 'PENALTY'

export interface KpiResult {
  id: string
  achieved_value: number | null
  // Computed on the server, never on the client
  completion_percent: number
  note: string | null
  // Path returned by the main backend uploader; render with FileLink
  file_url: string | null
  status: KpiResultStatus
  hr_comment: string | null
  reviewed_by_name: string | null
  submitted_at: string | null
  reviewed_at: string | null
  created_at: string | null
  updated_at: string | null
}

export interface KpiIndicator {
  id: string
  name: string
  calculation_type: KpiCalculationType
  target: number
  penalty_per_unit: number | null
  weight: number
  result: KpiResult | null
  completion_percent: number
  // Weighted score, between 0 and weight
  score: number
}

export interface KpiTaskSummary {
  indicator_count: number
  total_weight: number
  completion_rate: number
  approved_weight: number
  submitted_count: number
  approved_count: number
  has_results: boolean
  status: KpiTaskStatus
  status_text: string
  is_quarter_ended: boolean
}

export interface KpiTask extends KpiTaskSummary {
  id: string
  year: number
  quarter: number
  kpi_department_id: string
  department_name: string
  created_by: string | null
  created_at: string | null
}

export interface KpiTaskDetail extends KpiTask {
  indicators: KpiIndicator[]
  updated_at: string | null
}
