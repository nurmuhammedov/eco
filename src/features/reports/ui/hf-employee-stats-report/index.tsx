import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import { isCountryTotal } from '../../lib/country-total'
import type { ExtendedColumnDef } from '@/shared/components/common/data-table/model/column-def'

/** ReportByHfEmployee */
interface RegionEmployees {
  regionName: string
  managerCount: number
  engineerCount: number
  workerCount: number
}

type Row = Omit<RegionEmployees, 'regionName'> & { officeName: string; isSummary: boolean }

const ReportHfEmployeeStats: React.FC = () => {
  const { data: reportData, isLoading } = useData<RegionEmployees[]>('/reports/hf-employee', true)

  const tableData = useMemo(() => {
    if (!reportData) return []

    return reportData.map(
      (item): Row => ({
        officeName: item.regionName,
        isSummary: isCountryTotal(item.regionName),
        managerCount: item.managerCount || 0,
        engineerCount: item.engineerCount || 0,
        workerCount: item.workerCount || 0,
      })
    )
  }, [reportData])

  const columns: ExtendedColumnDef<Row, number>[] = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      id: 'officeName',
      maxSize: 120,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }) => {
        const value = row.original.officeName
        const isSummary = row.original.isSummary
        return <span className={cn(isSummary ? 'font-bold' : '')}>{isSummary ? 'Respublika bo‘yicha' : value}</span>
      },
    },
    {
      id: 'managerCount',
      header: 'Rahbar xodimlar soni',
      accessorKey: 'managerCount',
      className: 'text-center',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
    },
    {
      id: 'engineerCount',
      header: 'Muhandis-texnik xodimlar soni',
      accessorKey: 'engineerCount',
      className: 'text-center',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
    },
    {
      id: 'workerCount',
      header: 'Oddiy ishchi xodimlar soni',
      accessorKey: 'workerCount',
      className: 'text-center',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="XICHOlarda ishchi xodimlari bo‘yicha statistika" />
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

export default ReportHfEmployeeStats
