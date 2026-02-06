import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

export const XrayList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: {
      page = 1,
      size = 10,
      search = '',
      mode = '',
      officeId = '',
      regionId = '',
      districtId = '',
      startDate = '',
      endDate = '',
    },
  } = useCustomSearchParams()
  const { data = [], isLoading } = usePaginatedData<any>(`/xrays`, {
    page,
    size,
    search,
    mode,
    officeId,
    regionId,
    districtId,
    startDate,
    endDate,
  })

  const handleViewApplication = (id: string) => {
    navigate(`${id}/xrays`)
  }

  const handleEditApplication = (id: string, tin: string) => {
    navigate(`/applications/create/ILLEGAL_REGISTER_XRAY?id=${id}&tin=${tin}`)
  }
  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Ruxsatnoma berilgan sana',
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'Ruxsatnoma reestri bo‘yicha tartib raqami',
      accessorFn: (row) => row?.registryNumber,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'License tizimidagi ruxsatnoma reestri  tartib raqami',
      accessorFn: (row) => row?.licenseRegistryNumber,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Ruxsatnomani amal qilish muddati',
      accessorFn: (row) => row?.licenseExpiryDate,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      accessorFn: (row) => row?.legalName,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      accessorFn: (row) => row?.legalTin,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Rentgen joylashgan manzil',
      accessorFn: (row) => row?.address,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      id: 'actions',
      maxSize:
        user?.role == UserRoles.MANAGER || user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN
          ? 70
          : 40,
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showDelete
          onView={(row) => handleViewApplication(row.original.id)}
          showEdit={
            user?.role == UserRoles.MANAGER || user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN
          }
          onEdit={(row) => handleEditApplication(row.original.id, row.original.legalTin)}
        />
      ),
    },
  ]

  return (
    <DataTable
      showFilters
      isLoading={isLoading}
      isPaginated
      data={data || []}
      columns={columns as unknown as any}
      className="min-h-0 flex-1"
    />
  )
}
