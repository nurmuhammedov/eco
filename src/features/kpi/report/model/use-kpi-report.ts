import { useQuery } from '@tanstack/react-query'
import { kpiReportAPI } from '../api/kpi-report.api'

export const KPI_REPORT_KEYS = {
  all: ['kpi-report'] as const,
  list: (year: string, quarter: string) => [...KPI_REPORT_KEYS.all, year, quarter] as const,
}

export const useGetKpiReport = (year: string, quarter: string) => {
  return useQuery({
    queryKey: KPI_REPORT_KEYS.list(year, quarter),
    queryFn: async () => {
      const response = await kpiReportAPI.getReport({ year, quarter })
      const payload = response.data as any
      return (payload?.data ?? payload) as import('../api/kpi-report.api').KpiReportItem[]
    },
    enabled: !!year && !!quarter,
  })
}
