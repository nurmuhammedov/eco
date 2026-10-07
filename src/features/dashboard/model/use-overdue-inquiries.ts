import { useQuery } from '@tanstack/react-query'
import { subDays } from 'date-fns'
import { apiClient } from '@/shared/api/api-client'
import { useAuth } from '@/shared/hooks/use-auth'
import { endpointKey } from '@/shared/lib/query/endpoint-key'
import { InquiryStatus } from '@/features/inquiries/model/types'
import type { InquiryRow } from '@/features/inquiries/model/inquiry.types'
import { DASHBOARD_STALE_TIME } from './use-dashboard-stats'

/** An inquiry still open this many days after it came in is overdue. */
export const INQUIRY_OVERDUE_DAYS = 15

/** The statuses in which an inquiry is still waiting on someone. */
const OPEN_STATUSES = [
  InquiryStatus.NEW,
  InquiryStatus.IN_PROCESS,
  InquiryStatus.IN_COURT,
  InquiryStatus.REWARD_PAYMENT,
] as const

const PAGE_SIZE = 500

/**
 * `/inquiries` has no date filter, so every open inquiry of the status is read
 * page by page and the old ones are counted here.
 */
const countOverdue = async (status: InquiryStatus, regionId: string | null | undefined, cutoff: number) => {
  let overdue = 0

  for (let page = 1, totalPages = 1; page <= totalPages; page++) {
    const { data } = await apiClient.getWithPagination<InquiryRow>('/inquiries', {
      page,
      size: PAGE_SIZE,
      status,
      ...(regionId ? { regionId } : {}),
    })

    totalPages = data.page?.totalPages ?? 1
    overdue += (data.content ?? []).filter((row) => row.createdAt && new Date(row.createdAt).getTime() < cutoff).length
  }

  return overdue
}

export const useOverdueInquiriesCount = (regionId?: string | null) => {
  const { user } = useAuth()

  return useQuery({
    // Keyed under the endpoint so the inquiry mutations' invalidation reaches it too.
    queryKey: endpointKey('/inquiries', { overdueDays: INQUIRY_OVERDUE_DAYS, regionId }, user?.role),
    queryFn: async () => {
      const cutoff = subDays(new Date(), INQUIRY_OVERDUE_DAYS).getTime()
      const counts = await Promise.all(OPEN_STATUSES.map((status) => countOverdue(status, regionId, cutoff)))

      return counts.reduce((sum, count) => sum + count, 0)
    },
    staleTime: DASHBOARD_STALE_TIME,
  })
}
