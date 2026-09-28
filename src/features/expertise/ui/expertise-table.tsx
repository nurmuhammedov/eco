import { DataTable } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { formatDate } from 'date-fns'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Badge } from '@/shared/components/ui/badge'
import type { AccreditationRow } from '@/entities/expertise/model/conclusion.types'
import { AccreditationStatus } from '@/entities/expertise/model/constants'
import type { ReactNode } from 'react'

const STATUS_BADGES: Record<AccreditationStatus, ReactNode> = {
  [AccreditationStatus.ACTIVE]: <Badge variant="success">Aktiv</Badge>,
  [AccreditationStatus.EXPIRED]: <Badge variant="error">Muddati o‘tgan</Badge>,
  [AccreditationStatus.STOPPED]: <Badge variant="error">To‘xtatilgan</Badge>,
  [AccreditationStatus.EXPIRING_SOON]: (
    <Badge variant="warning" className="whitespace-nowrap">
      Muddati yaqinlashayotgan
    </Badge>
  ),
  [AccreditationStatus.NOT_PERMITTED]: (
    <Badge variant="error" className="whitespace-nowrap">
      Ruxsat etilmagan
    </Badge>
  ),
}

export const ExpertiseTable = () => {
  const {
    paramsObject: { page = 1, size = 10, status = 'ALL', ...rest },
  } = useCustomSearchParams()
  const { data = [], isLoading } = usePaginatedData<AccreditationRow>('/accreditations', {
    page: page,
    size: size,
    status: status == 'ALL' ? '' : status,
    ...rest,
  })

  const columns: ExtendedColumnDef<AccreditationRow, unknown>[] = [
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
      cell: ({ row }) => (row.original.status ? STATUS_BADGES[row.original.status] : null),
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
