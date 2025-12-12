import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { ApiResponse } from '@/shared/types'

export interface RiskAnalysisInterval {
  id: number
  startDate: string
  endDate: string
}

export const riskAnalysisIntervalsAPI = {
  list: async () => {
    const { data } = await apiClient.get<ApiResponse<RiskAnalysisInterval[]>>(
      `${API_ENDPOINTS.RISK_ANALYSIS_INTERVALS_SELECT}`
    )
    return data.data
  },
}
