import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useUserLogsTypeLabel } from '@/shared/hooks/use-user-logs-type-label.ts'
import { ISearchParams } from '@/shared/types'
import { formatDate } from 'date-fns'
import { useExecutionLogs } from '@/features/application/application-detail/hooks/use-execution-logs'
import { useParams } from 'react-router-dom'

export const ApplicationLogsList = ({ isShow, id: propId, type = 'appeal' }: any) => {
  const { id: paramsId } = useParams()
  const id = propId || paramsId
  const { data, isLoading } = useExecutionLogs(id, type, isShow)

  const getUserLogsTypeLabel = useUserLogsTypeLabel()

  const columns: ColumnDef<ISearchParams>[] = [
    {
      accessorKey: 'executorName',
      header: 'Ijrochi nomi',
    },
    {
      accessorKey: 'status',
      header: 'Harakat',
      cell: ({ row }) => getUserLogsTypeLabel(row.original.status),
    },
    {
      accessorKey: 'dateTime',
      header: 'Sana',
      cell: (cell) =>
        cell.row.original.createdAt ? formatDate(cell.row.original.createdAt, 'dd.MM.yyyy, HH:mm') : null,
    },
    ...(type !== 'appeal'
      ? []
      : [
          {
            accessorKey: 'description',
            header: 'Tavsifi',
          },
        ]),
  ]

  return <DataTable isPaginated data={data || []} columns={columns} isLoading={isLoading} />
}
