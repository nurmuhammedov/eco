import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ApplicationStatus, AppealStatusDuration } from '@/entities/application'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'

const STATUS_MAP: Record<string, string> = {
  inNew: ApplicationStatus.NEW,
  inProcess: ApplicationStatus.IN_PROCESS,
  inAgreement: ApplicationStatus.IN_AGREEMENT,
  inApproval: ApplicationStatus.IN_APPROVAL,
}

const DURATION_MAP: Record<string, string> = {
  upTo5Days: AppealStatusDuration.UP_TO_5_DAYS,
  from6To15Days: AppealStatusDuration.FROM_6_TO_15_DAYS,
  over15Days: AppealStatusDuration.OVER_15_DAYS,
}
const AppealStatusDurationReport: React.FC = () => {
  const navigate = useNavigate()
  const { data: reportData, isLoading } = useData<any[]>('/reports/appeal-status/duration', true)

  const tableData = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) return []

    return reportData.map((item: any) => ({
      ...item,
      isSummary:
        item.regionName?.toLowerCase().includes("bo'yicha") || item.regionName?.toLowerCase().includes('bo‘yicha'),
    }))
  }, [reportData])

  const handleNavigate = (row: any, prefix: string, durationKey?: string) => {
    const status = STATUS_MAP[prefix]
    const regionId = row.isSummary ? undefined : row.regionId || row.id
    const statusDuration = durationKey ? DURATION_MAP[durationKey] : undefined

    const params: any = {}
    if (status) params.status = status
    if (regionId) params.regionId = regionId
    if (statusDuration) params.statusDuration = statusDuration

    const searchParams = new URLSearchParams(params)
    navigate(`/applications?${searchParams.toString()}`)
  }

  const createGroup = (prefix: string, header: string) => ({
    header,
    columns: [
      {
        id: `${prefix}_upTo5Days`,
        header: '5 kungacha',
        accessorFn: (row: any) => row[prefix]?.upTo5Days || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => {
          const value = getValue()
          return (
            <div
              className={cn(
                'group flex items-center justify-center gap-1 transition-colors',
                value > 0 && 'cursor-pointer hover:text-blue-600 hover:underline',
                row.original.isSummary ? 'font-bold' : ''
              )}
              onClick={() => value > 0 && handleNavigate(row.original, prefix, 'upTo5Days')}
            >
              {value}
              {value > 0 && <ExternalLink size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />}
            </div>
          )
        },
      },
      {
        id: `${prefix}_from6To15Days`,
        header: '5-15 kun',
        accessorFn: (row: any) => row[prefix]?.from6To15Days || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => {
          const value = getValue()
          return (
            <div
              className={cn(
                'group flex items-center justify-center gap-1 transition-colors',
                value > 0 && 'cursor-pointer hover:text-blue-600 hover:underline',
                row.original.isSummary ? 'font-bold' : ''
              )}
              onClick={() => value > 0 && handleNavigate(row.original, prefix, 'from6To15Days')}
            >
              {value}
              {value > 0 && <ExternalLink size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />}
            </div>
          )
        },
      },
      {
        id: `${prefix}_over15Days`,
        header: '15 kundan ortiq',
        accessorFn: (row: any) => row[prefix]?.over15Days || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => {
          const value = getValue()
          return (
            <div
              className={cn(
                'group flex items-center justify-center gap-1 transition-colors',
                value > 0 && 'cursor-pointer hover:text-blue-600 hover:underline',
                row.original.isSummary ? 'font-bold text-red-600' : 'text-red-500'
              )}
              onClick={() => value > 0 && handleNavigate(row.original, prefix, 'over15Days')}
            >
              {value}
              {value > 0 && <ExternalLink size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />}
            </div>
          )
        },
      },
      {
        id: `${prefix}_total`,
        header: 'Jami',
        accessorFn: (row: any) => row[prefix]?.total || 0,
        className: 'text-center font-semibold text-slate-900 bg-slate-50/30',
        cell: ({ row, getValue }: any) => {
          const value = getValue()
          return (
            <div
              className={cn(
                'group flex items-center justify-center gap-1 transition-colors',
                value > 0 && 'cursor-pointer hover:text-blue-600 hover:underline',
                row.original.isSummary ? 'font-bold' : ''
              )}
              onClick={() => value > 0 && handleNavigate(row.original, prefix)}
            >
              {value}
              {value > 0 && <ExternalLink size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />}
            </div>
          )
        },
      },
    ],
  })

  const columns = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'regionName',
      id: 'regionName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
      cell: ({ row }: any) => {
        const value = row.original.regionName
        const isSummary = row.original.isSummary
        return <span className={cn(isSummary ? 'font-bold text-gray-900' : 'text-gray-700')}>{value}</span>
      },
    },
    createGroup('inNew', 'Yangi'),
    createGroup('inProcess', 'Jarayonda'),
    createGroup('inAgreement', 'Kelishishda'),
    createGroup('inApproval', 'Tasdiqlashda'),
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Arizalar holati va muddati bo‘yicha hisobot" />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
          data={tableData}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={true}
          headerCenter={true}
          isHeaderSticky={true}
          initialState={{
            columnPinning: {
              left: ['regionName'],
            },
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default AppealStatusDurationReport
