import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { useAuth } from '@/shared/hooks/use-auth'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { ApiResponse } from '@/shared/types/api'
import { DASHBOARD_STALE_TIME } from './use-dashboard-stats'

/** An inquiry still open this many days after it came in is overdue. */
export const INQUIRY_OVERDUE_DAYS = 15

/**
 * The backend counts the open inquiries (new, in process, in court, reward payment)
 * older than the given days in one query, scoped to the user's role like `/inquiries`.
 */
export const useOverdueInquiriesCount = (regionId?: string | null) => {
  const { user } = useAuth()

  return useQuery({
    // Keyed under the endpoint so the inquiry mutations' invalidation reaches it too.
    queryKey: endpointKey('/inquiries', { overdueDays: INQUIRY_OVERDUE_DAYS, regionId }, user?.role),
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<number>>('/inquiries/overdue-count', {
        overdueDays: INQUIRY_OVERDUE_DAYS,
        ...(regionId ? { regionId } : {}),
      })

      return data.data ?? 0
    },
    staleTime: DASHBOARD_STALE_TIME,
  })
}
