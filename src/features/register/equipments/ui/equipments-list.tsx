import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { TabsLayout } from '@/shared/layouts'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { AddPermitTransportModal } from '@/features/register/auto/ui/add-auto-modal'
import useData from '@/shared/hooks/api/use-data'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { changeTypeColumn } from '@/features/register/model/change-type-column'
import { EquipmentRow } from '@/features/register/model/types'
import { useChildEquipmentTypes } from '@/shared/api/dictionaries'
import { UserRoles } from '@/shared/types/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { AutoTabKey, tabs as autoTabs } from '@/features/register/auto/model/auto-tabs'
import { formatDate } from 'date-fns'
import { useParkSelectQuery } from '@/entities/admin/park/hooks/use-park-select-query'
import { ApplicationTypeEnum } from '@/entities/create-application/types/enums'
import { useMemo } from 'react'
import { canUpdateRegistryType } from '@/features/register/model/can-update-registry'
import { TruncatedCell } from '@/shared/components/common/truncated-cell'
import { CRANE_TAB_CHILD_ID, buildRegisterQuery } from '@/features/register/model/build-register-query'
import { REPORT_KEYS, RESET_KEYS } from '@/features/register/model/report-drill-down'
import { RegisterActiveTab } from '@/features/register/model/register-tabs'
import { paramText } from '@/shared/lib/url-params'

interface EquipmentsListProps {
  isArchive?: boolean
  hfId?: string
  hideTabs?: boolean
  isShortView?: boolean
}

/** Attractions and escalators stand in parks rather than on a hazardous facility */
const PARK_TYPES: string[] = [ApplicationTypeEnum.ATTRACTION, ApplicationTypeEnum.ESCALATOR]

export const EquipmentsList = ({ isArchive, hfId, hideTabs, isShortView }: EquipmentsListProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { paramsObject, addParams, removeParams } = useCustomSearchParams()

  // Arriving from the deregistration report: the status came with the link.
  const fromReport = !!paramsObject.reportChangeBelongType

  const defaultRegionId =
    (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) && user?.regionId
      ? user.regionId.toString()
      : 'ALL'

  const { page = 1, size = 10 } = paramsObject
  const status = paramText(paramsObject.status, isArchive ? 'INACTIVE' : 'ACTIVE')
  const type = paramText(paramsObject.type, 'ALL')
  const regionId = paramText(paramsObject.regionId, defaultRegionId)
  const districtId = paramText(paramsObject.districtId)
  const childEquipmentId = paramText(paramsObject.childEquipmentId)
  const changeStatus = paramText(paramsObject.changeStatus, 'ALL')
  const mode = paramText(paramsObject.mode)
  const activityType = paramText(paramsObject.activityType)
  const isParkType = PARK_TYPES.includes(type)

  // A crane tab pinned to one child type - the type filter has nothing left to offer.
  const pinnedChildId = CRANE_TAB_CHILD_ID[String(type)]
  const isPinnedCrane = !!pinnedChildId
  const equipmentType = isPinnedCrane ? 'CRANE' : type
  const actualChildEquipmentId = pinnedChildId ?? childEquipmentId

  const currentStatus = String(status)
  const isTanker = type === 'TANKERS'

  const tabNoun = type === 'AUTO_CRANE' ? 'avtokranlar' : type === 'TOWER_CRANE' ? 'minorali kranlar' : 'qurilmalar'

  const { data: parks } = useParkSelectQuery(regionId, districtId)
  const parkOptions = useMemo(() => parks?.map((p) => ({ name: p.name, id: String(p.id) })) || [], [parks])

  const { endpoint, params } = buildRegisterQuery({
    tab: RegisterActiveTab.EQUIPMENTS,
    paramsObject,
    isArchive,
    defaultRegionId,
    hfId,
  })

  const { data, isLoading, totalElements = 0 } = usePaginatedData<EquipmentRow>(endpoint, { page, size, ...params })

  const { data: changedCountData } = usePaginatedData<EquipmentRow>(
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

  const { data: dataForNewCount } = useData<number>(`/equipments/count`, !isTanker && !isPinnedCrane, {
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
      navigate(`/register/change/equipments/${id}`)
    } else {
      const query = ['ACTIVE', 'VALID', 'INVALID'].includes(currentStatus) ? `?active=true&status=${currentStatus}` : ''
      navigate(`equipments/${id}${query}`)
    }
  }

  const handleEditApplication = (id: string, type?: string, tin?: string | number) => {
    if (isTanker) return
    navigate(`/register/update/${type}/${id}?tin=${tin}`)
  }

  const tankerColumns: ExtendedColumnDef<EquipmentRow, unknown>[] = [
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
      filterKey: 'tin',
      filterType: 'number',
      filterMaxLength: 14,
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
              `auto/${row.original.id}?tin=${row.original.tin ? row.original.tin : row.original.pin ? row.original.pin : null}`
            )
          }
        />
      ),
    },
  ]

  const allColumns: ExtendedColumnDef<EquipmentRow, unknown>[] = [
    {
      id: 'registrationDate',
      header: () => (
        <div className="whitespace-nowrap">
          Ro‘yxatga olish <br /> sanasi
        </div>
      ),
      accessorFn: (row) => getDate(row.registrationDate),
      className: '!w-[1%]',
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: () => (
        <div className="whitespace-nowrap">
          Ro‘yxatga olish <br /> raqami
        </div>
      ),
      accessorKey: 'registryNumber',
      className: '!w-[1%]',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'Qurilma',
      cell: (cell) =>
        cell.row.original.type == 'ELEVATOR'
          ? 'Lift'
          : APPLICATIONS_DATA?.find((i) => i?.equipmentType == cell.row.original.type)?.name || '',
    },
    {
      header: 'Qurilmaning turi',
      accessorKey: 'childEquipment',
      maxSize: 150,
      filterKey: 'childEquipmentId',
      filterType: isPinnedCrane ? undefined : 'select',
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
      header: isParkType ? 'Park/Maskan nomi' : 'XICHO nomi',
      accessorKey: isParkType ? 'parkName' : 'hfName',
      filterKey: isParkType ? 'parkId' : 'hfName',
      filterType: isParkType ? 'select' : 'search',
      filterOptions: isParkType ? parkOptions : undefined,
    },
    {
      accessorKey: 'address',
      header: 'Qurilma manzili',
      className: 'max-w-[220px]',
      filterKey: 'address',
      filterType: 'search',
      cell: ({ row }) => <TruncatedCell value={row.original?.address} />,
    },
    {
      accessorKey: 'factoryNumber',
      header: () => <div className="whitespace-nowrap">Zavod raqami</div>,
      className: 'max-w-[180px]',
      filterKey: 'factoryNumber',
      filterType: 'search',
      // A park carries every one of its factory numbers in this one field.
      cell: ({ row }) => <TruncatedCell value={row.original?.factoryNumber} />,
    },
    {
      accessorFn: (row) => (row.nextPartialCheckDate ? getDate(row.nextPartialCheckDate) : '-'),
      id: 'nextPartialCheckDate',
      header: () => (
        <div className="whitespace-nowrap">
          Keyingi qisman <br /> texnik ko‘rik <br /> sanasi
        </div>
      ),
      className: '!w-[1%]',
    },
    {
      id: 'nextFullCheckDate',
      accessorFn: (row) => (row.nextFullCheckDate ? getDate(row.nextFullCheckDate) : '-'),
      header: () => (
        <div className="whitespace-nowrap">
          Keyingi to‘liq <br /> texnik ko‘rik <br /> sanasi
        </div>
      ),
      className: '!w-[1%]',
    },
    {
      id: 'expertiseExpiryDate',
      accessorFn: (row) => (row.expertiseExpiryDate ? getDate(row.expertiseExpiryDate) : '-'),
      header: () => (
        <div className="whitespace-nowrap">
          Ekspertiza xulosasi <br /> muddati
        </div>
      ),
      className: '!w-[1%]',
    },
    ...(currentStatus === 'CHANGED' ? [changeTypeColumn<EquipmentRow>()] : []),
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          showEdit={
            !isShortView &&
            !isArchive &&
            !isTanker &&
            canUpdateRegistryType(row.original?.type, user?.role) &&
            ((user?.role === UserRoles.INSPECTOR &&
              (Number(row.original.regionId) === user?.regionId || user?.isController)) ||
              user?.role === UserRoles.LEGAL ||
              user?.role === UserRoles.INDIVIDUAL) &&
            ['ACTIVE', 'EXPIRED', 'NO_DATE'].includes(currentStatus)
          }
          row={row}
          showDelete={!isShortView}
          onView={(row) => handleViewApplication(row.original?.id)}
          onEdit={(row) => handleEditApplication(row.original?.id, row.original?.type, row.original?.ownerIdentity)}
        />
      ),
    },
  ]

  const columns = allColumns.filter((col) => {
    // Only some members of the column union carry an accessor key.
    const accessorKey = 'accessorKey' in col ? col.accessorKey : undefined

    if (hfId && (accessorKey === 'hfName' || accessorKey === 'parkName')) {
      return false
    }
    if (type === 'OIL_CONTAINER') {
      return col.id !== 'nextPartialCheckDate' && col.id !== 'nextFullCheckDate'
    } else {
      return col.id !== 'expertiseExpiryDate'
    }
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      {!hideTabs && (
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
                acc.push({ id: 'AUTO_CRANE', name: 'Avtokranlar' })
                acc.push({ id: 'TOWER_CRANE', name: 'Minorali kranlar' })
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
                ? CRANE_TAB_CHILD_ID[String(i?.id)]
                  ? totalElements
                  : ((isTanker ? tankersCount?.allCount : dataForNewCount) ?? 0)
                : undefined,
          }))}
          onTabChange={(type) =>
            addParams({ type: type }, 'page', 'childEquipmentId', 'status', 'activityType', ...REPORT_KEYS)
          }
        />
      )}
      {!hideTabs && isTanker && (
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
          <div className="min-w-0 flex-1">
            <TabsLayout
              showArrows
              activeTab={activityType || 'ALL'}
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

      {!hideTabs && !isArchive && user?.role !== UserRoles.PROCURATOR && (
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
                  {
                    id: 'ACTIVE',
                    name: `Reyestrdagi ${tabNoun}`,
                    count: currentStatus === 'ACTIVE' ? totalElements : undefined,
                  },
                  {
                    id: 'VALID',
                    name: `Soz holatdagi ${tabNoun}`,
                    count: currentStatus === 'VALID' ? totalElements : undefined,
                  },
                  {
                    id: 'INVALID',
                    name: `Nosoz holatdagi ${tabNoun}`,
                    count: currentStatus === 'INVALID' ? totalElements : undefined,
                  },
                  {
                    id: 'EXPIRED',
                    name: `Muddati o‘tgan ${tabNoun}`,
                    count: currentStatus === 'EXPIRED' ? totalElements : undefined,
                  },
                  {
                    id: 'NO_DATE',
                    name: isPinnedCrane ? `Muddati kiritilmagan ${tabNoun}` : 'Muddati kiritilmaganlar',
                    count: currentStatus === 'NO_DATE' ? totalElements : undefined,
                  },
                  {
                    id: 'CHANGED',
                    name: 'O‘zgartirish so‘rovlari',
                    count: fromReport
                      ? data?.page?.totalElements || undefined
                      : changedCountData?.page?.totalElements || undefined,
                  },
                ]
          }
          onTabChange={(type) => {
            if (type === 'CHANGED') {
              addParams({ status: type, changeStatus: 'ALL' }, ...RESET_KEYS)
            } else {
              addParams({ status: type, changeStatus: '' }, ...RESET_KEYS)
            }
          }}
        />
      )}
      {!hideTabs && !fromReport && currentStatus === 'CHANGED' && (
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
          onTabChange={(s) => addParams({ changeStatus: s }, ...RESET_KEYS)}
        />
      )}
      <DataTable
        showFilters
        isLoading={isLoading}
        isPaginated
        data={data || []}
        columns={isTanker ? tankerColumns : columns}
        className="flex-1"
      />
    </div>
  )
}
