import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'

export const XrayList = () => {
  const navigate = useNavigate()
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

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Ruxsatnoma berilgan sana',
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: "Ruxsatnoma reestri bo'yicha tartib raqami",
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
      maxSize: 40,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
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
      className="h-[calc(100svh-220px)]"
    />
  )
}
