import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { formatDate } from 'date-fns'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import FileLink from '@/shared/components/common/file-link'

import { useNavigate } from 'react-router-dom'
import { UserRoles } from '@/shared/types/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { ApplicationStatusBadge } from '@/entities/application/ui/application-status-badge'
import { ApplicationStatus } from '@/entities/application'
import type { DeclarationRow } from '@/entities/declarations/model/declaration.types'

export const DeclarationsTable = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: { page = 1, size = 10, status, ...rest },
  } = useCustomSearchParams()

  const { data = [], isLoading } = usePaginatedData<DeclarationRow>('/declarations', {
    page,
    size,
    ...rest,
    status: status === 'ALL' ? undefined : status,
  })

  const columns: ExtendedColumnDef<DeclarationRow, unknown>[] = [
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
      cell: ({ row }) => row.original.hfRegistryNumbers?.join(', ') || '-',
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
      cell: ({ row }) =>
        row.original.status ? <ApplicationStatusBadge status={ApplicationStatus[row.original.status]} /> : '-',
    },
    {
      header: 'Deklaratsiya',
      cell: ({ row }) => <FileLink url={row.original.declarationPath} />,
    },
    {
      header: 'Axborotnoma',
      cell: ({ row }) => <FileLink url={row.original.infoLetterPath} />,
    },
    {
      header: 'Hisob-kitob tushuntirish xati',
      cell: ({ row }) => <FileLink url={row.original.explanatoryNotePath} />,
    },
    {
      id: 'actions',
      size: 50,
      cell: ({ row }) => {
        const canEdit =
          user?.role === UserRoles.LEGAL && user?.id === row.original.createdBy && row.original.status === 'CANCELED'

        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={(row) => navigate(`detail/${row.original.id}`)}
              showEdit={canEdit}
              onEdit={(row) => navigate(`edit/${row.original.id}`)}
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
