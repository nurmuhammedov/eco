import { DataTable } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { formatDate } from 'date-fns'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Badge } from '@/shared/components/ui/badge'

export const ExpertiseTable = () => {
  const {
    paramsObject: { page = 1, size = 10, status = 'ALL', ...rest },
  } = useCustomSearchParams()
  const { data = [], isLoading } = usePaginatedData<any>('/accreditations', {
    page: page,
    size: size,
    status: status == 'ALL' ? '' : status,
    ...rest,
  })

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'legalName',
      header: 'Tashkilot nomi',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      accessorKey: 'legalTin',
      header: () => <div className="whitespace-nowrap">Tashkilot STIR</div>,
      className: '!w-[1%]',
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'Manzili',
      filterKey: 'address',
      filterType: 'search',
    },
    {
      accessorKey: 'registryNumber',
      header: 'Akkreditatsiya ro‘yxat raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'registrationDate',
      header: 'Akkreditatsiya berilgan sana',
      cell: (cell) =>
        cell.row.original.registrationDate ? formatDate(cell.row.original.registrationDate, 'dd.MM.yyyy') : null,
    },
    {
      accessorKey: 'expiryDate',
      header: 'Akkreditatsiya amal qilish muddati',
      cell: (cell) => (cell.row.original.expiryDate ? formatDate(cell.row.original.expiryDate, 'dd.MM.yyyy') : null),
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      className: '!w-[1%]',
      cell: ({ row }) =>
        row.original.status == 'ACTIVE' ? (
          <Badge variant="success">Aktiv</Badge>
        ) : row.original.status == 'EXPIRED' ? (
          <Badge variant="error">Muddati o‘tgan</Badge>
        ) : row.original.status == 'STOPPED' ? (
          <Badge variant="error">To‘xtatilgan</Badge>
        ) : row.original.status == 'EXPIRING_SOON' ? (
          <Badge variant="warning" className="whitespace-nowrap">
            Muddati yaqinlashayotgan
          </Badge>
        ) : row.original.status == 'CANCELLED' ? (
          <Badge variant="error">Bekor qilingan</Badge>
        ) : null,
    },
  ]

  return (
    <DataTable
      showNumeration={true}
      isPaginated={true}
      columns={columns}
      data={data}
      showFilters={true}
      isLoading={isLoading}
    />
  )
}
