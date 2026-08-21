import { FileText, PlusCircle, Clock, Gavel, HandCoins, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { InquiryStatus } from '@/features/inquiries/model/types'
import { DASHBOARD_STALE_TIME } from '../model/use-dashboard-stats'
import { StatValue } from './stat-value'

interface InquiriesStatsProps {
  regionId?: string | null
}

export const InquiriesStats = ({ regionId }: InquiriesStatsProps) => {
  const inqParams = { page: 1, size: 1, ...(regionId ? { regionId } : {}) }
  const inqNewQuery = usePaginatedData(
    '/inquiries',
    { ...inqParams, status: InquiryStatus.NEW },
    true,
    DASHBOARD_STALE_TIME
  )
  const inqProcessQuery = usePaginatedData(
    '/inquiries',
    { ...inqParams, status: InquiryStatus.IN_PROCESS },
    true,
    DASHBOARD_STALE_TIME
  )
  const inqCourtQuery = usePaginatedData(
    '/inquiries',
    { ...inqParams, status: InquiryStatus.IN_COURT },
    true,
    DASHBOARD_STALE_TIME
  )
  const inqRewardQuery = usePaginatedData(
    '/inquiries',
    { ...inqParams, status: InquiryStatus.REWARD_PAYMENT },
    true,
    DASHBOARD_STALE_TIME
  )
  const inqCompletedQuery = usePaginatedData(
    '/inquiries',
    { ...inqParams, status: InquiryStatus.COMPLETED },
    true,
    DASHBOARD_STALE_TIME
  )
  const inqRejectedQuery = usePaginatedData(
    '/inquiries',
    { ...inqParams, status: InquiryStatus.REJECTED },
    true,
    DASHBOARD_STALE_TIME
  )

  const queries = [inqNewQuery, inqProcessQuery, inqCourtQuery, inqRewardQuery, inqCompletedQuery, inqRejectedQuery]

  // A real zero and a not-yet-loaded zero must not look the same.
  const isLoading = queries.some((query) => query.isFetching && query.data === undefined)

  const inqNew = inqNewQuery.totalElements ?? 0
  const inqProcess = inqProcessQuery.totalElements ?? 0
  const inqCourt = inqCourtQuery.totalElements ?? 0
  const inqReward = inqRewardQuery.totalElements ?? 0
  const inqCompleted = inqCompletedQuery.totalElements ?? 0
  const inqRejected = inqRejectedQuery.totalElements ?? 0

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
        'group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span aria-hidden="true" className={cn('rounded-xl p-2.5', bgColor, colorText)}>
          {icon}
        </span>
      </div>
      <div className="mt-auto">
        <StatValue
          value={value}
          isLoading={isLoading}
          className="mb-1 block text-2xl font-bold text-slate-900"
          skeletonClassName="mb-1 h-8 w-16"
        />
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
