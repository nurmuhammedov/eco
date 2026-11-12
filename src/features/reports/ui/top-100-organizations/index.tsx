import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ExportExcelButton, GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import type { ExtendedColumnDef } from '@/shared/components/common/data-table/model/column-def'
import { type CountKey, type OrganizationEmployees, sumCounts, trainedTotal } from './totals'

type Row = OrganizationEmployees & { isSummary: boolean }

/** The KTNU columns keep their tint, so they read as one band next to the headcounts */
const TRAINED_CELL = 'text-center bg-emerald-50/40'

const Top100OrganizationsReport: React.FC = () => {
  const { data: reportData, isLoading } = useData<OrganizationEmployees[]>('/reports/top-100-organizations', true)

  const tableData = useMemo(() => {
    if (!reportData) return []

    // An organization with no staff on record has nothing to report.
    return reportData
      .filter((item) => item.total)
      .map((item): Row => ({ ...item, isSummary: item.legalName === 'Boshqa tashkilotlar' || !item.legalTin }))
  }, [reportData])

  const totals = useMemo(() => sumCounts(reportData ?? []), [reportData])

  const countCell = (key: CountKey, header: string): ExtendedColumnDef<Row> => ({
    id: key,
    header,
    accessorKey: key,
    className: 'text-center',
    cell: ({ row }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[key] || 0}</span>,
    footer: () => totals[key],
  })

  // Since 2026-11-12 the counts come with the report, synced nightly; a null is no data, not 0
  const trainedCell = (key: 'trainedManagerCount' | 'trainedEngineerCount'): ExtendedColumnDef<Row> => ({
    id: key,
    header: 'KTNUda o‘qigan',
    accessorKey: key,
    className: TRAINED_CELL,
    cell: ({ row }) => <span className="font-medium text-emerald-700">{row.original[key] ?? '-'}</span>,
    footer: () => totals[key],
  })

  const columns: ExtendedColumnDef<Row>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      id: 'legalName',
      minSize: 300,
      cell: ({ row }) => (
        <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{row.original.legalName}</span>
      ),
      footer: () => 'Jami',
    },
    {
      id: 'legalTin',
      header: 'STIR',
      accessorKey: 'legalTin',
      className: 'text-center',
      cell: ({ row }) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.legalTin || '-'}</span>
      ),
    },
    {
      id: 'manager',
      header: 'Rahbar xodimlar soni',
      columns: [countCell('managerCount', 'Umumiy'), trainedCell('trainedManagerCount')],
    },
    {
      id: 'engineer',
      header: 'Muhandis-texnik xodimlar soni',
      columns: [countCell('engineerCount', 'Umumiy'), trainedCell('trainedEngineerCount')],
    },
    countCell('workerCount', 'Oddiy ishchi xodimlar soni'),
    {
      id: 'totalGroup',
      header: 'Jami',
      columns: [
        countCell('total', 'Umumiy'),
        {
          id: 'trainedTotal',
          header: 'KTNUda o‘qiganlar',
          className: TRAINED_CELL,
          cell: ({ row }) => <span className="font-medium text-emerald-700">{trainedTotal(row.original) ?? '-'}</span>,
          footer: () => totals.trainedManagerCount + totals.trainedEngineerCount,
        },
      ],
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
          showFooter={true}
          headerCenter={true}
          isHeaderSticky={true}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default Top100OrganizationsReport
