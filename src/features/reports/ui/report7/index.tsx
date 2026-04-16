import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'

const Report7: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: regionsData, isLoading: regionsLoading } = useData<any[]>('/regions/select', true, {
    ...paramsObject,
  })

  const tableData = React.useMemo(() => {
    if (!regionsData) return []

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

    const summaryRow = mockRow('Respublika bo‘yicha', true)
    const filteredRegions = regionsData.filter(
      (r) => !r.nameUz?.toLowerCase().includes('respublika') && !r.name?.toLowerCase().includes('respublika')
    )
    const list = filteredRegions.map((r) => mockRow(r.nameUz || r.name))

    return [summaryRow, ...list]
  }, [regionsData])

  const columns = [
    {
      header: 'Hududlar',
      accessorKey: 'officeName',
      id: 'officeName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
      cell: ({ row }: any) => {
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
          accessorFn: (row: any) => row.total,
          className: 'text-center font-semibold text-slate-900',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Yangi',
          accessorFn: (row: any) => row.new,
          className: 'text-center font-medium',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Buyruq shakillangan',
          accessorFn: (row: any) => row.orderCreated,
          className: 'text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Jarayonda',
          accessorFn: (row: any) => row.inProcess,
          className: 'text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Yakunlangan',
          accessorFn: (row: any) => row.completed,
          className: 'text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
      ],
    },
    {
      header: 'Avariyadan ko‘rilgan iqtisodiy zarar',
      accessorFn: (row: any) => row.economicDamage,
      className: 'text-center font-bold',
      cell: ({ row, getValue }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()} mln.</span>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Avariyalar bo‘yicha umumiy hisobot" />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
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

export default Report7
