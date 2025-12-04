import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'
import { getDate } from '@/shared/utils/date'

export const PendingList = () => {
  const navigate = useNavigate()
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams()
  const { data, isLoading } = usePaginatedData<any>(`/appeals/attestation/pending`, {
    ...rest,
    page: rest.page || 1,
    size: rest?.size || 10,
  })

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'number',
      header: 'Ariza raqami',
    },
    {
      accessorKey: 'legalName',
      header: 'Tashkilot nomi',
    },
    {
      accessorKey: 'legalTin',
      header: 'STIR',
    },
    {
      accessorKey: 'executorName',
      header: 'Ijrochi',
    },
    {
      accessorKey: 'deadline',
      header: 'Muddat',
      cell: ({ row }) => getDate(row.original.deadline),
    },
    {
      accessorKey: 'resolution',
      header: 'Resolutsya',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={() => navigate(`/attestations/detail/${row.original.id}`)}
            />
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data || []} isLoading={isLoading} className="h-[calc(100svh-320px)]" />
}
