import { DataTable } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import FileLink from '@/shared/components/common/file-link'
import ApplicationLogsModal from '@/features/application/application-detail/ui/modals/application-logs-modal'
import { Eye } from 'lucide-react'

export const Logs = ({ url = 'hf' }: any) => {
  const { id } = useParams()

  const {
    paramsObject: { page = 1, size = 10 },
  } = useCustomSearchParams()

  const { data = [] } = usePaginatedData<any>(`/${url}/${id}/logs`, {
    page,
    size,
  })

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Maydon',
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
    {
      id: 'actions',
      cell: ({ row }) =>
        row.original.changeId ? (
          <ApplicationLogsModal
            id={row.original.changeId}
            type="change"
            trigger={
              <div className="flex cursor-pointer justify-center text-blue-600 hover:text-blue-800">
                <Eye size={20} />
              </div>
            }
          />
        ) : null,
      maxSize: 50,
    },
  ]

  return <DataTable showFilters={true} isPaginated data={data || []} columns={columns as unknown as any} />
}
