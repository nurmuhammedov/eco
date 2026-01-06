import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useHazardousFacilityTypeDictionarySelect } from '@/shared/api/dictionaries'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

export const HfList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: {
      page = 1,
      size = 10,
      search = '',
      mode = '',
      registryNumber = '',
      legalTin = '',
      legalName = '',
      legalAddress = '',
      name = '',
      address = '',
      regionId = '',
      districtId = '',
      hfTypeId = '',
      startDate = '',
      endDate = '',
    },
  } = useCustomSearchParams()

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { data = [], isLoading } = usePaginatedData<any>(`/hf`, {
    page,
    size,
    search,
    mode,
    registryNumber,
    legalTin,
    legalName,
    legalAddress,
    name,
    address,
    regionId,
    districtId,
    hfTypeId,
    startDate,
    endDate,
  })

  const handleViewApplication = (id: string) => {
    navigate(`${id}/hf`)
  }

  const handleEditApplication = (data: any) => {
    navigate(`/register/hf/update/${data?.id}?tin=${data?.legalTin}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      maxSize: 90,
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'Hisobga olish raqami',
      accessorKey: 'registryNumber',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      accessorKey: 'legalAddress',
      filterKey: 'legalAddress',
      filterType: 'search',
    },
    {
      header: 'STIR',
      accessorKey: 'legalTin',
      filterKey: 'legalTin',
      filterType: 'number',
      maxSize: 90,
      filterMaxLength: 9,
    },
    {
      header: 'XICHO nomi',
      accessorKey: 'name',
      filterKey: 'name',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'XICHO manzili',
      filterKey: 'address',
      filterType: 'search',
    },
    {
      header: 'XICHO turi',
      accessorKey: 'typeName',
      filterKey: 'hfTypeId',
      filterType: 'select',
      maxSize: 80,
      filterOptions: hazardousFacilityTypes || [],
    },
    {
      id: 'actions',
      maxSize: user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN ? 75 : 50,
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showEdit={user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.CHAIRMAN}
          showDelete
          onView={(row) => handleViewApplication(row.original.id)}
          onEdit={(row) => handleEditApplication(row.original)}
        />
      ),
    },
  ]

  return (
    <DataTable
      showFilters={true}
      isLoading={isLoading}
      isPaginated
      data={data || []}
      columns={columns as unknown as any}
      className="h-[calc(100svh-220px)]"
    />
  )
}
