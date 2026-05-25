import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Inbox } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { InquiryStatus } from '@/features/inquiries/model/types'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { formatDate } from 'date-fns'

export const InquiryNotification = () => {
  const { user } = useAuth()

  const isRegional = user?.role === UserRoles.REGIONAL
  const isInspector = user?.role === UserRoles.INSPECTOR
  const isAccountant = user?.role === UserRoles.ACCOUNTANT

  const isEnabled = isRegional || isInspector || isAccountant

  // Regional: NEW
  const { data: newInqData, totalElements: newCount } = usePaginatedData<any>(
    '/inquiries',
    { status: InquiryStatus.NEW, size: 100, page: 1 },
    isRegional,
    Infinity
  )

  // Inspector: IN_PROCESS, IN_COURT
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

  // Accountant: REWARD_PAYMENT
  const { data: rewardInqData, totalElements: rewardCount } = usePaginatedData<any>(
    '/inquiries',
    { status: InquiryStatus.REWARD_PAYMENT, size: 100, page: 1 },
    isAccountant,
    Infinity
  )

  const items = useMemo(() => {
    let list: any[] = []
    if (isRegional && newInqData?.content) {
      list = [...newInqData.content]
    } else if (isInspector) {
      if (processInqData?.content) list = [...list, ...processInqData.content]
      if (courtInqData?.content) list = [...list, ...courtInqData.content]
    } else if (isAccountant && rewardInqData?.content) {
      list = [...rewardInqData.content]
    }

    // Sort by createdAt descending
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [isRegional, isInspector, isAccountant, newInqData, processInqData, courtInqData, rewardInqData])

  const totalCount = useMemo(() => {
    if (isRegional) return newCount || 0
    if (isInspector) return (processCount || 0) + (courtCount || 0)
    if (isAccountant) return rewardCount || 0
    return 0
  }, [isRegional, isInspector, isAccountant, newCount, processCount, courtCount, rewardCount])

  if (!isEnabled) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-slate-100">
          <Bell className="h-5 w-5 text-slate-600" />
          {totalCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0 shadow-lg">
        <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-500" />
            <h4 className="font-semibold text-slate-800">Murojaatlar</h4>
          </div>
          <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {totalCount} ta
          </span>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {items.length > 0 ? (
            <div className="flex flex-col">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/inquiries/detail/${item.id}`}
                  className="flex flex-col gap-1 border-b px-4 py-3 transition-colors last:border-0 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-blue-600 hover:underline">
                      {item.registryNumber || 'Raqamsiz'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {item.createdAt ? formatDate(new Date(item.createdAt), 'dd.MM.yyyy HH:mm') : ''}
                    </span>
                  </div>
                  <span className="line-clamp-1 text-sm text-slate-600">{item.fullName || 'Noma‘lum yuboruvchi'}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-slate-500">
              <div className="rounded-full bg-slate-100 p-3">
                <Inbox className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm">Yangi murojaatlar yo‘q</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
