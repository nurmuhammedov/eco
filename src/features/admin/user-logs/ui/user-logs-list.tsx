import { FilterUserLogsDTO, UserLogs } from '@/entities/admin/user-logs/models/user-logs.types'
import { DataTable } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useUserLogsList } from '@/entities/admin/user-logs'
import { useFilters } from '@/shared/hooks/use-filters'
import { useUserLogsTypeLabel } from '@/shared/hooks/use-user-logs-type-label.ts'

export function UserLogsList() {
  const { filters } = useFilters()

  const { data, isLoading } = useUserLogsList(filters as FilterUserLogsDTO)

  const getUserLogsTypeLabel = useUserLogsTypeLabel()

  const columns: ColumnDef<UserLogs>[] = [
    {
      accessorKey: 'username',
      maxSize: -10,
      header: 'username',
    },
    {
      accessorKey: 'name',
      maxSize: -10,
      header: "To'liq ism",
    },
    {
      accessorKey: 'status',
      maxSize: -10,
      header: 'Harakat',
      cell: ({ row }) => getUserLogsTypeLabel(row.original.status),
    },
    {
      accessorKey: 'appealNumber',
      maxSize: -10,
      header: 'Raqami',
    },
    {
      accessorKey: 'createdAt',
      maxSize: -10,
      header: 'Sana',
    },
    {
      accessorKey: 'ownerName',
      maxSize: -10,
      header: 'Tashkilot nomi',
    },
    {
      accessorKey: 'ownerIdentity',
      maxSize: -10,
      header: 'STIR',
    },
  ]

  return <DataTable isPaginated data={data || []} columns={columns} isLoading={isLoading} />
}
