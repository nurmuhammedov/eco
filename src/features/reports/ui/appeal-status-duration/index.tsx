import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
const AppealStatusDurationReport: React.FC = () => {
  const { data: reportData, isLoading } = useData<any[]>('/reports/appeal-status/duration', true)

  const tableData = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) return []

    return reportData.map((item: any) => ({
      ...item,
      isSummary:
        item.regionName?.toLowerCase().includes("bo'yicha") || item.regionName?.toLowerCase().includes('bo‘yicha'),
    }))
  }, [reportData])

  const createGroup = (prefix: string, header: string) => ({
    header,
    columns: [
      {
        id: `${prefix}_upTo5Days`,
        header: '5 kungacha',
        accessorFn: (row: any) => row[prefix]?.upTo5Days || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_from6To15Days`,
        header: '5-15 kun',
        accessorFn: (row: any) => row[prefix]?.from6To15Days || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_over15Days`,
        header: '15 kundan ortiq',
        accessorFn: (row: any) => row[prefix]?.over15Days || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold text-red-600' : 'text-red-500')}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_total`,
        header: 'Jami',
        accessorFn: (row: any) => row[prefix]?.total || 0,
        className: 'text-center font-semibold text-slate-900 bg-slate-50/30',
        cell: ({ row, getValue }: any) => (
          <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue()}</span>
        ),
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
