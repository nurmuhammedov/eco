import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { formatDate } from 'date-fns';
import { PermitDetailModal } from '@/features/permits/ui/permit-detail-modal';
import { tabs } from '@/features/permits/ui/permit-tabs';

export const PermitTable = () => {
  const {
    addParams,
    paramsObject: { currentTab = 'ALL', page = 1, size = 10, tab = 'ALL' },
  } = useCustomSearchParams();
  const { data = [], isLoading } = usePaginatedData<any>('/permits', {
    page: page,
    size: size,
    type: tab == 'ALL' ? null : tab,
    status: currentTab == 'ALL' ? null : currentTab,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'tin',
      header: 'Tashkilotning STIR (JSHSHIR)',
    },
    {
      accessorKey: 'name',
      header: 'Tashkilot nomi',
    },
    {
      accessorKey: 'type',
      header: 'Turi',
      cell: (cell) => tabs.find((t) => t?.key?.toString() == cell.row.original.type?.toString())?.label || '',
    },
    {
      accessorKey: 'documentName',
      header: 'Hujjat nomi',
      minSize: 300,
    },
    {
      accessorKey: 'registerNumber',
      header: 'Ro‘yxatga olingan raqami',
    },
    {
      accessorKey: 'createdAt',
      maxSize: 100,
      header: 'Ro‘yxatga olingan sanasi',
      cell: (cell) => formatDate(cell.row.original.createdAt, 'dd.MM.yyyy'),
    },
    {
      id: 'actions',
      size: 10,
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={() => {
                console.log('asdasd');
                addParams({ detailId: row.original.id });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <Tabs
          value={currentTab}
          onValueChange={(val) => {
            addParams({ currentTab: val, page: 1 });
          }}
        >
          <TabsList>
            <TabsTrigger value="ALL">Barchasi</TabsTrigger>
            <TabsTrigger value="ACTIVE">Aktiv</TabsTrigger>
            {/*<TabsTrigger value="INACTIVE">Aktiv emas</TabsTrigger>*/}
            <TabsTrigger value="EXPIRING_SOON">Muddati yaqinlashayotganlar</TabsTrigger>
            <TabsTrigger value="EXPIRED">Muddatidan o‘tganlar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <DataTable
        showNumeration={true}
        isPaginated={true}
        columns={columns}
        data={data}
        isLoading={isLoading}
        className="h-[calc(100svh-430px)]"
      />
      <PermitDetailModal />
    </>
  );
};
