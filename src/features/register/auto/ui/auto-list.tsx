import { ApplicationStatus } from '@/entities/application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, useData, usePaginatedData } from '@/shared/hooks';
import { TabsLayout } from '@/shared/layouts';
import { useNavigate } from 'react-router-dom';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';
import { AutoTabKey, AutoTabs } from '@/features/register/auto/ui/auto-tabs';
import { formatDate } from 'date-fns';

export const AutoList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { status = ApplicationStatus.ALL, type = AutoTabKey.ALL, page = 1, size = 10, search = '' },
    addParams,
  } = useCustomSearchParams();

  const { data } = useData<any>('/auto/count', false);

  const { data: list } = usePaginatedData<any>(
    `/auto`,
    {
      page,
      size,
      search,
      type: type !== 'ALL' ? type : '',
      status: status !== 'ALL' ? status : '',
    },
    false,
  );

  const tabCounts = {
    [AutoTabKey.ALL]: data?.allCount ?? 0,
    [AutoTabKey.OIL_PRODUCTS]: data?.oilProductsCount ?? 0,
    [AutoTabKey.LPG_TRANSPORT]: data?.lpgTransportCount ?? 0,
    [AutoTabKey.CHEMICALS]: data?.chemicalsCount ?? 0,
    [AutoTabKey.CRYOGENIC_GASES]: data?.cryogenicGasesCount ?? 0,
    [AutoTabKey.NUCLEAR_MATERIALS]: data?.nuclearMaterialsCount ?? 0,
  };

  const handleViewApplication = (id: string, legalTin: string) => {
    navigate(`${id}/auto?tin=${legalTin}`);
  };

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      accessorKey: 'legalTin',
      header: 'Tashkilot STIRi',
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'Yuridik manzili',
      filterKey: 'address',
      filterType: 'search',
    },
    {
      accessorKey: 'conclusionNumber',
      header: 'Xulosa raqami',
      filterKey: 'conclusionNumber',
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
    },
    {
      accessorKey: 'autoNumber',
      header: 'Davlat raqam belgisi',
      filterKey: 'autoNumber',
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
      cell: (cell) => (cell.row.original.expiryDate ? formatDate(cell.row.original.expiryDate, 'dd.MM.yyyy') : null),
    },
    {
      id: 'actions',
      maxSize: 50,
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showDelete
          onView={(row) => handleViewApplication(row.original.id, row.original.legalTin)}
        />
      ),
    },
  ];

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
          count: i?.id == status ? (data?.page?.totalElements ?? 0) : undefined,
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
  );
};
