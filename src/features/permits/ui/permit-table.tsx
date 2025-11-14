import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { formatDate } from 'date-fns';
import { PermitDetailModal } from '@/features/permits/ui/permit-detail-modal';
import { tabs } from '@/features/permits/ui/permit-tabs';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';
import { Button } from '@/shared/components/ui/button';

export const PermitTable = ({ setIsModalOpen }: any) => {
  const {
    addParams,
    paramsObject: {
      currentTab = 'ALL',
      page = 1,
      size = 10,
      tab = 'ALL',
      registerNumber = '',
      tin = '',
      name = '',
      documentName = '',
    },
  } = useCustomSearchParams();
  const { data = [], isLoading } = usePaginatedData<any>('/permits', {
    page: page,
    size: size,
    tin: tin,
    name: name,
    registerNumber: registerNumber,
    documentName: documentName,
    type: tab == 'ALL' ? null : tab,
    status: currentTab == 'ALL' ? null : currentTab,
  });

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'tin',
      header: 'Tashkilotning STIR (JSHSHIR)',
      filterKey: 'tin',
      filterType: 'search',
    },
    {
      accessorKey: 'name',
      header: 'Tashkilot nomi',
      filterKey: 'name',
      filterType: 'search',
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
      filterKey: 'documentName',
      filterType: 'search',
    },
    {
      accessorKey: 'registerNumber',
      header: 'Ro‘yxatga olingan raqami',
      filterKey: 'registerNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'createdAt',
      maxSize: 100,
      header: 'Ro‘yxatga olingan sanasi',
      cell: (cell) =>
        cell.row.original.registrationDate ? formatDate(cell.row.original.registrationDate, 'dd.MM.yyyy') : null,
    },
    {
      accessorKey: 'createdAt',
      maxSize: 100,
      header: 'Amal qilish muddati',
      cell: (cell) => (cell.row.original.expiryDate ? formatDate(cell.row.original.expiryDate, 'dd.MM.yyyy') : null),
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
      <div className="flex justify-between items-center">
        <Tabs
          value={currentTab}
          onValueChange={(val) => {
            addParams({ currentTab: val, page: 1 });
          }}
        >
          <TabsList>
            <TabsTrigger value="ALL">Barchasi</TabsTrigger>
            <TabsTrigger value="ACTIVE">Aktiv</TabsTrigger>
            <TabsTrigger value="EXPIRING_SOON">Muddati yaqinlashayotganlar</TabsTrigger>
            <TabsTrigger value="EXPIRED">Muddatidan o‘tganlar</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button type="button" onClick={() => setIsModalOpen((p: boolean) => !p)}>
          Qo‘shish
        </Button>
      </div>
      <DataTable
        showNumeration={true}
        isPaginated={true}
        columns={columns}
        data={data}
        showFilters={true}
        isLoading={isLoading}
        className="h-[calc(100svh-430px)]"
      />
      <PermitDetailModal />
    </>
  );
};
