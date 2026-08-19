import { useMemo } from 'react'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { InquiryStatus } from '@/features/inquiries/model/types'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'

export interface InquiryNotificationItem {
  id: string
  registryNumber?: string
  fullName?: string
  createdAt?: string
}

export const useInquiryNotifications = () => {
  const { user } = useAuth()

  const isRegional = user?.role === UserRoles.REGIONAL
  const isInspector = user?.role === UserRoles.INSPECTOR
  const isAccountant = user?.role === UserRoles.ACCOUNTANT
  const isEnabled = isRegional || isInspector || isAccountant

  const { data: newInqData, totalElements: newCount } = usePaginatedData<any>(
    '/inquiries',
    { status: InquiryStatus.NEW, size: 100, page: 1 },
    isRegional,
    Infinity
  )

  const { data: processInqData, totalElements: processCount } = usePaginatedData<any>(
    '/inquiries',
    { status: InquiryStatus.IN_PROCESS, size: 100, page: 1 },
    isInspector,
    Infinity
  )

  const { data: courtInqData, totalElements: courtCount } = usePaginatedData<any>(
    '/inquiries',
    { status: InquiryStatus.IN_COURT, size: 100, page: 1 },
    isInspector,
    Infinity
  )

  const { data: rewardInqData, totalElements: rewardCount } = usePaginatedData<any>(
    '/inquiries',
    { status: InquiryStatus.REWARD_PAYMENT, size: 100, page: 1 },
    isAccountant,
    Infinity
  )

  const items = useMemo<InquiryNotificationItem[]>(() => {
    let list: any[] = []
    if (isRegional && newInqData?.content) {
      list = [...newInqData.content]
    } else if (isInspector) {
      if (processInqData?.content) list = [...list, ...processInqData.content]
      if (courtInqData?.content) list = [...list, ...courtInqData.content]
    } else if (isAccountant && rewardInqData?.content) {
      list = [...rewardInqData.content]
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [isRegional, isInspector, isAccountant, newInqData, processInqData, courtInqData, rewardInqData])

  const totalCount = useMemo(() => {
    if (isRegional) return newCount || 0
    if (isInspector) return (processCount || 0) + (courtCount || 0)
    if (isAccountant) return rewardCount || 0
    return 0
  }, [isRegional, isInspector, isAccountant, newCount, processCount, courtCount, rewardCount])

  return { items, totalCount: isEnabled ? totalCount : 0, isEnabled }
}
