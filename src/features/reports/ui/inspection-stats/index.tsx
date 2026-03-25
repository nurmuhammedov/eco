import React, { useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { GoBack } from '@/shared/components/common'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

const QUARTERS = [
  { value: '1', label: '1-chorak' },
  { value: '2', label: '2-chorak' },
  { value: '3', label: '3-chorak' },
  { value: '4', label: '4-chorak' },
]

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth()
const currentQuarter = Math.floor(currentMonth / 3) + 1

const generateYears = () => {
  const years = []
  for (let i = 2025; i <= currentYear; i++) {
    years.push(i)
  }
  return years
}

const InspectionStatsReport: React.FC = () => {
  const [year, setYear] = useState<string>(currentYear.toString())
  const [quarter, setQuarter] = useState<string>(currentQuarter.toString())

  const { data: tableData, isLoading } = useData<any[]>('/reports/inspection', true, {
    year: Number(year),
    quarter: Number(quarter),
  })

  const createSectionColumns = (header: string, accessorPrefix: string) => ({
    header,
    id: accessorPrefix,
    columns: [
      {
        header: 'Barchasi',
        id: `${accessorPrefix}_allCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.allCount || 0,
        cell: ({ row, getValue }: any) => {
          const isRespublika =
            row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
          return <span className={isRespublika ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Buyruq qilinmagan',
        id: `${accessorPrefix}_newCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.newCount || 0,
        cell: ({ row, getValue }: any) => {
          const isRespublika =
            row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
          return <span className={isRespublika ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Buyruq imzolanish jarayonida',
        id: `${accessorPrefix}_notSignedCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.notSignedCount || 0,
        cell: ({ row, getValue }: any) => {
          const isRespublika =
            row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
          return <span className={isRespublika ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Inspektor biriktirilgan',
        id: `${accessorPrefix}_assignedCount`,
        accessorFn: (row: any) => row[accessorPrefix]?.assignedCount || 0,
        cell: ({ row, getValue }: any) => {
          const isRespublika =
            row.original.regionName === "Respublika bo'yicha" || row.original.regionName === 'Respublika bo‘yicha'
          return <span className={isRespublika ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Tekshiruv o‘tkazilgan',
        id: `${accessorPrefix}_conductedCount`,
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

  const handleDownloadExel = async () => {}

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Tekshiruv holati bo‘yicha" />

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

          <Select value={quarter} onValueChange={(val) => setQuarter(val)}>
            <SelectTrigger className="h-10 w-[160px] bg-white">
              <SelectValue placeholder="Chorakni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {QUARTERS.map((q) => (
                <SelectItem key={q.value} value={q.value}>
                  {q.label}
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
            data={tableData || []}
            columns={columns as unknown as any}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default InspectionStatsReport
