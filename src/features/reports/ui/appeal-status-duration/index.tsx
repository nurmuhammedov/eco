import { onActivate } from '@/shared/lib/on-activate'
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
/**
 * A number that opens something says so before it is hovered: blue with the
 * icon, against plain text for the zeros that lead nowhere. The box fills the
 * cell so the click target is not just the digits.
 */
const CountCell = ({
  value,
  isSummary,
  tone,
  onOpen,
}: {
  value: number
  isSummary: boolean
  tone?: string
  onOpen: () => void
}) => {
  // A zero carries no warning and opens nothing, so it stays plain.
  if (!value) return <span className={cn(isSummary && 'font-bold')}>{value}</span>

  return (
    <div
      className={cn(
        'group/link -my-2.5 flex cursor-pointer items-center justify-center gap-1 px-3 py-2.5 font-medium',
        // The overdue column keeps its red; the icon is what marks it clickable.
        tone ?? 'text-[#0271FF]',
        isSummary && 'font-bold'
      )}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={onActivate(onOpen)}
    >
      <span className="underline-offset-2 group-hover/link:underline">{value}</span>
      <ExternalLink className="size-3 shrink-0" />
    </div>
  )
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
    columns: (
      [
        ['upTo5Days', '5 kungacha', undefined],
        ['from6To15Days', '5-15 kun', undefined],
        ['over15Days', '15 kundan ortiq', 'text-red-500'],
        ['total', 'Jami', undefined],
      ] as const
    ).map(([key, label, tone]) => ({
      id: `${prefix}_${key}`,
      header: label,
      accessorFn: (row: any) => row[prefix]?.[key] || 0,
      className: cn('text-center whitespace-nowrap', key === 'total' && 'bg-slate-50/30 font-semibold text-slate-900'),
      cell: ({ row, getValue }: any) => (
        <CountCell
          value={getValue()}
          isSummary={row.original.isSummary}
          tone={tone}
          onOpen={() => handleNavigate(row.original, prefix, key === 'total' ? undefined : key)}
        />
      ),
    })),
  })

  const columns = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'regionName',
      id: 'regionName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
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
          showNumeration={false}
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
