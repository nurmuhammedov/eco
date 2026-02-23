import { FC } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { usePaginatedData, useCustomSearchParams } from '@/shared/hooks'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table.tsx'
import { formatDate } from '@/shared/utils/date.ts'
import FileLink from '@/shared/components/common/file-link.tsx'

interface Props {
  changeId?: string
}

const ChangeLogTable: FC<Props> = ({ changeId }) => {
  const {
    paramsObject: { page = 1, size = 100 },
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
      cell: ({ row }) =>
        row?.original?.isFile ? (
          row.original?.oldValue ? (
            <FileLink url={row.original?.oldValue} />
          ) : null
        ) : (
          <span className="font-medium text-red-500">{row?.original?.oldValue}</span>
        ),
    },
    {
      header: 'Yangi qiymat',
      accessorKey: 'newValue',
      cell: ({ row }) =>
        row?.original?.isFile ? (
          row.original?.newValue ? (
            <FileLink url={row.original?.newValue} />
          ) : null
        ) : (
          <span className="font-medium text-green-600">{row?.original?.newValue}</span>
        ),
    },
    {
      header: 'Kim tomonidan',
      accessorKey: 'userName',
    },
    {
      header: 'Sana',
      accessorFn: (row) => formatDate(row.createdAt),
    },
  ]

  return (
    <DataTable className="min-h-[500px]" columns={columns as any} data={data || []} isLoading={isLoading} isPaginated />
  )
}

export default ChangeLogTable
