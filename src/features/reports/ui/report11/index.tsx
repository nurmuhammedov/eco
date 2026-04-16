import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import Filter from '@/shared/components/common/filter'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'

const Report11: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: regionsData, isLoading: regionsLoading } = useData<any[]>('/regions/select', true, {
    ...paramsObject,
  })

  const tableData = useMemo(() => {
    if (!regionsData) return []

    const mockRow = (officeName: string, isSummary = false) => {
      const getRandom = (max: number) => Math.floor(Math.random() * max)
      const generateGroup = () => {
        const total = 10 + getRandom(20)
        const completed = getRandom(total / 2)
        const inProcess = getRandom(total / 3)
        const notCompleted = total - completed - inProcess

        return {
          total,
          not_completed: notCompleted,
          in_process: inProcess,
          completed,
        }
      }

      return {
        officeName,
        isSummary,
        x: generateGroup(),
        q: generateGroup(),
      }
    }

    const summaryRow = mockRow('Respublika bo‘yicha', true)
    const filteredRegions = regionsData.filter(
      (r) => !r.nameUz?.toLowerCase().includes('respublika') && !r.name?.toLowerCase().includes('respublika')
    )
    const list = filteredRegions.map((r) => mockRow(r.nameUz || r.name))

    return [summaryRow, ...list]
  }, [regionsData])

  const createGroup = (prefix: string, header: string) => ({
    header,
    columns: [
      {
        header: 'Umumiy',
        accessorFn: (row: any) => row[prefix].total || 0,
        className: 'text-center font-semibold text-slate-900',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Amal bajarilmaganlar',
        accessorFn: (row: any) => row[prefix].not_completed || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold underline decoration-red-500/30' : ''}>
            {getValue()}
          </span>
        ),
      },
      {
        header: 'Jarayonda',
        accessorFn: (row: any) => row[prefix].in_process || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Yakunlandi',
        accessorFn: (row: any) => row[prefix].completed || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold underline decoration-emerald-500/30' : ''}>
            {getValue()}
          </span>
        ),
      },
    ],
  })

  const columns = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
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
    createGroup('x', 'XICHO'),
    createGroup('q', 'Qurilmalar'),
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Hududiy boshqarma tomonidan reyestrga kiritish bo‘yicha hisobot" />
        <div className="w-full sm:w-auto">
          <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />
        </div>
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

export default Report11
