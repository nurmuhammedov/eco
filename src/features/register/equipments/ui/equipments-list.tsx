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
      factoryNumber = '',
    },
    addParams,
  } = useCustomSearchParams()

  const { data, isLoading } = usePaginatedData<any>(`/equipments`, {
    status: status !== 'ALL' && status !== 'ACTIVE' && status !== 'INACTIVE' ? status : '',
    active: status == 'ACTIVE' || status == 'INACTIVE' ? status == 'ACTIVE' : '',
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
    factoryNumber,
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
      id: 'registrationDate',
      header: () => (
        <div className="whitespace-nowrap">
          Roʻyxatga olish <br /> sanasi
        </div>
      ),
      accessorFn: (row: any) => getDate(row.registrationDate),
      className: '!w-[1%]',
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: () => (
        <div className="whitespace-nowrap">
          Roʻyxatga olish <br /> raqami
        </div>
      ),
      accessorKey: 'registryNumber',
      className: '!w-[1%]',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'Qurilma',
      cell: (cell: any) =>
        cell.row.original.type == 'ELEVATOR'
          ? 'Lift'
          : APPLICATIONS_DATA?.find((i) => i?.equipmentType == cell.row.original.type)?.name || '',
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
      className: '!w-[1%]',
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
    },
    {
      accessorKey: 'factoryNumber',
      header: () => <div className="whitespace-nowrap">Zavod raqami</div>,
      className: '!w-[1%]',
      filterKey: 'factoryNumber',
      filterType: 'search',
    },
    {
      accessorFn: (row: any) => (row.nextPartialCheckDate ? getDate(row.nextPartialCheckDate) : '-'),
      id: 'nextPartialCheckDate',
      header: () => (
        <div className="whitespace-nowrap">
          Keyingi qisman <br /> texnik koʻrik <br /> sanasi
        </div>
      ),
      className: '!w-[1%]',
    },
    {
      id: 'nextFullCheckDate',
      accessorFn: (row: any) => (row.nextFullCheckDate ? getDate(row.nextFullCheckDate) : '-'),
      header: () => (
        <div className="whitespace-nowrap">
          Keyingi to‘liq <br /> texnik koʻrik <br /> sanasi
        </div>
      ),
      className: '!w-[1%]',
    },
    {
      id: 'expertiseExpiryDate',
      accessorFn: (row: any) => (row.expertiseExpiryDate ? getDate(row.expertiseExpiryDate) : '-'),
      header: () => (
        <div className="whitespace-nowrap">
          Ekspertiza xulosasi <br /> muddati
        </div>
      ),
      className: '!w-[1%]',
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <DataTableRowActions
          showView
          showEdit={user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN}
          row={row}
          showDelete
          onView={(row: any) => handleViewApplication(row.original?.id)}
          onEdit={(row: any) =>
            handleEditApplication(row.original?.id, row.original?.type, row.original?.ownerIdentity)
          }
        />
      ),
    },
  ].filter((col) => {
    if (type === 'OIL_CONTAINER') {
      return col.id !== 'nextPartialCheckDate' && col.id !== 'nextFullCheckDate'
    } else {
      return col.id !== 'expertiseExpiryDate'
    }
  }) as unknown as any

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <TabsLayout
        showArrows
        activeTab={type}
        tabs={[
          {
            id: 'ALL',
            name: 'Barcha qurilmalar',
          },
          {
            id: 'ELEVATOR',
            name: 'Lift',
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
            name: 'Reyestrdagi qurilmalar',
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
