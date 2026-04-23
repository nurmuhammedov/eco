import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'

const Report8: React.FC = () => {
  const { data: reportData, isLoading } = useData<any[]>('/reports/change/by-update', true)

  const tableData = useMemo(() => {
    if (!reportData || !Array.isArray(reportData)) return []

    console.log(reportData, 'reportData')

    return reportData.map((item: any) => {
      const hf = item.hf || {}
      const equipment = item.equipment || {}
      // const irs = item.irs || {}
      // const xray = item.xray || {}

      return {
        officeName: item.regionName,
        isSummary:
          item.regionName?.toLowerCase().includes("bo'yicha") || item.regionName?.toLowerCase().includes('bo‘yicha'),
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
        // irs: {
        //   total: irs.allCount || 0,
        //   entrepreneur: irs.legalCount || 0,
        //   inspector: irs.inspectorCount || 0,
        //   not_completed: irs.newCount || 0,
        //   in_process: irs.inProcessCount || 0,
        //   completed: irs.completedCount || 0,
        // },
        // xray: {
        //   total: xray.allCount || 0,
        //   entrepreneur: xray.legalCount || 0,
        //   inspector: xray.inspectorCount || 0,
        //   not_completed: xray.newCount || 0,
        //   in_process: xray.inProcessCount || 0,
        //   completed: xray.completedCount || 0,
        // },
      }
    })
  }, [reportData])

  const createGroup = (prefix: string, header: string) => ({
    header,
    columns: [
      {
        id: `${prefix}_total`,
        header: 'Umumiy',
        accessorFn: (row: any) => row[prefix]?.total || 0,
        className: 'text-center font-semibold text-slate-900',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_entrepreneur`,
        header: 'Tadbirkor tomonidan so‘rovlar',
        accessorFn: (row: any) => row[prefix]?.entrepreneur || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_inspector`,
        header: 'Inspektor tomonidan so‘rovlar',
        accessorFn: (row: any) => row[prefix]?.inspector || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_not_completed`,
        header: 'Amal bajarilmaganlar',
        accessorFn: (row: any) => row[prefix]?.not_completed || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold decoration-red-500/30' : ''}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_in_process`,
        header: 'Jarayonda',
        accessorFn: (row: any) => row[prefix]?.in_process || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        id: `${prefix}_completed`,
        header: 'Yakunlandi',
        accessorFn: (row: any) => row[prefix]?.completed || 0,
        className: 'text-center',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold decoration-emerald-500/30' : ''}>{getValue()}</span>
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
        const isSummary = row.original.isSummary
        return <span className={cn(isSummary ? 'font-bold' : '')}>{isSummary ? 'Respublika bo‘yicha' : value}</span>
      },
    },
    createGroup('x', 'XICHO'),
    createGroup('q', 'Qurilmalar'),
    // createGroup('irs', 'INMlar'),
    // createGroup('xray', 'Rentgenlar'),
  ]

  useData('/reports/hf-employee')
  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="O‘zgarishlar bo‘yicha hisobot" />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
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

export default Report8
