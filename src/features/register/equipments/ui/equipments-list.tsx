import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { TabsLayout } from '@/shared/layouts'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import useData from '@/shared/hooks/api/use-data'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { changeTypeColumn } from '@/features/register/model/change-type-column'
import { EquipmentRow } from '@/features/register/model/types'
import { useChildEquipmentTypes } from '@/shared/api/dictionaries'
import { UserRoles } from '@/shared/types/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { useParkSelectQuery } from '@/entities/admin/park/hooks/use-park-select-query'
import { ApplicationTypeEnum } from '@/entities/create-application/types/enums'
import { useMemo } from 'react'
import { canUpdateRegistryType } from '@/features/register/model/can-update-registry'
import { TruncatedCell } from '@/shared/components/common/truncated-cell'
import {
  CRANE_EXCLUDED_CHILD_IDS,
  CRANE_TAB_CHILD_ID,
  NO_USAGE_RIGHTS_STATUS,
  buildRegisterQuery,
  hasNoUsageRightsTab,
  pinnedChildIds,
} from '@/features/register/model/build-register-query'
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

/** The registered equipment kinds, the two crane tabs right after cranes */
const EQUIPMENT_TABS = APPLICATIONS_DATA.filter(
  (application) =>
    application.category === ApplicationCategory.EQUIPMENTS && application.parentId === MainApplicationCategory.REGISTER
).flatMap(({ equipmentType, name }) => {
  const tab: { id: string; name: string } = { id: equipmentType ?? '', name: name ?? '' }
  return equipmentType === ApplicationTypeEnum.CRANE
    ? [tab, { id: 'AUTO_CRANE', name: 'Avtokranlar' }, { id: 'TOWER_CRANE', name: 'Minorali kranlar' }]
    : [tab]
})

export const EquipmentsList = ({ isArchive, hfId, hideTabs, isShortView }: EquipmentsListProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { paramsObject, addParams } = useCustomSearchParams()

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
  const isParkType = PARK_TYPES.includes(type)

  // A crane tab pinned to its own child types; the type filter picks among those only.
  const pinnedChildId = CRANE_TAB_CHILD_ID[String(type)]
  const pinnedChildList = pinnedChildId?.split(',') ?? []
  const isPinnedCrane = !!pinnedChildId
  const equipmentType = isPinnedCrane ? 'CRANE' : type
  // The plain crane tab shows only what the two crane tabs leave over.
  const excludedChildIds = type === 'CRANE' ? CRANE_EXCLUDED_CHILD_IDS : ''

  const currentStatus = String(status)
  const isTanker = type === 'TANKER'

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
      type: equipmentType !== 'ALL' ? equipmentType : '',
      childEquipmentId: pinnedChildId ? '' : childEquipmentId,
      childEquipmentIds: pinnedChildIds(type, childEquipmentId) ?? '',
      excludeChildEquipmentIds: excludedChildIds,
      regionId: regionId === 'ALL' ? '' : regionId,
      size: 1,
    },
    !isArchive
  )

  const { data: dataForNewCount } = useData<number>(`/equipments/count`, !isPinnedCrane, {
    type: type !== 'ALL' ? type : '',
    excludeChildEquipmentIds: excludedChildIds,
    active: !isArchive,
    regionId: regionId === 'ALL' ? '' : regionId,
    districtId: districtId === 'ALL' ? '' : districtId,
  })
  const { data: childEquipmentTypes } = useChildEquipmentTypes(equipmentType !== 'ALL' ? equipmentType : '')

  const handleViewApplication = (id: string) => {
    if (currentStatus === 'CHANGED') {
      navigate(`/register/change/equipments/${id}`)
    } else {
      // the rows of the no-usage-rights tab can be either valid or not, so no status goes along
      const query = ['ACTIVE', 'VALID', 'INVALID'].includes(currentStatus)
        ? `?active=true&status=${currentStatus}`
        : currentStatus === NO_USAGE_RIGHTS_STATUS
          ? '?active=true'
          : ''
      navigate(`equipments/${id}${query}`)
    }
  }

  const handleEditApplication = (id: string, type?: string, tin?: string | number) => {
    navigate(`/register/update/${type}/${id}?tin=${tin}`)
  }

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
      // A crane tab pinned to a single type has nothing left to pick, so it carries no filter at all.
      filterKey: pinnedChildList.length === 1 ? undefined : 'childEquipmentId',
      filterType: 'select',
      filterOptions:
        childEquipmentTypes?.filter((child) =>
          isPinnedCrane
            ? pinnedChildList.includes(String(child.id))
            : !excludedChildIds.split(',').includes(String(child.id))
        ) || [],
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
      id: 'numberPlate',
      accessorKey: 'numberPlate',
      header: () => <div className="whitespace-nowrap">Davlat raqami belgisi</div>,
      className: '!w-[1%] whitespace-nowrap',
      filterKey: 'numberPlate',
      filterType: 'search',
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
            canUpdateRegistryType(row.original?.type, user?.role) &&
            ((user?.role === UserRoles.INSPECTOR &&
              (Number(row.original.regionId) === user?.regionId || user?.isController)) ||
              user?.role === UserRoles.LEGAL ||
              user?.role === UserRoles.INDIVIDUAL) &&
            ['ACTIVE', 'EXPIRED', 'NO_DATE', NO_USAGE_RIGHTS_STATUS].includes(currentStatus)
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
    // Only a tanker carries a number plate
    if (col.id === 'numberPlate') {
      return isTanker
    }
    if (type === 'OIL_CONTAINER') {
      return col.id !== 'nextPartialCheckDate' && col.id !== 'nextFullCheckDate'
    } else {
      return isTanker || col.id !== 'expertiseExpiryDate'
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
            ...EQUIPMENT_TABS,
          ].map((tab) => ({
            ...tab,
            count: tab.id === type ? (CRANE_TAB_CHILD_ID[tab.id] ? totalElements : (dataForNewCount ?? 0)) : undefined,
          }))}
          onTabChange={(type) =>
            addParams(
              { type: type },
              'page',
              'childEquipmentId',
              'status',
              'activityType',
              'numberPlate',
              ...REPORT_KEYS
            )
          }
        />
      )}
      {!hideTabs && !isArchive && user?.role !== UserRoles.PROCURATOR && (
        <TabsLayout
          activeTab={currentStatus}
          tabs={[
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
            ...(hasNoUsageRightsTab(type)
              ? [
                  {
                    id: NO_USAGE_RIGHTS_STATUS,
                    name: `Ruxsatnomasiz ${type === 'CRANE' ? 'kranlar' : tabNoun}`,
                    count: currentStatus === NO_USAGE_RIGHTS_STATUS ? totalElements : undefined,
                  },
                ]
              : []),
            {
              id: 'CHANGED',
              name: 'O‘zgartirish so‘rovlari',
              count: fromReport
                ? data?.page?.totalElements || undefined
                : changedCountData?.page?.totalElements || undefined,
            },
          ]}
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
      <DataTable showFilters isLoading={isLoading} isPaginated data={data || []} columns={columns} className="flex-1" />
    </div>
  )
}
