import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'

const Report6: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: regionsData, isLoading: regionsLoading } = useData<any[]>('/regions/select', true, {
    ...paramsObject,
  })

  const tableData = React.useMemo(() => {
    if (!regionsData) return []

    const mockRow = (officeName: string, isSummary = false) => {
      const getRandom = (max: number) => Math.floor(Math.random() * max)

      const victimsCount = getRandom(20)
      const death = getRandom(victimsCount / 3)
      const heavy = getRandom((victimsCount - death) / 2)
      const light = victimsCount - death - heavy
      const group = getRandom(5)

      return {
        officeName,
        isSummary,
        total: 20 + getRandom(50),
        new: getRandom(10),
        orderCreated: getRandom(15),
        inProcess: getRandom(15),
        completed: getRandom(20),
        victimsCount,
        light,
        heavy,
        death,
        group,
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
          className: 'text-center',
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
            <span className={row.original.isSummary ? 'font-bold font-medium' : ''}>{getValue()}</span>
          ),
        },
      ],
    },
    {
      header: 'Sodir bo‘lgan baxtsiz hodisa oqibati',
      columns: [
        {
          header: 'Jabrlanuvchilar soni',
          accessorFn: (row: any) => row.victimsCount,
          className: 'text-center font-bold text-slate-900',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Yengil',
          accessorFn: (row: any) => row.light,
          className: 'text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Og‘ir',
          accessorFn: (row: any) => row.heavy,
          className: 'text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'O‘lim',
          accessorFn: (row: any) => row.death,
          className: 'text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold font-medium' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Guruhiy',
          accessorFn: (row: any) => row.group,
          className: 'text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
      ],
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

export default Report6
