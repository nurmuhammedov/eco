import { IrsCategory, IrsUsageType } from '@/entities/create-application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'

export const IrsList = () => {
  const navigate = useNavigate()
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

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'INM hisobga olish sanasi',
      maxSize: 120,
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'INM ro‘yxat raqami',
      maxSize: 120,
      accessorFn: (row) => row?.registryNumber,
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      minSize: 220,
      accessorFn: (row) => row?.legalName,
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      minSize: 220,
      accessorFn: (row) => row?.legalAddress,
      filterKey: 'legalAddress',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      maxSize: 120,
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
      maxSize: 110,
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
      maxSize: 100,
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
      maxSize: 100,
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
      maxSize: 40,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
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
