import { PreventionList } from '@/entities/prevention';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const PendingList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams();
  const { data, isLoading } = usePaginatedData<any>(`/appeals/attestation/pending`, {
    ...rest,
    page: rest.page || 1,
    size: rest?.size || 10,
  });

  const columns: ColumnDef<PreventionList>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
    },
    {
      header: 'Tashkilot STIR',
      accessorKey: 'tin',
    },
    {
      header: 'Tashkilot joylashgan hudud',
      accessorKey: 'regionName',
    },
    {
      header: 'Tashkilot manzili',
      accessorKey: 'legalAddress',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={() => navigate(`/attestations/detail/${row.original.id}`)}
            />
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data || []} isLoading={isLoading} className="h-[calc(100svh-320px)]" />;
};
