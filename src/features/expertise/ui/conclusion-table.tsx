import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { formatDate } from 'date-fns';
import { tabs } from '@/features/expertise/ui/conclusion-tabs';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';
import { useNavigate } from 'react-router-dom';

export const ConclusionsTable = () => {
  const {
    paramsObject: { page = 1, size = 10, tab = 'ALL', ...rest },
  } = useCustomSearchParams();
  const navigate = useNavigate();
  const { data = [], isLoading } = usePaginatedData<any>('/conclusions', {
    page: page,
    size: size,
    type: tab == 'ALL' ? null : tab,
    ...rest,
  });

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'customerName',
      header: 'Ekspert tashkiloti nomi',
      filterKey: 'customerName',
      filterType: 'search',
    },
    {
      accessorKey: 'customerTin',
      header: 'Ekspert tashkiloti STIRi',
      filterKey: 'customerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'legalName',
      header: 'Tashkilot nomi',
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
      accessorKey: 'objectName',
      header: 'Obyektning nomi',
      filterKey: 'objectName',
      filterType: 'search',
    },
    {
      accessorKey: 'type',
      header: 'Xulosa turi',
      cell: (cell) => tabs.find((t) => t?.key?.toString() == cell.row.original.type?.toString())?.label || '',
    },
    {
      accessorKey: 'registryNumber',
      header: 'Reyestr raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'registrationDate',
      maxSize: 100,
      header: 'Reyestrga qo‘yilgan sana',
      cell: (cell) =>
        cell.row.original.registrationDate ? formatDate(cell.row.original.registrationDate, 'dd.MM.yyyy') : null,
    },
    {
      id: 'actions',
      size: 10,
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              showEdit
              row={row}
              showView
              onEdit={(row: any) => navigate(`edit/${row.original.id!}`)}
              onView={(row: any) => navigate(`detail/${row.original.id!}`)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      showNumeration={true}
      isPaginated={true}
      columns={columns}
      data={data}
      showFilters={true}
      isLoading={isLoading}
      className="h-[calc(100svh-460px)]"
    />
  );
};
