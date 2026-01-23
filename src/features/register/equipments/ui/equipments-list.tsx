import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { TabsLayout } from '@/shared/layouts'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import useData from '@/shared/hooks/api/useData'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useChildEquipmentTypes } from '@/shared/api/dictionaries'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

export const EquipmentsList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    paramsObject: {
      status = 'ACTIVE',
      type = 'ALL',
      page = 1,
      size = 10,
      search = '',
      mode = '',
      regionId = '',
      districtId = '',
      registryNumber = '',
      childEquipmentId = '',
      ownerName = '',
      ownerIdentity = '',
      hfName = '',
      address = '',
      startDate = '',
      endDate = '',
    },
    addParams,
  } = useCustomSearchParams()

  const { data, isLoading } = usePaginatedData<any>(`/equipments`, {
    status: status !== 'ALL' ? status : '',
    type: type !== 'ALL' ? type : '',
    page,
    size,
    search,
    regionId,
    districtId,
    mode,
    registryNumber,
    childEquipmentId,
    ownerName,
    ownerIdentity,
    hfName,
    address,
    startDate,
    endDate,
  })

  const { data: dataForNewCount } = useData<number>(`/equipments/count`, true, {
    type: type !== 'ALL' ? type : '',
  })

  const { data: childEquipmentTypes } = useChildEquipmentTypes(type !== 'ALL' ? type : '')

  const handleViewApplication = (id: string) => {
    navigate(`${id}/equipments`)
  }

  const handleEditApplication = (id: string, type: string, tin: string) => {
    navigate(`/applications/create/ILLEGAL_REGISTER_${type}?id=${id}&tin=${tin}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Roʻyxatga olish sanasi',
      maxSize: 90,
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'Roʻyxatga olish raqami',
      accessorKey: 'registryNumber',
      maxSize: 90,
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'Qurilma',
      cell: (cell) => APPLICATIONS_DATA?.find((i) => i?.equipmentType == cell.row.original.type)?.name || '',
    },
    {
      header: 'Qurilmaning turi',
      accessorKey: 'childEquipment',
      maxSize: 150,
      filterKey: 'childEquipmentId',
      filterType: 'select',
      filterOptions: childEquipmentTypes || [],
    },
    {
      header: 'Tashkilot/Fuqaro nomi',
      accessorKey: 'ownerName',
      filterKey: 'ownerName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR/JSHSHIR',
      accessorKey: 'ownerIdentity',
      filterKey: 'ownerIdentity',
      filterType: 'number',
      filterMaxLength: 14,
    },
    {
      header: 'XICHO nomi',
      accessorKey: 'hfName',
      filterKey: 'hfName',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'Qurilma manzili',
      filterKey: 'address',
      filterType: 'search',
      minSize: 150,
    },
    {
      accessorFn: (row) => (row.nextPartialCheckDate ? getDate(row.nextPartialCheckDate) : '-'),
      maxSize: 90,
      header: 'Keyingi qisman texnik koʻrik sanasi',
    },
    {
      accessorFn: (row) => (row.nextFullCheckDate ? getDate(row.nextFullCheckDate) : '-'),
      header: 'Keyingi to‘liq texnik koʻrik sanasi',
      maxSize: 90,
    },
    {
      id: 'actions',
      maxSize: user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN ? 75 : 50,
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          showEdit={user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN}
          row={row}
          showDelete
          onView={(row) => handleViewApplication(row.original.id)}
          onEdit={(row) => handleEditApplication(row.original.id, row.original.type, row.original.ownerIdentity)}
        />
      ),
    },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <TabsLayout
        activeTab={type}
        tabs={[
          {
            id: 'ALL',
            name: 'Barcha qurilmalar',
          },
          ...(APPLICATIONS_DATA?.filter(
            (i) => i?.category == ApplicationCategory.EQUIPMENTS && i?.parentId == MainApplicationCategory.REGISTER
          )?.map((i) => ({
            id: i?.equipmentType?.toString() || '',
            name: i?.name?.toString() || '',
          })) || []),
        ]?.map((i) => ({
          ...i,
          count: i?.id == type ? (dataForNewCount ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ type: type }, 'page', 'childEquipmentId')}
      />
      <TabsLayout
        activeTab={status?.toString()}
        tabs={[
          {
            id: 'ALL',
            name: 'Barchasi',
          },
          {
            id: 'ACTIVE',
            name: 'Amaldagi qurilmalar',
          },
          {
            id: 'INACTIVE',
            name: 'Reyestrdan chiqarilgan qurilmalar',
          },
          {
            id: 'EXPIRED',
            name: 'Muddati o‘tgan qurilmalar',
          },
          {
            id: 'NO_DATE',
            name: 'Muddati kiritilmaganlar',
          },
        ]?.map((i) => ({
          ...i,
          count: i?.id == status ? (data?.page?.totalElements ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ status: type }, 'page')}
      />

      <DataTable
        showFilters
        isLoading={isLoading}
        isPaginated
        data={data || []}
        columns={columns as unknown as any}
        className="flex-1"
      />
    </div>
  )
}
