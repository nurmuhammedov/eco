import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData } from '@/shared/hooks'
import { ExportExcelButton, GoBack } from '@/shared/components/common'
import { format } from 'date-fns'

export enum InspectionStatus {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

const Report3: React.FC = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: inspections, isLoading } = usePaginatedData<any>('/reports/registry', {
    ...paramsObject,
    ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
  })

  function calcPercent(value: number, total: number): string {
    if (!total || total === 0) return '0%'
    return parseFloat(((value / total) * 100).toFixed(2)) + '%'
  }

  const data: any = inspections as unknown as any
  const totals = React.useMemo(() => {
    const initialTotals = {
      activeHf: 0,
      inactiveHf: 0,
      activeEquipment: 0,
      inactiveEquipment: 0,
      expiredEquipment: 0,
      noDateEquipment: 0,
      activeIrs: 0,
      inactiveIrs: 0,
    }

    if (!data || data.length === 0) {
      return initialTotals
    }

    return data.reduce(
      (acc: any, currentItem: any) => {
        for (const key in initialTotals) {
          acc[key as keyof typeof initialTotals] += currentItem[key] || 0
        }
        return acc
      },
      { ...initialTotals }
    )
  }, [data])

  const tableData = React.useMemo(() => {
    if (!data) return []
    const summaryRow = {
      isSummary: true,
      regionName: 'Respublika bo‘yicha',
      ...totals,
    }
    return [summaryRow, ...data]
  }, [data, totals])

  const columns = [
    {
      header: 'Hududlar',
      accessorKey: 'regionName',
      id: 'regionName',
      minSize: 250,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.regionName}</span>
      ),
    },
    {
      header: 'XICHO',
      columns: [
        {
          header: 'Reyestrda amalda',
          columns: [
            {
              header: 'dona',
              accessorKey: 'activeHf',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.activeHf}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.activeHf, totals.activeHf),
              size: 80,
            },
          ],
        },
        {
          header: 'Reyestrdan chiqarilgan',
          columns: [
            {
              header: 'dona',
              accessorKey: 'inactiveHf',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.inactiveHf}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.inactiveHf, totals.inactiveHf),
              size: 80,
            },
          ],
        },
      ],
    },
    {
      header: 'Qurilmalar',
      columns: [
        {
          header: 'Reyestrda amalda',
          columns: [
            {
              header: 'dona',
              accessorKey: 'activeEquipment',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.activeEquipment}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.activeEquipment, totals.activeEquipment),
              size: 80,
            },
          ],
        },
        {
          header: 'Reyestrdan chiqarilgan',
          columns: [
            {
              header: 'dona',
              accessorKey: 'inactiveEquipment',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.inactiveEquipment}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.inactiveEquipment, totals.inactiveEquipment),
              size: 80,
            },
          ],
        },
        {
          header: 'Ko‘rik va ishlatish muddati o‘tgan',
          columns: [
            {
              header: 'dona',
              accessorKey: 'expiredEquipment',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.expiredEquipment}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.expiredEquipment, totals.expiredEquipment),
              size: 80,
            },
          ],
        },
        {
          header: 'Muddati kiritilmaganlar',
          columns: [
            {
              header: 'dona',
              accessorKey: 'noDateEquipment',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.noDateEquipment}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.noDateEquipment, totals.noDateEquipment),
              size: 80,
            },
          ],
        },
      ],
    },
    {
      header: 'INM',
      columns: [
        {
          header: 'Reyestrda amalda',
          columns: [
            {
              header: 'dona',
              accessorKey: 'activeIrs',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.activeIrs}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.activeIrs, totals.activeIrs),
              size: 80,
            },
          ],
        },
        {
          header: 'Reyestrdan chiqarilgan',
          columns: [
            {
              header: 'dona',
              accessorKey: 'inactiveIrs',
              size: 80,
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.inactiveIrs}</span>
              ),
            },
            {
              header: '%',
              cell: ({ row }: any) => calcPercent(row.original.inactiveIrs, totals.inactiveIrs),
              size: 80,
            },
          ],
        },
      ],
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {/* The row wraps as a whole rather than inside the control group, so a
          long title never strands the export button on a line of its own. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <GoBack
          title={
            <>
              Davlat ro‘yxatiga kiritilgan va ro‘yxatdan chiqarilgan XICHO, Qurilmalar va INMlarning hududlar kesimida
              taqsimlanishi <span className="italic">(bugungi kun holatiga)</span>
            </>
          }
        />
        <div className="flex items-center gap-2 max-xl:w-full max-xl:flex-wrap">
          <ExportExcelButton
            endpoint={'/reports/registry/export-excel'}
            params={{ date: paramsObject.endDate || format(new Date(), 'yyyy-MM-dd') }}
            fileName={
              'Davlat ro‘yxatiga kiritilgan va ro‘yxatdan chiqarilgan XICHO, Qurilmalar va INMlarning hududlar kesimida taqsimlanishi'
            }
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          data={tableData}
          columns={columns as unknown as any}
          isLoading={isLoading}
          initialState={{ columnPinning: { left: ['regionName'] } }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default Report3
