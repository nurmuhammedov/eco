import { IrsCategory, IrsUsageType } from '@/entities/create-application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'

export const IrsList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: {
      size = 10,
      page = 1,
      mode = '',
      search = '',
      regionId = '',
      districtId = '',
      registryNumber = '',
      legalName = '',
      legalAddress = '',
      legalTin = '',
      address = '',
      category = '',
      activity = '',
      sphere = '',
      symbol = '',
      usageType = '',
      startDate = '',
      endDate = '',
    },
  } = useCustomSearchParams()

  const { data = [], isLoading } = usePaginatedData<any>(`/irs`, {
    page,
    size,
    mode,
    regionId,
    districtId,
    search,
    registryNumber,
    legalName,
    legalAddress,
    legalTin,
    address,
    category,
    activity,
    sphere,
    symbol,
    usageType,
    startDate,
    endDate,
  })

  const handleViewApplication = (id: string) => {
    navigate(`${id}/irs`)
  }

  const handleEditApplication = (id: string, tin: string) => {
    navigate(`/applications/create/ILLEGAL_REGISTER_IRS?id=${id}&tin=${tin}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'INM hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'INM ro‘yxat raqami',
      accessorFn: (row) => row?.registryNumber,
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      accessorFn: (row) => row?.legalName,
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      accessorFn: (row) => row?.legalAddress,
      filterKey: 'legalAddress',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      accessorFn: (row) => row?.legalTin,
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      header: 'INM manzili',
      accessorFn: (row) => row?.address,
      filterKey: 'address',
      filterType: 'search',
    },
    {
      header: 'Kategoriyasi',
      accessorFn: (row) => row?.category,
      filterKey: 'category',
      filterType: 'select',
      filterOptions: Object.values(IrsCategory).map((val) => ({
        id: val,
        name: val,
      })),
    },
    {
      header: 'Aktivligi',
      accessorFn: (row) => row?.activity,
      filterKey: 'activity',
      filterType: 'search',
    },
    {
      header: 'Soha',
      accessorFn: (row) => row?.sphere,
      filterKey: 'sphere',
      filterType: 'search',
    },
    {
      header: 'Radionuklid belgisi',
      accessorFn: (row) => row?.symbol,
      filterKey: 'symbol',
      filterType: 'search',
    },
    {
      header: 'Foydalanish maqsadi',
      accessorFn: (row) =>
        [
          { id: IrsUsageType.USAGE, name: 'Ishlatish (foydalanish) uchun' },
          { id: IrsUsageType.DISPOSAL, name: 'Ko‘mish uchun' },
          { id: IrsUsageType.EXPORT, name: 'Chet-elga olib chiqish uchun' },
          { id: IrsUsageType.STORAGE, name: 'Vaqtinchalik saqlash uchun' },
        ]?.find((i) => i?.id == row?.usageType)?.name || '',
      filterKey: 'usageType',
      filterType: 'select',
      filterOptions: [
        { id: IrsUsageType.USAGE, name: 'Ishlatish (foydalanish) uchun' },
        { id: IrsUsageType.DISPOSAL, name: 'Ko‘mish uchun' },
        { id: IrsUsageType.EXPORT, name: 'Chet-elga olib chiqish uchun' },
        { id: IrsUsageType.STORAGE, name: 'Vaqtinchalik saqlash uchun' },
      ],
    },
    {
      id: 'actions',
      maxSize:
        user?.role == UserRoles.MANAGER || user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN
          ? 80
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
      isPaginated
      isLoading={isLoading}
      data={data || []}
      columns={columns as unknown as any}
      className="h-[calc(100svh-220px)]"
    />
  )
}
