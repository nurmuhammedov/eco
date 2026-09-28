import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ExportExcelButton, GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import type { ExtendedColumnDef } from '@/shared/components/common/data-table/model/column-def'

/** ReportByTop100OrganizationByEmployeeCount */
interface OrganizationEmployees {
  legalName: string
  regionName: string
  legalTin: number | null
  managerCount: number
  engineerCount: number
  workerCount: number
  total: number
}

type Row = OrganizationEmployees & { isSummary: boolean }

const Top100OrganizationsReport: React.FC = () => {
  const { data: reportData, isLoading } = useData<OrganizationEmployees[]>('/reports/top-100-organizations', true)

  const tableData = useMemo(() => {
    if (!reportData) return []

    return reportData.map(
      (item): Row => ({
        ...item,
        isSummary: item.legalName === 'Boshqa tashkilotlar' || !item.legalTin,
      })
    )
  }, [reportData])

  const columns: ExtendedColumnDef<Row, number>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      id: 'legalName',
      minSize: 300,
      cell: ({ row, getValue }) => <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{getValue()}</span>,
    },
    {
      id: 'legalTin',
      header: 'STIR',
      accessorKey: 'legalTin',
      className: 'text-center',
      cell: ({ row, getValue }) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || '-'}</span>
      ),
    },
    {
      id: 'managerCount',
      header: 'Rahbar xodimlar soni',
      accessorKey: 'managerCount',
      className: 'text-center',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>,
    },
    {
      id: 'engineerCount',
      header: 'Muhandis-texnik xodimlar soni',
      accessorKey: 'engineerCount',
      className: 'text-center',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>,
    },
    {
      id: 'workerCount',
      header: 'Oddiy ishchi xodimlar soni',
      accessorKey: 'workerCount',
      className: 'text-center',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>,
    },
    {
      id: 'total',
      header: 'Jami',
      accessorKey: 'total',
      className: 'text-center',
      cell: ({ row, getValue }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue() || 0}</span>,
    },
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Eng ko‘p 3 toifa xodimga ega Top-100 tashkilotlar" />
        <ExportExcelButton
          endpoint="/reports/top-100-organizations/export-excel"
          fileName="Eng ko‘p 3 toifa xodimga ega Top-100 tashkilotlar"
          disabled={isLoading}
        />
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={true}
          headerCenter={true}
          isHeaderSticky={true}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default Top100OrganizationsReport
