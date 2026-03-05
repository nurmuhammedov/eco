import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { formatDate } from 'date-fns'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import FileLink from '@/shared/components/common/file-link'

import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { ApplicationStatusBadge } from '@/entities/application/ui/application-status-badge'
import { ApplicationStatus } from '@/entities/application'

export const DeclarationsTable = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: { page = 1, size = 10, ...rest },
  } = useCustomSearchParams()

  const queryParams: Record<string, any> = { page, size, ...rest }
  if (queryParams.status === 'ALL') {
    delete queryParams.status
  }

  const { data = [], isLoading } = usePaginatedData<any>('/declarations', queryParams)

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'registryNumber',
      header: 'Ro‘yxatga olish raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'hfRegistryNumbers',
      header: 'XICHOlar reyestr raqamlari',
      filterKey: 'hfRegistryNumber',
      filterType: 'search',
      cell: ({ row }: any) => {
        const numbers = row.original.hfRegistryNumbers
        return numbers && numbers.length > 0 ? numbers.join(', ') : '-'
      },
    },
    {
      accessorKey: 'expertName',
      header: 'Deklaratsiya ishlab chiquvchi tashkilot nomi',
      filterKey: 'expertName',
      filterType: 'search',
    },
    {
      accessorKey: 'expertTin',
      header: 'Deklaratsiya ishlab chiquvchi tashkilot STIRi',
      filterKey: 'expertTin',
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
      accessorKey: 'status',
      header: 'Holati',
      // filterKey: 'status',
      // filterType: 'select',
      // filterOptions: [
      //   { name: 'Jarayonda', id: 'IN_PROCESS' },
      //   { name: 'Yakunlangan', id: 'COMPLETED' },
      //   { name: 'Rad etilgan', id: 'REJECTED' },
      //   { name: 'Bekor qilingan', id: 'CANCELED' },
      // ],
      cell: ({ row }: any) => {
        return row.original.status ? <ApplicationStatusBadge status={row.original.status as ApplicationStatus} /> : '-'
      },
    },
    {
      header: 'Deklaratsiya fayli',
      minSize: 200,
      cell: ({ row }: any) => <div>{row.original.filePath ? <FileLink url={row.original.filePath} /> : '-'}</div>,
    },
    ...(user?.role === UserRoles.MANAGER
      ? [
          {
            id: 'approve',
            header: 'Amallar',
            cell: () => {
              if (rest?.status === 'IN_PROGRESS') {
                return <Button>Tasdiqlash</Button>
              }
              return null
            },
          },
        ]
      : []),
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
