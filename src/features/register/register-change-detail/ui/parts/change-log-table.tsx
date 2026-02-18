import { FC } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData, useCustomSearchParams } from '@/shared/hooks'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { getDate } from '@/shared/utils/date'

interface Props {
  changeId?: string
}

const ChangeLogTable: FC<Props> = ({ changeId }) => {
  const {
    paramsObject: { page = 1, size = 10 },
  } = useCustomSearchParams()

  const { data, isLoading } = usePaginatedData<any>(`/change-logs/by-change/${changeId}`, { page, size }, !!changeId)

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Maydon nomi',
      accessorKey: 'fieldNameUz',
    },
    {
      header: 'Eski qiymat',
      accessorKey: 'oldValue',
      cell: ({ row }) => <span className="text-red-600">{row.original.oldValue || '-'}</span>,
    },
    {
      header: 'Yangi qiymat',
      accessorKey: 'newValue',
      cell: ({ row }) => <span className="text-green-600">{row.original.newValue || '-'}</span>,
    },
    {
      header: 'Kim tomonidan',
      accessorKey: 'userName',
    },
    {
      header: 'Sana',
      accessorFn: (row) => getDate(row.createdAt),
    },
  ]

  return <DataTable columns={columns as any} data={data || []} isLoading={isLoading} isPaginated />
}

export default ChangeLogTable
