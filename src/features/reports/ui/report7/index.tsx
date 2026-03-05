import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { GoBack } from '@/shared/components/common'

const Report7: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: inspections, isLoading } = usePaginatedData('/reports/registry', {
    ...paramsObject,
    ownerType: 'INDIVIDUAL',
  })

  const tableData = React.useMemo(() => {
    if (!inspections) return []
    const list = (inspections as unknown as any[]) || []

    // Map to 0s for now, as requested
    const formattedList = list.map((item) => ({
      officeName: item.regionName,
      total: 0,
      new: 0,
      orderCreated: 0,
      inProcess: 0,
      completed: 0,
      economicDamage: 0,
    }))

    const summaryRow = {
      isSummary: true,
      officeName: 'Respublika bo‘yicha',
      total: 0,
      new: 0,
      orderCreated: 0,
      inProcess: 0,
      completed: 0,
      economicDamage: 0,
    }

    return [summaryRow, ...formattedList]
  }, [inspections])

  const columns: ColumnDef<any>[] = [
    {
      header: 'Hududlar',
      accessorKey: 'officeName',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.officeName}</span>
      ),
    },
    {
      header: 'Holati',
      columns: [
        {
          header: 'Umumiy',
          accessorKey: 'total',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.total}</span>
          ),
        },
        {
          header: 'Yangi',
          accessorKey: 'new',
          cell: ({ row }: any) => <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.new}</span>,
        },
        {
          header: 'Buyruq shakillangan',
          accessorKey: 'orderCreated',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.orderCreated}</span>
          ),
        },
        {
          header: 'Jarayonda',
          accessorKey: 'inProcess',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.inProcess}</span>
          ),
        },
        {
          header: 'Yakunlangan',
          accessorKey: 'completed',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.completed}</span>
          ),
        },
      ],
    },
    {
      header: 'Avariyadan ko‘rilgan iqtisodiy zarar',
      accessorKey: 'economicDamage',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.economicDamage}</span>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <GoBack title="Avariyalar bo‘yicha umumiy hisobot" />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <DataTable
            showNumeration={false}
            headerCenter={true}
            data={tableData}
            columns={columns as unknown as any}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Report7
