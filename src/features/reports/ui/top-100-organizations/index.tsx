import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { ExportExcelButton, GoBack } from '@/shared/components/common'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useTrainedEmployeesQuery, type TrainedEmployees } from '@/entities/organizations'
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

type Row = OrganizationEmployees & {
  isSummary: boolean
  /** Whether the training centre is asked about this organization at all */
  withTrained: boolean
}

/**
 * Every organization is a separate call to the training centre, and asking for
 * all hundred made the report crawl. Only the biggest ones are looked up.
 */
const TRAINED_LOOKUP_LIMIT = 50

/** Which of the training centre's counts a cell shows */
const trainedPicks = {
  manager: (data: TrainedEmployees) => data.managerCount,
  engineer: (data: TrainedEmployees) => data.engineerCount,
  total: (data: TrainedEmployees) =>
    data.managerCount === null && data.engineerCount === null
      ? null
      : (data.managerCount ?? 0) + (data.engineerCount ?? 0),
}

/**
 * The training centre is asked per organization, so these cells fill in on
 * their own after the report is already on screen instead of holding it back.
 */
const TrainedCount = ({ tin, pick }: { tin: number | null; pick: keyof typeof trainedPicks }) => {
  const { data, isLoading } = useTrainedEmployeesQuery(tin)

  if (isLoading) return <Skeleton className="mx-auto h-5 w-8" />

  const value = data ? trainedPicks[pick](data) : null

  return <span className="font-medium text-emerald-700">{value ?? '-'}</span>
}

const Top100OrganizationsReport: React.FC = () => {
  const { data: reportData, isLoading } = useData<OrganizationEmployees[]>('/reports/top-100-organizations', true)

  const tableData = useMemo(() => {
    if (!reportData) return []

    let organizations = 0

    // An organization with no staff on record has nothing to report.
    return reportData
      .filter((item) => item.total)
      .map((item): Row => {
        const isSummary = item.legalName === 'Boshqa tashkilotlar' || !item.legalTin

        return {
          ...item,
          isSummary,
          // The summary rows lump many organizations together and have no TIN to ask about.
          withTrained: !isSummary && organizations++ < TRAINED_LOOKUP_LIMIT,
        }
      })
  }, [reportData])

  const countCell = (key: 'managerCount' | 'engineerCount' | 'workerCount' | 'total'): ExtendedColumnDef<Row> => ({
    id: key,
    header: 'Umumiy',
    accessorKey: key,
    className: 'text-center',
    cell: ({ row }) => <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original[key] || 0}</span>,
  })

  const trainedCell = (id: string, header: string, pick: keyof typeof trainedPicks): ExtendedColumnDef<Row> => ({
    id,
    header,
    className: 'text-center bg-emerald-50/40',
    cell: ({ row }) => (row.original.withTrained ? <TrainedCount tin={row.original.legalTin} pick={pick} /> : '-'),
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
      columns: [countCell('managerCount'), trainedCell('managerTrained', 'Ta’lim platformada o‘qigan', 'manager')],
    },
    {
      id: 'engineer',
      header: 'Muhandis-texnik xodimlar soni',
      columns: [countCell('engineerCount'), trainedCell('engineerTrained', 'Ta’lim platformada o‘qigan', 'engineer')],
    },
    { ...countCell('workerCount'), header: 'Oddiy ishchi xodimlar soni' },
    {
      id: 'totalGroup',
      header: 'Jami',
      columns: [countCell('total'), trainedCell('totalTrained', 'O‘qiganlar', 'total')],
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
