import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData } from '@/shared/hooks'
import Filter from '@/shared/components/common/filter'
import { ExportExcelButton, GoBack } from '@/shared/components/common'

export enum InspectionStatus {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

const Report1: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()
  const activeTab = paramsObject.ownerType
  const { data: inspections, isLoading } = usePaginatedData('/reports/appeal-status', {
    ...paramsObject,
    ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
  })

  const handleTabChange = (value: string) => {
    addParams({ ownerType: value })
  }

  function calcPercent(value: number, total: number): string {
    if (!total || total == 0) return '0.00%'
    return ((value / total) * 100).toFixed(2) + '%'
  }

  const tableData = React.useMemo(() => {
    if (!inspections) return []
    const list = (inspections as unknown as any[]) || []
    const totals = list.reduce(
      (acc: any, curr: any) => {
        acc.total += curr.total || 0
        acc.inProcess += curr.inProcess || 0
        acc.inAgreement += curr.inAgreement || 0
        acc.inApproval += curr.inApproval || 0
        acc.completed += curr.completed || 0
        acc.rejected += curr.rejected || 0
        acc.canceled += curr.canceled || 0
        return acc
      },
      {
        total: 0,
        inProcess: 0,
        inAgreement: 0,
        inApproval: 0,
        completed: 0,
        rejected: 0,
        canceled: 0,
      }
    )

    const summaryRow = {
      isSummary: true,
      officeName: 'Respublika bo‘yicha',
      ...totals,
    }

    return [summaryRow, ...list]
  }, [inspections])

  const columns = [
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      id: 'officeName',
      minSize: 220,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.officeName}</span>
      ),
    },
    {
      header: 'Jami',
      columns: [
        {
          header: 'dona',
          className: 'text-center',
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.total}</span>
          ),
        },
        {
          header: '%',
          className: 'text-center',
          cell: ({ row }: any) => calcPercent(row.original.total, row.original.total),
        },
      ],
    },
    {
      header: 'Shu jumladan, statuslar bo‘yicha',
      columns: [
        {
          header: 'Ijroda',
          columns: [
            {
              header: 'dona',
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.inProcess}</span>
              ),
            },
            {
              header: '%',
              className: 'text-center',
              cell: ({ row }: any) => calcPercent(row.original.inProcess, row.original.total),
            },
          ],
        },
        {
          header: 'Kelishishda',
          columns: [
            {
              header: 'dona',
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.inAgreement}</span>
              ),
            },
            {
              header: '%',
              className: 'text-center',
              cell: ({ row }: any) => calcPercent(row.original.inAgreement, row.original.total),
            },
          ],
        },
        {
          header: 'Tasdiqlashda',
          columns: [
            {
              header: 'dona',
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.inApproval}</span>
              ),
            },
            {
              header: '%',
              className: 'text-center',
              cell: ({ row }: any) => calcPercent(row.original.inApproval, row.original.total),
            },
          ],
        },
        {
          header: 'Yakunlangan',
          columns: [
            {
              header: 'dona',
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.completed}</span>
              ),
            },
            {
              header: '%',
              className: 'text-center',
              cell: ({ row }: any) => calcPercent(row.original.completed, row.original.total),
            },
          ],
        },
        {
          header: 'Rad etilgan',
          columns: [
            {
              header: 'dona',
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.rejected}</span>
              ),
            },
            {
              header: '%',
              className: 'text-center',
              cell: ({ row }: any) => calcPercent(row.original.rejected, row.original.total),
            },
          ],
        },
        {
          header: 'Qaytarilgan',
          columns: [
            {
              header: 'dona',
              className: 'text-center',
              cell: ({ row }: any) => (
                <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.canceled}</span>
              ),
            },
            {
              header: '%',
              className: 'text-center',
              cell: ({ row }: any) => calcPercent(row.original.canceled, row.original.total),
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
        <GoBack title="Jismoniy va yuridik shaxslardan yuborilgan arizalarni hududlar kesimida taqsimlanishi" />
        <div className="flex items-center gap-2 max-xl:w-full max-xl:flex-wrap">
          <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />
          <ExportExcelButton
            endpoint={'/reports/appeal-status/export-excel'}
            params={{ ...paramsObject, ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL }}
            fileName={'Jismoniy va yuridik shaxslardan yuborilgan arizalarni hududlar kesimida taqsimlanishi'}
          />
        </div>
      </div>

      {/* Both tabs read the same query, keyed by ownerType - one table serves
          them, rather than two identical ones. */}
      <Tabs value={activeTab || InspectionStatus.INDIVIDUAL} onValueChange={handleTabChange}>
        <TabsList className="w-full overflow-x-auto sm:w-max">
          <TabsTrigger value={InspectionStatus.INDIVIDUAL} className="flex-1 sm:flex-none">
            Jismoniy shaxslar
          </TabsTrigger>
          <TabsTrigger value={InspectionStatus.LEGAL} className="flex-1 sm:flex-none">
            Yuridik shaxslar
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          data={tableData}
          columns={columns as unknown as any}
          isLoading={isLoading}
          initialState={{ columnPinning: { left: ['officeName'] } }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default Report1
