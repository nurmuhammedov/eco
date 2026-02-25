import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { TabsLayout } from '@/shared/layouts'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { AddPermitTransportModal } from '@/features/register/auto/ui/add-auto-modal'
import useData from '@/shared/hooks/api/useData'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useChildEquipmentTypes } from '@/shared/api/dictionaries'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { AutoTabKey, tabs as autoTabs } from '@/features/register/auto/ui/auto-tabs'
import { formatDate } from 'date-fns'

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
      changeStatus = 'ALL',
      ...rest
    },
    addParams,
    removeParams,
  } = useCustomSearchParams()

  const currentStatus = String(status)
  const isTanker = type === 'TANKERS'

  const { data, isLoading } = usePaginatedData<any>(isTanker ? `/tankers` : `/equipments`, {
    ...rest,
    status: isTanker
      ? currentStatus !== 'ALL'
        ? currentStatus
        : ''
      : currentStatus !== 'ALL' &&
          currentStatus !== 'ACTIVE' &&
          currentStatus !== 'INACTIVE' &&
          currentStatus !== 'CHANGED'
        ? currentStatus
        : currentStatus === 'CHANGED' && changeStatus !== 'ALL'
          ? ''
          : '',
    active: isTanker ? '' : currentStatus === 'ACTIVE' ? true : currentStatus === 'INACTIVE' ? false : '',
    changed: isTanker ? '' : currentStatus === 'CHANGED' ? true : '',
    changeStatus: isTanker ? '' : currentStatus === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
    type: !isTanker && type !== 'ALL' ? type : '',
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
    activityType: isTanker && rest?.activityType !== 'ALL' ? rest?.activityType : undefined,
  })

  const { data: changedCountData } = usePaginatedData<any>(
    `/equipments`,
    {
      changed: 'true',
      size: 1,
    },
    true
  )

  const { data: dataForNewCount } = useData<number>(`/equipments/count`, !isTanker, {
    type: !isTanker && type !== 'ALL' ? type : '',
  })
  const { data: tankersCount } = useData<any>('/tankers/count', isTanker, { mode })

  const { data: childEquipmentTypes } = useChildEquipmentTypes(!isTanker && type !== 'ALL' ? type : '')

  const handleViewApplication = (id: string) => {
    if (currentStatus === 'CHANGED') {
      navigate(`/register/change/${id}/equipments`)
    } else {
      navigate(`${id}/equipments`)
    }
  }

  const handleEditApplication = (id: string, type: string, tin: string) => {
    if (isTanker) return
    navigate(`/register/update/${type}/${id}?tin=${tin}`)
  }

  const tankerColumns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'name',
      filterKey: 'name',
      filterType: 'search',
    },
    {
      accessorKey: 'tin',
      header: 'Tashkilot STIR/Fuqaro JSHSHIR',
      cell: (cell) =>
        cell.row.original.tin ? cell.row.original.tin : cell.row.original.pin ? cell.row.original.pin : null,
      filterType: 'search',
    },
    {
      accessorKey: 'registerNumber',
      header: 'Berilgan ruxsatnoma ro‘yxatga olish raqami',
      filterKey: 'registerNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'expiryDate',
      header: 'Amal qilish muddati',
      cell: (cell) => (cell.row.original.expiryDate ? formatDate(cell.row.original.expiryDate, 'dd.MM.yyyy') : null),
    },
    {
      accessorKey: 'activityTypeName',
      header: 'Faoliyat turi',
      cell: (cell) =>
        cell.row.original.activityType
          ? autoTabs?.find((i) => i?.key == cell.row.original?.activityType)?.label || '-'
          : null,
    },
    {
      accessorKey: 'numberPlate',
      header: 'Davlat raqam belgisi',
      filterKey: 'numberPlate',
      filterType: 'search',
    },
    {
      accessorKey: 'model',
      header: 'Avtotransport vositasi modeli',
      filterKey: 'model',
      filterType: 'search',
    },
    {
      accessorKey: 'validUntil',
      header: 'Texnik ko‘rik amal qilish muddati',
      cell: (cell) => (cell.row.original.validUntil ? formatDate(cell.row.original.validUntil, 'dd.MM.yyyy') : null),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showDelete
          onView={(row) =>
            navigate(
              `${row.original.id}/auto?tin=${row.original.tin ? row.original.tin : row.original.pin ? row.original.pin : null}`
            )
          }
        />
      ),
    },
  ]

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
          showEdit={
            !isTanker &&
            (user?.role === UserRoles.LEGAL ||
              user?.role === UserRoles.INSPECTOR ||
              user?.role === UserRoles.INDIVIDUAL) &&
            currentStatus === 'ACTIVE'
          }
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
          {
            id: 'TANKERS',
            name: 'Harakatlanuvchi sig‘imlar',
          },
        ]?.map((i) => ({
          ...i,
          count: i?.id == type ? ((isTanker ? tankersCount?.allCount : dataForNewCount) ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ type: type }, 'page', 'childEquipmentId', 'status', 'activityType')}
      />
      {isTanker && (
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="min-w-0 flex-1">
            <TabsLayout
              showArrows
              activeTab={rest?.activityType || 'ALL'}
              tabs={autoTabs.map((tab) => ({
                id: tab.key,
                name: tab.label,
                count:
                  tab.key === AutoTabKey.ALL
                    ? tankersCount?.allCount
                    : tab.key === AutoTabKey.OIL_PRODUCTS
                      ? tankersCount?.oilCount
                      : tab.key === AutoTabKey.LPG_TRANSPORT
                        ? tankersCount?.lpgCount
                        : tab.key === AutoTabKey.CHEMICALS
                          ? tankersCount?.chemicalCount
                          : tab.key === AutoTabKey.CRYOGENIC_GASES
                            ? tankersCount?.cryogenicCount
                            : tab.key === AutoTabKey.NUCLEAR_MATERIALS
                              ? tankersCount?.radioactiveCount
                              : undefined,
              }))}
              onTabChange={(val) => {
                if (val === 'ALL') {
                  removeParams('activityType')
                } else {
                  addParams({ activityType: val }, 'page')
                }
              }}
            />
          </div>
          {(user?.role == UserRoles.MANAGER ||
            user?.role == UserRoles.REGIONAL ||
            user?.role == UserRoles.INSPECTOR ||
            user?.role == UserRoles.LEGAL ||
            user?.role == UserRoles.INDIVIDUAL) && (
            <div className="shrink-0">
              <AddPermitTransportModal />
            </div>
          )}
        </div>
      )}
      <TabsLayout
        activeTab={currentStatus}
        tabs={
          isTanker
            ? [
                { id: 'ALL', name: 'Barchasi' },
                { id: 'ACTIVE', name: 'Aktiv' },
                { id: 'EXPIRING_SOON', name: 'Muddati yaqinlashayotganlar' },
                { id: 'EXPIRED', name: 'Muddati o‘tganlar' },
              ]?.map((i) => ({
                ...i,
                count: i.id === currentStatus ? data?.page?.totalElements || 0 : undefined,
              }))
            : [
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
                {
                  id: 'CHANGED',
                  name: 'O‘zgartirish so‘rovlari',
                  count: changedCountData?.page?.totalElements || undefined,
                },
              ]?.map((i) => ({
                ...i,
                count:
                  i.id === 'CHANGED'
                    ? i.count
                    : i?.id == currentStatus
                      ? data?.page?.totalElements || undefined
                      : undefined,
              }))
        }
        onTabChange={(type) => {
          if (type === 'CHANGED') {
            addParams({ status: type, changeStatus: 'ALL' }, 'page')
          } else {
            addParams({ status: type, changeStatus: '' }, 'page')
          }
        }}
      />
      {currentStatus === 'CHANGED' && (
        <TabsLayout
          activeTab={changeStatus?.toString()}
          tabs={[
            { id: 'ALL', name: 'Barchasi' },
            { id: 'NEW', name: 'Yangi' },
            { id: 'IN_PROCESS', name: 'Jarayonda' },
            { id: 'IN_AGREEMENT', name: 'Kelishuvda' },
            { id: 'IN_APPROVAL', name: 'Tasdiqlashda' },
          ].map((s) => ({
            ...s,
            count: s.id === changeStatus?.toString() ? data?.page?.totalElements || undefined : undefined,
          }))}
          onTabChange={(s) => addParams({ changeStatus: s }, 'page')}
        />
      )}
      <DataTable
        showFilters
        isLoading={isLoading}
        isPaginated
        data={data || []}
        columns={isTanker ? tankerColumns : (columns as unknown as any)}
        className="flex-1"
      />
    </div>
  )
}
