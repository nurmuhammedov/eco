import React, { useMemo, useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
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
const currentMonthNames = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
]
const currentMonth = currentMonthNames[new Date().getMonth()]

const generateYears = () => {
  const years = []
  for (let i = 2025; i <= currentYear; i++) {
    years.push(i)
  }
  return years
}

const PreventionStatsReport: React.FC = () => {
  const [year, setYear] = useState<string>(currentYear.toString())
  const [month, setMonth] = useState<string>(currentMonth)

  const { data: rawData, isLoading } = useData<any[]>('/reports/prevention', true, {
    year: Number(year),
    month,
  })

  const tableData = useMemo(() => {
    if (!rawData) return []
    const regions = rawData.filter((r) => !r.regionName?.toLowerCase().includes('respublika'))
    const backendSummary = rawData.find((r) => r.regionName?.toLowerCase().includes('respublika'))

    const summaryRow = {
      ...(backendSummary || {}),
      regionName: 'Respublika bo‘yicha',
      isSummary: true,
    }

    return [summaryRow, ...regions]
  }, [rawData])

  const createSectionColumns = (header: string, accessorPrefix: string) => ({
    header,
    id: accessorPrefix,
    columns: [
      {
        header: 'Barchasi',
        id: `${accessorPrefix}_allCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.allCount || 0,
        className: 'text-center text-slate-900',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Inspektor belgilanmagan',
        id: `${accessorPrefix}_unassignedCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.unassignedCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Jarayondagilar',
        id: `${accessorPrefix}_processCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.processCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Yakunlangan',
        id: `${accessorPrefix}_conductedCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.conductedCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
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
        const isRespublika = value?.toLowerCase().includes('respublika')
        return (
          <span className={cn(row.original.isSummary || isRespublika ? 'font-bold' : '')}>
            {isRespublika ? 'Respublika bo‘yicha' : value}
          </span>
        )
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
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Profilaktika ishlari statistikasi" />

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

          <Select value={month} onValueChange={(val) => setMonth(val)}>
            <SelectTrigger className="h-10 w-[160px] bg-white text-sm">
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
        </div>
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
              left: ['regionName'],
            },
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default PreventionStatsReport
