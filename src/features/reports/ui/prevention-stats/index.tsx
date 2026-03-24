import React, { useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'
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
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(i)
  }
  return years
}

const PreventionStatsReport: React.FC = () => {
  const [year, setYear] = useState<string>(currentYear.toString())
  const [month, setMonth] = useState<string>(currentMonth)

  const { data: preventionData, isLoading } = usePaginatedData('/reports/prevention', {
    year: Number(year),
    month,
  })

  const tableData = React.useMemo(() => {
    if (!preventionData) return []
    return (preventionData as unknown as any[]) || []
  }, [preventionData])

  const createSectionColumns = (header: string, accessorPrefix: string) => ({
    header,
    columns: [
      {
        header: 'Inspektor belgilanmagan',
        accessorFn: (row: any) => row[accessorPrefix]?.unassignedCount || 0,
        cell: ({ row, getValue }: any) => {
          const isRespublika =
            row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
          return <span className={isRespublika ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Jarayondagilar',
        accessorFn: (row: any) => row[accessorPrefix]?.processCount || 0,
        cell: ({ row, getValue }: any) => {
          const isRespublika =
            row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
          return <span className={isRespublika ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Yakunlangan',
        accessorFn: (row: any) => row[accessorPrefix]?.conductedCount || 0,
        cell: ({ row, getValue }: any) => {
          const isRespublika =
            row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
          return <span className={isRespublika ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
    ],
  })

  const columns: ColumnDef<any>[] = [
    {
      header: 'Hududlar',
      accessorKey: 'regionName',
      cell: ({ row }: any) => {
        const isRespublika =
          row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
        return <span className={isRespublika ? 'font-bold' : ''}>{row.original.regionName}</span>
      },
    },
    createSectionColumns('XICHO', 'hf'),
    createSectionColumns('INM', 'irs'),
    createSectionColumns('Lift', 'elevator'),
    createSectionColumns('Attraksion', 'attraction'),
    createSectionColumns('Rentgen', 'xray'),
    createSectionColumns('Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma', 'lpgPowered'),
  ]

  const handleDownloadExel = async () => {
    // API hozircha tayyor emas
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Profilaktika ishlari statistikasi" />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={year} onValueChange={(val) => setYear(val)}>
            <SelectTrigger className="h-10 w-[120px] bg-white">
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
            <SelectTrigger className="h-10 w-[160px] bg-white">
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

          <Button onClick={handleDownloadExel} className="h-10 w-full sm:w-auto" disabled>
            <Download size={18} className="mr-2" /> Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden rounded-md border bg-white shadow-sm">
          <DataTable
            showNumeration={false}
            headerCenter={true}
            data={tableData}
            columns={columns as unknown as any}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default PreventionStatsReport
