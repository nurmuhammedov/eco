import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import {
  REPORT_CHANGE_BELONG_TYPE,
  REPORT_CHANGE_STATUS,
  ReportChangeBelongType,
  ReportChangeStatus,
  buildChangeReportLink,
} from '../../model/change-report-link'
import { isCountryTotal } from '../../lib/country-total'
import type { ExtendedColumnDef } from '@/shared/components/common/data-table/model/column-def'

/** ChangeDeregisterByReport */
interface DeregisterCounts {
  allCount: number
  newCount: number
  inProcessCount: number
  completedCount: number
}

/** ReportByChangeDeregisterDto */
interface RegionDeregistrations {
  regionName: string
  regionId: number | null
  hf: DeregisterCounts | null
  equipment: DeregisterCounts | null
  irs: DeregisterCounts | null
  xray: DeregisterCounts | null
}

interface GroupCounts {
  total: number
  not_completed: number
  in_process: number
  completed: number
}

type GroupKey = 'x' | 'q' | 'irs' | 'xray'

type Row = { officeName: string; regionId: number | null; isSummary: boolean } & Record<GroupKey, GroupCounts>

const toGroup = (counts: DeregisterCounts | null): GroupCounts => ({
  total: counts?.allCount || 0,
  not_completed: counts?.newCount || 0,
  in_process: counts?.inProcessCount || 0,
  completed: counts?.completedCount || 0,
})

const BELONG_TYPE_BY_PREFIX: Record<GroupKey, ReportChangeBelongType> = {
  x: REPORT_CHANGE_BELONG_TYPE.HF,
  q: REPORT_CHANGE_BELONG_TYPE.EQUIPMENT,
  irs: REPORT_CHANGE_BELONG_TYPE.IRS,
  xray: REPORT_CHANGE_BELONG_TYPE.XRAY,
}

/**
 * Every count stands for a set of objects the registry can list, the country
 * total included - it just opens without a region. Only a zero has nothing
 * behind it.
 */
const CountCell = ({
  row,
  value,
  prefix,
  status,
}: {
  row: Row
  value: number
  prefix: GroupKey
  status: ReportChangeStatus
}) => {
  // Only a zero has nothing behind it.
  if (!value) return <span className={cn(row.isSummary && 'font-bold')}>{value}</span>

  /**
   * The digits alone are a target a few pixels wide, so the link fills the
   * cell; the icon is what says which numbers open something, since a count of
   * zero and the country total stay plain text.
   */
  return (
    <Link
      to={buildChangeReportLink({
        belongType: BELONG_TYPE_BY_PREFIX[prefix],
        status,
        regionId: row.isSummary ? undefined : row.regionId,
      })}
      className={cn(
        'group/link -my-2.5 flex items-center justify-center gap-1 px-3 py-2.5 font-medium text-[#0271FF]',
        row.isSummary && 'font-bold'
      )}
    >
      <span className="underline-offset-2 group-hover/link:underline">{value}</span>
      <ExternalLink className="size-3 shrink-0" />
    </Link>
  )
}

const RegistryDeregistrationsReport: React.FC = () => {
  const { data: reportData, isLoading } = useData<RegionDeregistrations[]>('/reports/change/by-deregister', true)

  const tableData = useMemo(() => {
    if (!reportData) return []

    return reportData.map(
      (item): Row => ({
        officeName: item.regionName,
        regionId: item.regionId,
        isSummary: isCountryTotal(item.regionName),
        x: toGroup(item.hf),
        q: toGroup(item.equipment),
        irs: toGroup(item.irs),
        xray: toGroup(item.xray),
      })
    )
  }, [reportData])

  const createGroup = (prefix: GroupKey, header: string): ExtendedColumnDef<Row, number> => ({
    header,
    columns: (
      [
        ['total', 'Umumiy', REPORT_CHANGE_STATUS.ALL],
        ['not_completed', 'Yangi', REPORT_CHANGE_STATUS.NEW],
        ['in_process', 'Jarayonda', REPORT_CHANGE_STATUS.IN_PROCESS],
        ['completed', 'Yakunlandi', REPORT_CHANGE_STATUS.COMPLETED],
      ] as const
    ).map(
      ([key, label, status]): ExtendedColumnDef<Row, number> => ({
        id: `${prefix}_${key}`,
        header: label,
        accessorFn: (row) => row[prefix]?.[key] || 0,
        className: cn('text-center', key === 'total' && 'font-semibold text-slate-900'),
        cell: ({ row, getValue }) => (
          <CountCell row={row.original} value={getValue()} prefix={prefix} status={status} />
        ),
      })
    ),
  })

  const columns: ExtendedColumnDef<Row, number>[] = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      id: 'officeName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }) => {
        const value = row.original.officeName
        const isSummary = row.original.isSummary
        return <span className={cn(isSummary ? 'font-bold' : '')}>{isSummary ? 'Respublika bo‘yicha' : value}</span>
      },
    },
    createGroup('x', 'XICHO'),
    createGroup('q', 'Qurilmalar'),
    createGroup('irs', 'INM'),
    createGroup('xray', 'Rentgen'),
  ]

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <GoBack title="Inspektorlar tomonidan reyestrdan chiqarish so‘rovlari bo‘yicha hisobot" />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          initialState={{
            columnPinning: {
              left: ['officeName'],
            },
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default RegistryDeregistrationsReport
