import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { formatDate } from 'date-fns'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import FileLink from '@/shared/components/common/file-link'
import { Badge } from '@/shared/components/ui/badge'

import { useNavigate } from 'react-router-dom'

export const DeclarationsTable = () => {
  const navigate = useNavigate()
  const {
    paramsObject: { page = 1, size = 10, ...rest },
  } = useCustomSearchParams()

  const { data = [], isLoading } = usePaginatedData<any>('/declarations', {
    page: page,
    size: size,
    ...rest,
  })

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'registryNumber',
      header: 'Ro‘yxatga olish raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'hfName',
      header: 'Deklaratsiya qilingan XICHOning nomi',
      filterKey: 'hfName',
      filterType: 'search',
    },
    {
      accessorKey: 'hfRegistryNumber',
      header: 'XICHO reyestr raqami',
      filterKey: 'hfRegistryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'XICHO joylashgan manzil',
      filterKey: 'address',
      filterType: 'search',
    },
    {
      accessorKey: 'legalName',
      header: 'Deklaratsiya ishlab chiquvchi tashkilot',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      accessorKey: 'customerName',
      header: 'Tashkilotning nomi',
      filterKey: 'customerName',
      filterType: 'search',
    },
    {
      accessorKey: 'customerTin',
      header: 'Tashkilotning STIR',
      filterKey: 'customerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'conclusionRegistryNumber',
      header: 'Ekspertiza xulosasi reyestr raqami',
      filterKey: 'conclusionRegistryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'createdAt',
      header: 'Ro‘yxatga olish sanasi',
      cell: (cell) => (cell.row.original.createdAt ? formatDate(cell.row.original.createdAt, 'dd.MM.yyyy') : null),
    },

    {
      header: 'Deklaratsiya fayli',
      minSize: 200,
      cell: ({ row }: any) => (
        <div>
          {row.original.filePath ? (
            <FileLink url={row.original.filePath} />
          ) : (
            <span className="text-sm text-gray-400">Fayl yo'q</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      cell: ({ row }) =>
        row.original.status == 'ACTIVE' ? (
          <Badge variant="success">Aktiv</Badge>
        ) : row.original.status == 'EXPIRED' ? (
          <Badge variant="error">Muddati o‘tgan</Badge>
        ) : row.original.status == 'CANCELLED' ? (
          <Badge variant="error">Bekor qilingan</Badge>
        ) : null,
    },
    {
      id: 'actions',
      size: 50,
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions row={row} showView onView={(row: any) => navigate(`detail/${row.original.id!}`)} />
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2 overflow-hidden">
      <DataTable
        showNumeration={true}
        isPaginated={true}
        columns={columns}
        data={data}
        showFilters={true}
        isLoading={isLoading}
        className="flex-1"
      />
    </div>
  )
}
