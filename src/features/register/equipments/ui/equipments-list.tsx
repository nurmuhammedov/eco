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
import { Badge } from '@/shared/components/ui/badge'
import { useParkSelectQuery } from '@/entities/admin/park/hooks/use-park-select-query'
import { ApplicationTypeEnum } from '@/entities/create-application/types/enums'
import { useMemo } from 'react'

interface EquipmentsListProps {
  isArchive?: boolean
}

export const EquipmentsList = ({ isArchive }: EquipmentsListProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    paramsObject: {
      status = isArchive ? 'INACTIVE' : 'ACTIVE',
      type = 'ALL',
      page = 1,
      size = 10,
      search = '',
      mode = '',
      regionId = (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) && user?.regionId
        ? user.regionId.toString()
        : 'ALL',
      districtId = '',
      registryNumber = '',
      childEquipmentId = '',
      ownerName = '',
      ownerIdentity = '',
      hfName = '',
      parkId = '',
      address = '',
      startDate = '',
      endDate = '',
      factoryNumber = '',
      changeStatus = 'ALL',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tab = '',
      ...rest
    },
    addParams,
    removeParams,
  } = useCustomSearchParams()

  const isAutoCrane = type === 'AUTO_CRANE'
  const equipmentType = isAutoCrane ? 'CRANE' : type
  const actualChildEquipmentId = isAutoCrane ? '31' : childEquipmentId

  const currentStatus = String(status)
  const isTanker = type === 'TANKERS'

  const { data: parks } = useParkSelectQuery(regionId, districtId)
  const parkOptions = useMemo(() => parks?.map((p: any) => ({ name: p.name, id: String(p.id) })) || [], [parks])

  const {
    data,
    isLoading,
    totalElements = 0,
  } = usePaginatedData<any>(isTanker ? `/tankers` : `/equipments`, {
    ...rest,
    regionId: regionId === 'ALL' ? '' : regionId,
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
    active: isTanker
      ? ''
      : isArchive
        ? false
        : currentStatus === 'ACTIVE'
          ? true
          : currentStatus === 'INACTIVE'
            ? false
            : currentStatus === 'CHANGED'
              ? 'true'
              : true,
    changed: isTanker || isArchive ? '' : currentStatus === 'CHANGED' ? true : '',
    changeStatus: isTanker ? '' : currentStatus === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
    type: !isTanker && equipmentType !== 'ALL' ? equipmentType : '',
    page,
    size,
    search,
    districtId,
    mode,
    registryNumber,
    childEquipmentId: actualChildEquipmentId,
    ownerName,
    ownerIdentity,
    hfName,
    parkId,
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
      active: 'true',
      type: !isTanker && equipmentType !== 'ALL' ? equipmentType : '',
      childEquipmentId: actualChildEquipmentId,
      regionId: regionId === 'ALL' ? '' : regionId,
      size: 1,
    },
    !isArchive
  )

  const { data: dataForNewCount } = useData<number>(`/equipments/count`, !isTanker && !isAutoCrane, {
    type: !isTanker && type !== 'ALL' ? type : '',
    active: !isArchive,
    regionId: regionId === 'ALL' ? '' : regionId,
    districtId: districtId === 'ALL' ? '' : districtId,
  })
  const { data: tankersCount } = useData<any>('/tankers/count', isTanker && !isArchive, {
    mode,
    regionId: regionId === 'ALL' ? '' : regionId,
    districtId: districtId === 'ALL' ? '' : districtId,
  })

  const { data: childEquipmentTypes } = useChildEquipmentTypes(
    !isTanker && equipmentType !== 'ALL' ? equipmentType : ''
  )

  const handleViewApplication = (id: string) => {
    if (currentStatus === 'CHANGED') {
      navigate(`/register/change/${id}/equipments`)
    } else {
      navigate(`${id}/equipments${currentStatus === 'ACTIVE' ? '?active=true' : ''}`)
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
      header: 'Berilgan ruxsatnomaning ro‘yxatga olish raqami',
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
      filterType: isAutoCrane ? undefined : 'select',
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
      header: type === ApplicationTypeEnum.ATTRACTION ? 'Park nomi' : 'XICHO nomi',
      accessorKey: type === ApplicationTypeEnum.ATTRACTION ? 'parkName' : 'hfName',
      filterKey: type === ApplicationTypeEnum.ATTRACTION ? 'parkId' : 'hfName',
      filterType: type === ApplicationTypeEnum.ATTRACTION ? 'select' : 'search',
      filterOptions: type === ApplicationTypeEnum.ATTRACTION ? parkOptions : undefined,
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
    ...(currentStatus === 'CHANGED'
      ? [
          {
            header: 'So‘rov turi',
            accessorKey: 'changeBelongType',
            cell: ({ row }: any) => {
              const type = row.original.changeBelongType
              if (type?.startsWith('UPDATE')) {
                return (
                  <Badge variant="info" className="py-1">
                    Maʼlumotlarni o‘zgartirish uchun
                  </Badge>
                )
              }
              if (type?.startsWith('DEREGISTER')) {
                return (
                  <Badge variant="error" className="py-1">
                    Reyestardan chiqarish uchun
                  </Badge>
                )
              }
              return '-'
            },
          },
        ]
      : []),
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <DataTableRowActions
          showView
          showEdit={
            !isArchive &&
            !isTanker &&
            ((user?.role === UserRoles.INSPECTOR &&
              (Number(row.original.regionId) === user?.regionId || user?.isController)) ||
              user?.role === UserRoles.LEGAL ||
              user?.role === UserRoles.INDIVIDUAL) &&
            ['ACTIVE', 'EXPIRED', 'NO_DATE'].includes(currentStatus)
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
          ...(isArchive
            ? [
                {
                  id: 'ELEVATOR',
                  name: 'Liftlar',
                },
              ]
            : []),
          ...(APPLICATIONS_DATA?.filter(
            (i) => i?.category == ApplicationCategory.EQUIPMENTS && i?.parentId == MainApplicationCategory.REGISTER
          )?.reduce((acc, i) => {
            const item = {
              id: i?.equipmentType?.toString() || '',
              name: i?.name?.toString() || '',
            }
            acc.push(item)
            if (item.id === 'CRANE') {
              acc.push({
                id: 'AUTO_CRANE',
                name: 'Avtokranlar',
              })
            }
            return acc
          }, [] as any[]) || []),
          ...(!isArchive
            ? [
                {
                  id: 'TANKERS',
                  name: 'Harakatlanuvchi sig‘imlar',
                },
              ]
            : []),
        ]?.map((i) => ({
          ...i,
          count:
            i?.id === type
              ? i?.id === 'AUTO_CRANE'
                ? totalElements
                : ((isTanker ? tankersCount?.allCount : dataForNewCount) ?? 0)
              : undefined,
        }))}
        onTabChange={(type) => addParams({ type: type }, 'page', 'childEquipmentId', 'status', 'activityType')}
      />
      {!isAutoCrane && isTanker && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
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
            <div className="w-full shrink-0 md:w-auto">
              <AddPermitTransportModal />
            </div>
          )}
        </div>
      )}

      {!isArchive && (
        <TabsLayout
          activeTab={currentStatus}
          tabs={
            isTanker
              ? [
                  { id: 'ALL', name: 'Barchasi', count: currentStatus === 'ALL' ? totalElements : undefined },
                  { id: 'ACTIVE', name: 'Aktiv', count: currentStatus === 'ACTIVE' ? totalElements : undefined },
                  {
                    id: 'EXPIRING_SOON',
                    name: 'Muddati yaqinlashayotganlar',
                    count: currentStatus === 'EXPIRING_SOON' ? totalElements : undefined,
                  },
                  {
                    id: 'EXPIRED',
                    name: 'Muddati o‘tganlar',
                    count: currentStatus === 'EXPIRED' ? totalElements : undefined,
                  },
                ]
              : [
                  // {
                  //   id: 'ALL',
                  //   name: isAutoCrane ? 'Barcha avtokranlar' : 'Barchasi',
                  //   count: currentStatus === 'ALL' ? totalElements : undefined,
                  // },
                  {
                    id: 'ACTIVE',
                    name: isAutoCrane ? 'Reyestrdagi avtokranlar' : 'Reyestrdagi qurilmalar',
                    count: currentStatus === 'ACTIVE' ? totalElements : undefined,
                  },
                  // {
                  //   id: 'INACTIVE',
                  //   name: isAutoCrane ? 'Reyestrdan chiqarilgan avtokranlar' : 'Reyestrdan chiqarilgan qurilmalar',
                  //   count: currentStatus === 'INACTIVE' ? totalElements : undefined,
                  // },
                  {
                    id: 'EXPIRED',
                    name: isAutoCrane ? 'Muddati o‘tgan avtokranlar' : 'Muddati o‘tgan qurilmalar',
                    count: currentStatus === 'EXPIRED' ? totalElements : undefined,
                  },
                  {
                    id: 'NO_DATE',
                    name: isAutoCrane ? 'Muddati kiritilmagan avtokranlar' : 'Muddati kiritilmaganlar',
                    count: currentStatus === 'NO_DATE' ? totalElements : undefined,
                  },
                  {
                    id: 'CHANGED',
                    name: isAutoCrane ? 'O‘zgartirish so‘rovlari' : 'O‘zgartirish so‘rovlari',
                    count: changedCountData?.page?.totalElements || undefined,
                  },
                ]
          }
          onTabChange={(type) => {
            if (type === 'CHANGED') {
              addParams({ status: type, changeStatus: 'ALL' }, 'page')
            } else {
              addParams({ status: type, changeStatus: '' }, 'page')
            }
          }}
        />
      )}
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
