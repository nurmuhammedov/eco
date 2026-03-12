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
      cell: (cell) => (cell.row.original.expertName ? cell.row.original.expertName : cell.row.original.customerName),
      filterType: 'search',
    },
    {
      accessorKey: 'expertTin',
      header: 'Deklaratsiya ishlab chiquvchi tashkilot STIRi',
      cell: (cell) => (cell.row.original.expertTin ? cell.row.original.expertTin : cell.row.original.customerTin),
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
      header: 'Sanasi',
      cell: (cell) => (cell.row.original.createdAt ? formatDate(cell.row.original.createdAt, 'dd.MM.yyyy') : null),
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      cell: ({ row }: any) => {
        return row.original.status ? <ApplicationStatusBadge status={row.original.status as ApplicationStatus} /> : '-'
      },
    },
    {
      header: 'Deklaratsiya',
      cell: ({ row }: any) => <FileLink url={row.original.declarationPath} />,
    },
    {
      header: 'Axborotnoma',
      cell: ({ row }: any) => <FileLink url={row.original.infoLetterPath} />,
    },
    {
      header: 'Hisob-kitob tushuntirish xati',
      cell: ({ row }: any) => <FileLink url={row.original.explanatoryNotePath} />,
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
        const canEdit =
          user?.role === UserRoles.LEGAL && user?.id === row?.original?.createdBy && row.original.status === 'CANCELED'

        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={(row: any) => navigate(`detail/${row.original.id!}`)}
              showEdit={canEdit}
              onEdit={(row: any) => navigate(`edit/${row.original.id!}`)}
            />
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
