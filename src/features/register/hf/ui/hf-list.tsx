import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useHazardousFacilityTypeDictionarySelect } from '@/shared/api/dictionaries'

export const HfList = () => {
  const navigate = useNavigate()
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
    },
  } = useCustomSearchParams()

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { data = [] } = usePaginatedData<any>(`/hf`, {
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
  })

  const handleViewApplication = (id: string) => {
    navigate(`${id}/hf`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      maxSize: 90,
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
      maxSize: 40,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ]

  return (
    <>
      <DataTable
        showFilters={true}
        isPaginated
        data={data || []}
        columns={columns as unknown as any}
        className="h-[calc(100svh-220px)]"
      />
    </>
  )
}
