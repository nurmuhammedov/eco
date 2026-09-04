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
  const { data, isLoading } = usePaginatedData<any>('/reports/appeal-type', {
    ...paramsObject,
    ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
  })

  const handleTabChange = (value: string) => {
    addParams({ ownerType: value })
  }

  function calcPercent(value: number, total: number): string {
    if (!total || total === 0) return '0.00%'
    return ((value / total) * 100).toFixed(2) + '%'
  }

  const inspections: any = data as unknown as any

  const totals = React.useMemo(() => {
    const initialTotals = {
      total: 0,
      karakalpakstan: 0,
      andijan: 0,
      bukhara: 0,
      jizzakh: 0,
      kashkadarya: 0,
      navoi: 0,
      namangan: 0,
      samarkand: 0,
      syrdarya: 0,
      surkhandarya: 0,
      tashkent: 0,
      tashkentRegion: 0,
      fergana: 0,
      khorezm: 0,
    }

    if (!inspections || inspections?.length === 0) {
      return initialTotals
    }

    return inspections?.reduce(
      (acc: any, currentItem: any) => {
        for (const key in initialTotals) {
          if (Object.prototype.hasOwnProperty.call(initialTotals, key)) {
            acc[key as keyof typeof initialTotals] += currentItem[key] || 0
          }
        }
        return acc
      },
      { ...initialTotals }
    )
  }, [inspections])

  const tableData = React.useMemo(() => {
    if (!inspections) return []
    const summaryRow = {
      isSummary: true,
      appealType: 'Respublika bo‘yicha',
      ...totals,
    }
    return [summaryRow, ...inspections]
  }, [inspections, totals])

  const regionConfigs = [
    { header: "Qoraqalpog'iston XB", key: 'karakalpakstan' },
    { header: 'Andijon XB', key: 'andijan' },
    { header: 'Buxoro XB', key: 'bukhara' },
    { header: 'Jizzax XB', key: 'jizzakh' },
    { header: 'Qashqadaryo XB', key: 'kashkadarya' },
    { header: 'Navoiy XB', key: 'navoi' },
    { header: 'Namangan XB', key: 'namangan' },
    { header: 'Samarqand XBQ', key: 'samarkand' },
    { header: 'Sirdaryo XB', key: 'syrdarya' },
    { header: 'Surxondaryo XB', key: 'surkhandarya' },
    { header: 'Toshkent viloyati', key: 'tashkentRegion' },
    { header: 'Toshkent shahar (KSH)', key: 'tashkent' },
    { header: "Farg'ona XB", key: 'fergana' },
    { header: 'Xorazm XB', key: 'khorezm' },
  ]

  const columns = [
    {
      header: 'Ariza turi',
      accessorKey: 'appealType',
      id: 'appealType',
      minSize: 350,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.appealType}</span>
      ),
    },
    {
      header: 'Jami',
      columns: [
        {
          header: 'dona',
          className: 'text-center',
          accessorKey: 'total',
          size: 70,
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.total}</span>
          ),
        },
        {
          header: '%',
          className: 'text-center',
          size: 70,
          cell: ({ row }: any) => calcPercent(row.original.total, totals.total),
        },
      ],
    },
    ...regionConfigs.map((region) => ({
      header: region.header,
      columns: [
        {
          header: 'dona',
          className: 'text-center',
          accessorKey: region.key,
          size: 70,
          cell: ({ row }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[region.key]}</span>
          ),
        },
        {
          header: '%',
          className: 'text-center',
          size: 70,
          cell: ({ row }: any) => calcPercent(row.original[region.key], totals[region.key as keyof typeof totals]),
        },
      ],
    })),
  ]

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {/* The row wraps as a whole rather than inside the control group, so a
          long title never strands the export button on a line of its own. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <GoBack title="Jismoniy va yuridik shaxslardan yuborilgan arizalarni turlari bo‘yicha hududlar kesimida taqsimlanishi" />
        <div className="flex items-center gap-2 max-xl:w-full max-xl:flex-wrap">
          <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />
          <ExportExcelButton
            endpoint={'/reports/appeal-type/export-excel'}
            params={{ ...paramsObject, ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL }}
            fileName={
              'Jismoniy va yuridik shaxslardan yuborilgan arizalarni turlari bo‘yicha hududlar kesimida taqsimlanishi'
            }
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
          initialState={{ columnPinning: { left: ['appealType'] } }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default Report1
