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

const BELONG_TYPE_BY_PREFIX: Record<string, ReportChangeBelongType> = {
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
  row: any
  value: number
  prefix: string
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

const Report9: React.FC = () => {
  const { data: reportData, isLoading } = useData<any[]>('/reports/change/by-deregister', true)

  const tableData = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) return []

    return reportData.map((item: any) => {
      const hf = item.hf || {}
      const equipment = item.equipment || {}
      const irs = item.irs || {}
      const xray = item.xray || {}

      return {
        officeName: item.regionName,
        regionId: item.regionId,
        isSummary:
          item.regionName?.toLowerCase().includes("bo'yicha") || item.regionName?.toLowerCase().includes('bo‘yicha'),
        x: {
          total: hf.allCount || 0,
          not_completed: hf.newCount || 0,
          in_process: hf.inProcessCount || 0,
          completed: hf.completedCount || 0,
        },
        q: {
          total: equipment.allCount || 0,
          not_completed: equipment.newCount || 0,
          in_process: equipment.inProcessCount || 0,
          completed: equipment.completedCount || 0,
        },
        irs: {
          total: irs.allCount || 0,
          not_completed: irs.newCount || 0,
          in_process: irs.inProcessCount || 0,
          completed: irs.completedCount || 0,
        },
        xray: {
          total: xray.allCount || 0,
          not_completed: xray.newCount || 0,
          in_process: xray.inProcessCount || 0,
          completed: xray.completedCount || 0,
        },
      }
    })
  }, [reportData])

  const createGroup = (prefix: string, header: string) => ({
    header,
    columns: (
      [
        ['total', 'Umumiy', REPORT_CHANGE_STATUS.ALL],
        ['not_completed', 'Yangi', REPORT_CHANGE_STATUS.NEW],
        ['in_process', 'Jarayonda', REPORT_CHANGE_STATUS.IN_PROCESS],
        ['completed', 'Yakunlandi', REPORT_CHANGE_STATUS.COMPLETED],
      ] as const
    ).map(([key, label, status]) => ({
      id: `${prefix}_${key}`,
      header: label,
      accessorFn: (row: any) => row[prefix]?.[key] || 0,
      className: cn('text-center', key === 'total' && 'font-semibold text-slate-900'),
      cell: ({ row, getValue }: any) => (
        <CountCell row={row.original} value={getValue()} prefix={prefix} status={status} />
      ),
    })),
  })

  const columns = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      id: 'officeName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }: any) => {
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
          columns={columns as any}
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

export default Report9
