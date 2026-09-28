import { useMemo } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import { InquiryStatus } from '@/features/inquiries/model/types'
import usePaginatedData from '@/shared/hooks/api/use-paginated-data'
import type { InquiryRow } from '@/features/inquiries/model/inquiry.types'

export interface InquiryNotificationItem {
  id: string
  registryNumber: string | null
  fullName: string | null
  createdAt: string | null
}

export const useInquiryNotifications = () => {
  const { user } = useAuth()

  const isRegional = user?.role === UserRoles.REGIONAL
  const isInspector = user?.role === UserRoles.INSPECTOR
  const isAccountant = user?.role === UserRoles.ACCOUNTANT
  const isEnabled = isRegional || isInspector || isAccountant

  const { data: newInqData, totalElements: newCount } = usePaginatedData<InquiryRow>(
    '/inquiries',
    { status: InquiryStatus.NEW, size: 100, page: 1 },
    isRegional,
    Infinity
  )

  const { data: processInqData, totalElements: processCount } = usePaginatedData<InquiryRow>(
    '/inquiries',
    { status: InquiryStatus.IN_PROCESS, size: 100, page: 1 },
    isInspector,
    Infinity
  )

  const { data: courtInqData, totalElements: courtCount } = usePaginatedData<InquiryRow>(
    '/inquiries',
    { status: InquiryStatus.IN_COURT, size: 100, page: 1 },
    isInspector,
    Infinity
  )

  const { data: rewardInqData, totalElements: rewardCount } = usePaginatedData<InquiryRow>(
    '/inquiries',
    { status: InquiryStatus.REWARD_PAYMENT, size: 100, page: 1 },
    isAccountant,
    Infinity
  )

  const items = useMemo<InquiryNotificationItem[]>(() => {
    let list: InquiryRow[] = []
    if (isRegional && newInqData?.content) {
      list = [...newInqData.content]
    } else if (isInspector) {
      if (processInqData?.content) list = [...list, ...processInqData.content]
      if (courtInqData?.content) list = [...list, ...courtInqData.content]
    } else if (isAccountant && rewardInqData?.content) {
      list = [...rewardInqData.content]
    }

    return list
      .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
      .map(({ id, registryNumber, fullName, createdAt }) => ({ id, registryNumber, fullName, createdAt }))
  }, [isRegional, isInspector, isAccountant, newInqData, processInqData, courtInqData, rewardInqData])

  const totalCount = useMemo(() => {
    if (isRegional) return newCount || 0
    if (isInspector) return (processCount || 0) + (courtCount || 0)
    if (isAccountant) return rewardCount || 0
    return 0
  }, [isRegional, isInspector, isAccountant, newCount, processCount, courtCount, rewardCount])

  return { items, totalCount: isEnabled ? totalCount : 0, isEnabled }
}
