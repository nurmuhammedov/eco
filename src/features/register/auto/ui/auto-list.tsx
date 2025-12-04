import { ApplicationStatus } from '@/entities/application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { TabsLayout } from '@/shared/layouts'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { AutoTabKey, AutoTabs, tabs } from '@/features/register/auto/ui/auto-tabs'
import { formatDate } from 'date-fns'

export const AutoList = ({ tankersCount }: any) => {
  const navigate = useNavigate()
  const {
    paramsObject: { status = ApplicationStatus.ALL, type = AutoTabKey.ALL, page = 1, size = 10, search = '', ...rest },
    addParams,
  } = useCustomSearchParams()

  const { data: list } = usePaginatedData<any>(`/tankers`, {
    page,
    size,
    search,
    activityType: type !== 'ALL' ? type : '',
    status: status !== 'ALL' ? status : '',
    ...rest,
  })

  const tabCounts = {
    [AutoTabKey.ALL]: tankersCount?.allCount ?? 0,
    [AutoTabKey.OIL_PRODUCTS]: tankersCount?.oilCount ?? 0,
    [AutoTabKey.LPG_TRANSPORT]: tankersCount?.lpgCount ?? 0,
    [AutoTabKey.CHEMICALS]: tankersCount?.chemicalCount ?? 0,
    [AutoTabKey.CRYOGENIC_GASES]: tankersCount?.cryogenicCount ?? 0,
    [AutoTabKey.NUCLEAR_MATERIALS]: tankersCount?.radioactiveCount ?? 0,
  }

  const handleViewApplication = (id: string, legalTin: string) => {
    navigate(`${id}/auto?tin=${legalTin}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'name',
      filterKey: 'name',
      filterType: 'search',
    },
    {
      accessorKey: 'tin',
      header: 'Tashkilot STIRi',
      filterKey: 'tin',
      filterType: 'search',
    },
    {
      accessorKey: 'registerNumber',
      header: 'Xulosa raqami',
      filterKey: 'registerNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'expiryDate',
      header: 'Xulosa amal qilish muddati',
      cell: (cell) => (cell.row.original.expiryDate ? formatDate(cell.row.original.expiryDate, 'dd.MM.yyyy') : null),
    },
    {
      accessorKey: 'activityTypeName',
      header: 'Faoliyat turi',
      cell: (cell) =>
        cell.row.original.activityType
          ? tabs?.find((i) => i?.key == cell.row.original?.activityType)?.label || '-'
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
      accessorKey: 'expiryDate',
      header: 'Texnik ko‘rik amal qilish muddati',
      cell: (cell) => (cell.row.original.validUntil ? formatDate(cell.row.original.validUntil, 'dd.MM.yyyy') : null),
    },
    {
      id: 'actions',
      maxSize: 50,
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showDelete
          onView={(row) => handleViewApplication(row.original.id, row.original.tin)}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      <AutoTabs activeTab={type} onTabChange={(tabKey) => addParams({ type: tabKey }, 'page')} counts={tabCounts} />

      <TabsLayout
        activeTab={status?.toString()}
        tabs={[
          {
            id: 'ALL',
            name: 'Barchasi',
          },
          {
            id: 'ACTIVE',
            name: 'Aktiv',
          },
          {
            id: 'EXPIRING_SOON',
            name: 'Muddati yaqinlashayotganlar',
          },
          {
            id: 'EXPIRED',
            name: 'Muddati o‘tganlar',
          },
        ]?.map((i) => ({
          ...i,
          count: i?.id == status ? (list?.page?.totalElements ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ status: type }, 'page')}
      />

      <DataTable
        showFilters
        isPaginated
        data={list || []}
        columns={columns as unknown as any}
        className="h-[calc(100svh-375px)]"
      />
    </div>
  )
}
