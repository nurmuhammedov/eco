import { FileText, PlusCircle, Clock, Gavel, HandCoins, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { InquiryStatus } from '@/features/inquiries/model/types'

interface InquiriesStatsProps {
  regionId?: string | null
}

export const InquiriesStats = ({ regionId }: InquiriesStatsProps) => {
  const inqParams = { page: 1, size: 1, ...(regionId ? { regionId } : {}) }
  const { totalElements: inqNew = 0 } = usePaginatedData('/inquiries', { ...inqParams, status: InquiryStatus.NEW })
  const { totalElements: inqProcess = 0 } = usePaginatedData('/inquiries', {
    ...inqParams,
    status: InquiryStatus.IN_PROCESS,
  })
  const { totalElements: inqCourt = 0 } = usePaginatedData('/inquiries', {
    ...inqParams,
    status: InquiryStatus.IN_COURT,
  })
  const { totalElements: inqReward = 0 } = usePaginatedData('/inquiries', {
    ...inqParams,
    status: InquiryStatus.REWARD_PAYMENT,
  })
  const { totalElements: inqCompleted = 0 } = usePaginatedData('/inquiries', {
    ...inqParams,
    status: InquiryStatus.COMPLETED,
  })
  const { totalElements: inqRejected = 0 } = usePaginatedData('/inquiries', {
    ...inqParams,
    status: InquiryStatus.REJECTED,
  })

  const inquiryTotal = inqNew + inqProcess + inqCourt + inqReward + inqCompleted + inqRejected

  const renderCleanCard = (
    title: string,
    value: number,
    icon: any,
    colorText: string,
    bgColor: string,
    className?: string
  ) => (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className={cn('rounded-xl p-2.5', bgColor, colorText)}>{icon}</span>
      </div>
      <div className="mt-auto">
        <span className="mb-1 block text-2xl font-bold text-slate-900">{value?.toLocaleString()}</span>
        <span className="text-sm font-medium text-slate-500">{title}</span>
      </div>
    </div>
  )

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Murojaatlar</h2>
          <p className="mt-1 text-sm text-slate-500">Kelib tushgan murojaatlar bo‘yicha umumiy hisobot</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-5">
        {renderCleanCard(
          'Jami',
          inquiryTotal,
          <FileText className="h-6 w-6 md:h-8 md:w-8" />,
          'text-blue-600',
          'bg-blue-50',
          'col-span-full sm:col-span-2 md:col-span-1 md:row-span-2 md:p-8'
        )}
        {renderCleanCard('Yangi', inqNew, <PlusCircle className="h-6 w-6" />, 'text-blue-500', 'bg-blue-50')}
        {renderCleanCard(
          'Ko‘rib chiqilmoqda',
          inqProcess,
          <Clock className="h-6 w-6" />,
          'text-amber-600',
          'bg-amber-50'
        )}
        {renderCleanCard('Sud jarayonida', inqCourt, <Gavel className="h-6 w-6" />, 'text-purple-600', 'bg-purple-50')}
        {renderCleanCard(
          'Hisob jarayonida',
          inqReward,
          <HandCoins className="h-6 w-6" />,
          'text-indigo-600',
          'bg-indigo-50'
        )}
        {renderCleanCard(
          'Yakunlangan',
          inqCompleted,
          <CheckCircle className="h-6 w-6" />,
          'text-emerald-600',
          'bg-emerald-50'
        )}
        {renderCleanCard('Rad etilgan', inqRejected, <XCircle className="h-6 w-6" />, 'text-red-600', 'bg-red-50')}
      </div>
    </div>
  )
}
