import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import { isCountryTotal } from '../../lib/country-total'
import type { ExtendedColumnDef } from '@/shared/components/common/data-table/model/column-def'

/** ChangeUpdateByReport */
interface UpdateCounts {
  allCount: number
  legalCount: number
  inspectorCount: number
  newCount: number
  inProcessCount: number
  completedCount: number
}

/** ReportByChangeUpdateDto */
interface RegionChanges {
  regionName: string
  hf: UpdateCounts | null
  equipment: UpdateCounts | null
  irs: UpdateCounts | null
  xray: UpdateCounts | null
}

interface GroupCounts {
  total: number
  entrepreneur: number
  inspector: number
  not_completed: number
  in_process: number
  completed: number
}

type GroupKey = 'x' | 'q'

type Row = { officeName: string; isSummary: boolean } & Record<GroupKey, GroupCounts>

const RegistryChangesReport: React.FC = () => {
  const { data: reportData, isLoading } = useData<RegionChanges[]>('/reports/change/by-update', true)

  const tableData = useMemo(() => {
    if (!reportData) return []

    return reportData.map((item): Row => {
      const hf: Partial<UpdateCounts> = item.hf ?? {}
      const equipment: Partial<UpdateCounts> = item.equipment ?? {}

      return {
        officeName: item.regionName,
        isSummary: isCountryTotal(item.regionName),
        x: {
          total: hf.allCount || 0,
          entrepreneur: hf.legalCount || 0,
          inspector: hf.inspectorCount || 0,
          not_completed: hf.newCount || 0,
          in_process: hf.inProcessCount || 0,
          completed: hf.completedCount || 0,
        },
        q: {
          total: equipment.allCount || 0,
          entrepreneur: equipment.legalCount || 0,
          inspector: equipment.inspectorCount || 0,
          not_completed: equipment.newCount || 0,
          in_process: equipment.inProcessCount || 0,
          completed: equipment.completedCount || 0,
        },
      }
    })
  }, [reportData])

  const createGroup = (prefix: GroupKey, header: string): ExtendedColumnDef<Row, number> => ({
    header,
    columns: [
      {
        id: `${prefix}_total`,
        header: 'Umumiy',
        accessorFn: (row) => row[prefix]?.total || 0,
        className: 'text-center font-semibold text-slate-900',
        cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
      },
      {
        id: `${prefix}_entrepreneur`,
        header: 'Tadbirkor tomonidan so‘rovlar',
        accessorFn: (row) => row[prefix]?.entrepreneur || 0,
        className: 'text-center',
        cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
      },
      {
        id: `${prefix}_inspector`,
        header: 'Inspektor tomonidan so‘rovlar',
        accessorFn: (row) => row[prefix]?.inspector || 0,
        className: 'text-center',
        cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
      },
      {
        id: `${prefix}_not_completed`,
        header: 'Amal bajarilmaganlar',
        accessorFn: (row) => row[prefix]?.not_completed || 0,
        className: 'text-center',
        cell: ({ row, getValue }) => (
          <span className={row.original.isSummary ? 'font-bold decoration-red-500/30' : ''}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_in_process`,
        header: 'Jarayonda',
        accessorFn: (row) => row[prefix]?.in_process || 0,
        className: 'text-center',
        cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
      },
      {
        id: `${prefix}_completed`,
        header: 'Yakunlandi',
        accessorFn: (row) => row[prefix]?.completed || 0,
        className: 'text-center',
        cell: ({ row, getValue }) => (
          <span className={row.original.isSummary ? 'font-bold decoration-emerald-500/30' : ''}>{getValue()}</span>
        ),
      },
    ],
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
  ]

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <GoBack title="Reyestr ma’lumotlarini o‘zgartirish so‘rovlari bo‘yicha hisobot" />
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

export default RegistryChangesReport
