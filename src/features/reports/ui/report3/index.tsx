import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import React from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { GoBack } from '@/shared/components/common'
import { apiClient } from '@/shared/api/api-client'
import { format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'

export enum InspectionStatus {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

interface IReportData {
  regionName: string
  activeHf: number
  inactiveHf: number
  activeEquipment: number
  inactiveEquipment: number
  expiredEquipment: number
  noDateEquipment: number
  activeIrs: number
  inactiveIrs: number

  [key: string]: any
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

  const columns: ColumnDef<IReportData>[] = [
    {
      header: 'Hududlar',
      accessorKey: 'regionName',
      minSize: 250,
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
              cell: ({ row }) => calcPercent(row.original.activeHf, totals.activeHf),
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
              cell: ({ row }) => calcPercent(row.original.inactiveHf, totals.inactiveHf),
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
              cell: ({ row }) => calcPercent(row.original.activeEquipment, totals.activeEquipment),
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
              cell: ({ row }) => calcPercent(row.original.inactiveEquipment, totals.inactiveEquipment),
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
              cell: ({ row }) => calcPercent(row.original.expiredEquipment, totals.expiredEquipment),
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
              cell: ({ row }) => calcPercent(row.original.noDateEquipment, totals.noDateEquipment),
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
              cell: ({ row }) => calcPercent(row.original.activeIrs, totals.activeIrs),
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
              cell: ({ row }) => calcPercent(row.original.inactiveIrs, totals.inactiveIrs),
              size: 80,
            },
          ],
        },
      ],
    },
  ]

  const handleDownloadExel = async () => {
    const res = await apiClient.downloadFile<Blob>('/reports/registry/export-excel', {
      ...paramsObject,
      ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
    })

    const blob = res.data
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date()
    const filename = `Davlat ro‘yxatiga kiritilgan va ro‘yxatdan chiqarilgan XICHO, Qurilmalar va INMlarning hududlar kesimida taqsimlanishi (${format(today, 'dd.MM.yyyy')}).xlsx`
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <GoBack
          title={
            <>
              Davlat ro‘yxatiga kiritilgan va ro‘yxatdan chiqarilgan XICHO, Qurilmalar va INMlarning hududlar kesimida
              taqsimlanishi <span className="italic">(bugungi kun holatiga)</span>
            </>
          }
        />
      </div>

      <div className="my-2 flex items-start justify-end gap-2">
        <Button onClick={handleDownloadExel}>
          <Download /> Excel
        </Button>
      </div>

      <DataTable
        showNumeration={false}
        headerCenter={true}
        data={tableData}
        columns={columns as unknown as any}
        isLoading={isLoading}
      />
    </div>
  )
}

export default Report3
