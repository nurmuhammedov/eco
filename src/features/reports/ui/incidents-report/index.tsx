import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import type { ExtendedColumnDef } from '@/shared/components/common/data-table/model/column-def'

type RegionOption = { id: number; name: string }

const mockRow = (officeName: string, isSummary = false) => {
  const getRandom = (max: number) => Math.floor(Math.random() * max)

  return {
    officeName,
    isSummary,
    total: 10 + getRandom(30),
    new: getRandom(5),
    orderCreated: getRandom(10),
    inProcess: getRandom(10),
    completed: getRandom(10),
    economicDamage: 50 + getRandom(500),
  }
}

type Row = ReturnType<typeof mockRow>

const IncidentsReport: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: regionsData, isLoading: regionsLoading } = useData<RegionOption[]>('/regions/select', true, {
    ...paramsObject,
  })

  const tableData = React.useMemo(() => {
    if (!regionsData) return []

    const summaryRow = mockRow('Respublika bo‘yicha', true)
    const filteredRegions = regionsData.filter((r) => !r.name.toLowerCase().includes('respublika'))
    const list = filteredRegions.map((r) => mockRow(r.name))

    return [summaryRow, ...list]
  }, [regionsData])

  const columns: ExtendedColumnDef<Row, number>[] = [
    {
      header: 'Hududlar',
      accessorKey: 'officeName',
      id: 'officeName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }) => {
        const value = row.original.officeName
        const isRespublika = value?.toLowerCase().includes('respublika')
        return (
          <span className={cn(row.original.isSummary || isRespublika ? 'font-bold' : '')}>
            {isRespublika ? 'Respublika bo‘yicha' : value}
          </span>
        )
      },
    },
    {
      header: 'Holati',
      columns: [
        {
          header: 'Umumiy',
          accessorFn: (row) => row.total,
          className: 'text-center font-semibold text-slate-900',
          cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
        },
        {
          header: 'Yangi',
          accessorFn: (row) => row.new,
          className: 'text-center font-medium',
          cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
        },
        {
          header: 'Buyruq shakillangan',
          accessorFn: (row) => row.orderCreated,
          className: 'text-center',
          cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
        },
        {
          header: 'Jarayonda',
          accessorFn: (row) => row.inProcess,
          className: 'text-center',
          cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
        },
        {
          header: 'Yakunlangan',
          accessorFn: (row) => row.completed,
          className: 'text-center',
          cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>,
        },
      ],
    },
    {
      header: 'Avariyadan ko‘rilgan iqtisodiy zarar',
      accessorFn: (row) => row.economicDamage,
      className: 'text-center font-bold',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()} mln.</span>,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Avariyalar bo‘yicha umumiy hisobot" />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={regionsLoading}
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

export default IncidentsReport
