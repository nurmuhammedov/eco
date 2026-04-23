import React, { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'

const AppealExecutionReport: React.FC = () => {
  const { data: reportData, isLoading } = useData<any[]>('/reports/appeal-execution', true)

  const tableData = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) return []

    return reportData.map((item: any) => ({
      ...item,
      isSummary:
        item.regionName?.toLowerCase().includes("bo'yicha") || item.regionName?.toLowerCase().includes('bo‘yicha'),
    }))
  }, [reportData])

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Hududiy boshqarma/bo‘limlar',
        accessorKey: 'regionName',
        id: 'regionName',
        minSize: 250,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
        cell: ({ row }: any) => {
          const value = row.original.regionName
          const isSummary = row.original.isSummary
          return <span className={cn(isSummary ? 'font-bold text-gray-900' : 'text-gray-700')}>{value}</span>
        },
      },
      {
        header: '15 kungacha',
        accessorKey: 'upTo15Days',
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue() || 0}</span>
        ),
      },
      {
        header: '16-30 kun',
        accessorKey: 'from16To30Days',
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue() || 0}</span>
        ),
      },
      {
        header: '30 kundan ortiq',
        accessorKey: 'over30Days',
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold text-red-600' : 'text-red-500')}>
            {getValue() || 0}
          </span>
        ),
      },
      {
        header: 'Jami',
        accessorKey: 'total',
        className: 'text-center font-bold text-slate-900 bg-slate-50/50',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue() || 0}</span>
        ),
      },
    ],
    []
  )

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Arizalarning ijro muddati bo‘yicha umumiy hisobot" />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns}
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

export default AppealExecutionReport
