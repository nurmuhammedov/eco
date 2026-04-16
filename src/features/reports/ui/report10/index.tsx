import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import Filter from '@/shared/components/common/filter'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'

const Report10: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: regionsData, isLoading: regionsLoading } = useData<any[]>('/regions/select', true, {
    ...paramsObject,
  })

  const tableData = useMemo(() => {
    if (!regionsData) return []

    const mockRow = (officeName: string, isSummary = false) => {
      const getRandom = (max: number) => Math.floor(Math.random() * max)
      const generateGroup = () => {
        const v1 = getRandom(10)
        const v2 = getRandom(10)
        const v3 = getRandom(10)
        const v4 = getRandom(10)
        const v5 = getRandom(10)
        return {
          '5': v1,
          '10': v2,
          '15': v3,
          '30': v4,
          more: v5,
          total: v1 + v2 + v3 + v4 + v5,
        }
      }

      const y = generateGroup()
      const j = generateGroup()
      const k = generateGroup()
      const t = generateGroup()
      const u = {
        '5': y['5'] + j['5'] + k['5'] + t['5'],
        '10': y['10'] + j['10'] + k['10'] + t['10'],
        '15': y['15'] + j['15'] + k['15'] + t['15'],
        '30': y['30'] + j['30'] + k['30'] + t['30'],
        more: y.more + j.more + k.more + t.more,
        total: y.total + j.total + k.total + t.total,
      }

      return {
        officeName,
        isSummary,
        y,
        j,
        k,
        t,
        u,
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
        header: '5 kungacha',
        accessorFn: (row: any) => row[prefix]['5'] || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: '5-10 kun',
        accessorFn: (row: any) => row[prefix]['10'] || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: '10-15 kun',
        accessorFn: (row: any) => row[prefix]['15'] || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: '15-30 kun',
        accessorFn: (row: any) => row[prefix]['30'] || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: '30 kundan ortiq',
        accessorFn: (row: any) => row[prefix].more || 0,
        className: 'text-center whitespace-nowrap',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold font-medium decoration-red-500/30' : ''}>
            {getValue()}
          </span>
        ),
      },
      {
        header: 'Jami',
        accessorFn: (row: any) => row[prefix].total || 0,
        className: 'text-center font-semibold text-slate-900',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
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
    createGroup('y', 'Yangi'),
    createGroup('j', 'Jarayonda'),
    createGroup('k', 'Kelishishda'),
    createGroup('t', 'Tasdiqlashda'),
    createGroup('u', 'Umumiy'),
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Arizalarning ijro muddati bo‘yicha umumiy hisobot" />
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

export default Report10
