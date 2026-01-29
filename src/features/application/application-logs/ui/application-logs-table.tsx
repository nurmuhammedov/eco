import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useUserLogsTypeLabel } from '@/shared/hooks/use-user-logs-type-label.ts'
import { useApplicationLogs } from '@/features/application/application-detail/hooks/use-applicant-logs.tsx'
import { ISearchParams } from '@/shared/types'
import { formatDate } from 'date-fns'

export const ApplicationLogsList = ({ isShow }: any) => {
  const { data, isLoading } = useApplicationLogs(isShow)

  const getUserLogsTypeLabel = useUserLogsTypeLabel()

  const columns: ColumnDef<ISearchParams>[] = [
    {
      accessorKey: 'executorName',
      maxSize: -10,
      header: 'Ijrochi nomi',
    },
    {
      accessorKey: 'executorId',
      maxSize: -10,
      header: 'Ijrochi ID',
    },
    {
      accessorKey: 'status',
      maxSize: -10,
      header: 'Harakat',
      cell: ({ row }) => getUserLogsTypeLabel(row.original.appealStatus),
    },
    {
      accessorKey: 'createdAt',
      maxSize: -10,
      header: 'Sana',
      cell: (cell) => (cell.row.original.createdAt ? formatDate(cell.row.original.createdAt, 'dd.MM.yyyy') : null),
    },
    {
      accessorKey: 'description',
      maxSize: -10,
      header: 'Tavsifi',
    },
  ]

  return <DataTable isPaginated data={data || []} columns={columns} isLoading={isLoading} />
}
