import React, { useMemo, useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import { useRegionSelectQuery } from '@/entities/admin/districts'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

const MONTHS = [
  { value: 'JANUARY', label: 'Yanvar' },
  { value: 'FEBRUARY', label: 'Fevral' },
  { value: 'MARCH', label: 'Mart' },
  { value: 'APRIL', label: 'Aprel' },
  { value: 'MAY', label: 'May' },
  { value: 'JUNE', label: 'Iyun' },
  { value: 'JULY', label: 'Iyul' },
  { value: 'AUGUST', label: 'Avgust' },
  { value: 'SEPTEMBER', label: 'Sentabr' },
  { value: 'OCTOBER', label: 'Oktabr' },
  { value: 'NOVEMBER', label: 'Noyabr' },
  { value: 'DECEMBER', label: 'Dekabr' },
]

const currentYear = new Date().getFullYear()
const currentMonthNumber = new Date().getMonth() + 1
const defaultMonthValue = currentMonthNumber === 1 ? 'DECEMBER' : MONTHS[currentMonthNumber - 2].value
const defaultYearValue = currentMonthNumber === 1 ? (currentYear - 1).toString() : currentYear.toString()

const generateYears = () => {
  const years = []
  for (let i = 2025; i <= currentYear; i++) {
    years.push(i)
  }
  return years
}

const InspectionStatsReport: React.FC = () => {
  const [year, setYear] = useState<string>(defaultYearValue)
  const [month, setMonth] = useState<string>(defaultMonthValue)
  const [regionName, setRegionName] = useState<string>('ALL')

  const { data: regionsList } = useRegionSelectQuery()

  const { data: rawData, isLoading } = useData<any[]>('/reports/inspection', true, {
    year: Number(year),
    month,
  })

  const tableData = useMemo(() => {
    if (!rawData) return []
    const isSummary = (name: string) => {
      const lower = name?.toLowerCase()
      return lower === 'respublika' || lower === 'respublika bo‘yicha' || lower === "respublika bo'yicha"
    }

    const regions = rawData.filter((r) => !isSummary(r.regionName))
    const backendSummary = rawData.find((r) => isSummary(r.regionName))

    const summaryRow = {
      ...(backendSummary || {}),
      regionName: 'Respublika bo‘yicha',
      isSummary: true,
    }

    let filteredRegions = regions
    if (regionName !== 'ALL' && regionName !== 'Respublika bo‘yicha') {
      filteredRegions = regions.filter((r) => r.regionName === regionName)
    } else if (regionName === 'Respublika bo‘yicha') {
      filteredRegions = []
    }

    return [summaryRow, ...filteredRegions]
  }, [rawData, regionName])

  const createSectionColumns = (header: string, accessorPrefix: string) => ({
    header,
    id: accessorPrefix,
    columns: [
      {
        header: 'Barchasi',
        id: `${accessorPrefix}_allCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.allCount || 0,
        className: 'text-center text-slate-900',
        cell: ({ row, getValue }: any) => {
          return <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Buyruq qilinmagan',
        id: `${accessorPrefix}_newCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.newCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }: any) => {
          return <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Buyruq imzolanish jarayonida',
        id: `${accessorPrefix}_notSignedCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.notSignedCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }: any) => {
          return <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Inspektor biriktirilgan',
        id: `${accessorPrefix}_assignedCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.assignedCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }: any) => {
          return <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Tekshiruv o‘tkazilgan',
        id: `${accessorPrefix}_conductedCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.conductedCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }: any) => {
          return <span className={cn('text-green-600', row.original.isSummary ? 'font-bold' : '')}>{getValue()}</span>
        },
      },
    ],
  })

  const columns: any[] = [
    {
      header: 'Hududlar',
      accessorKey: 'regionName',
      id: 'regionName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
      cell: ({ row }: any) => {
        const value = row.original.regionName
        return <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{value}</span>
      },
    },
    createSectionColumns('XICHO', 'hf'),
    createSectionColumns('INM', 'irs'),
    createSectionColumns('Lift', 'elevator'),
    createSectionColumns('Attraksion', 'attraction'),
    createSectionColumns('Rentgen', 'xray'),
    createSectionColumns('Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma', 'lpgPowered'),
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 p-0.5 xl:flex-row xl:items-center">
        <GoBack title="Tekshiruv holati bo‘yicha" />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={year} onValueChange={(val) => setYear(val)}>
            <SelectTrigger className="h-10 w-[120px] bg-white text-sm">
              <SelectValue placeholder="Yilni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {generateYears().map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full bg-white md:w-[200px]">
              <SelectValue placeholder="Oyni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={regionName} onValueChange={(val) => setRegionName(val)}>
            <SelectTrigger className="h-10 w-[220px] bg-white text-sm">
              <SelectValue placeholder="Hududni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              <SelectItem value="Respublika bo‘yicha">Respublika bo‘yicha</SelectItem>
              {regionsList?.map((region: any) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
          data={tableData || []}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          initialState={{
            columnPinning: {
              left: ['regionName'],
            },
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default InspectionStatsReport
