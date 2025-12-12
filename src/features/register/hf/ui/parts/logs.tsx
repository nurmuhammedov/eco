import { DataTable } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import FileLink from '@/shared/components/common/file-link'

export const Logs = () => {
  const { id } = useParams()

  const {
    paramsObject: { page = 1, size = 10 },
  } = useCustomSearchParams()

  const { data = [] } = usePaginatedData<any>(`/hf/${id}/logs`, {
    page,
    size,
  })

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Maydon',
      accessorKey: 'fieldNameUz',
    },
    {
      header: 'Yangi qiymati',
      accessorKey: 'newValue',
      cell: ({ row }) =>
        row?.original?.isFile ? (
          row.original?.newValue ? (
            <FileLink url={row.original?.newValue} />
          ) : null
        ) : (
          row?.original?.newValue
        ),
    },
    {
      header: 'Eski qiymati',
      accessorKey: 'oldValue',
      cell: ({ row }) =>
        row?.original?.isFile ? (
          row.original?.oldValue ? (
            <FileLink url={row.original?.oldValue} />
          ) : null
        ) : (
          row?.original?.oldValue
        ),
    },
    {
      header: 'Ijrochi',
      accessorKey: 'userName',
    },
    {
      header: 'O‘zgartirish vaqti',
      cell: ({ row }) => (
        <div className="whitespace-nowrap">
          {row?.original?.updatedAt ? format(row?.original?.updatedAt, 'dd.MM.yyyy - HH:mm') : null}
        </div>
      ),
      maxSize: 90,
    },
  ]

  return (
    <DataTable
      showFilters={true}
      isPaginated
      data={data || []}
      columns={columns as unknown as any}
      className="h-[calc(100svh-220px)]"
    />
  )
}
