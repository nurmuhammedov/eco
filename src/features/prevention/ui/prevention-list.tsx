import { PreventionList, useDeletePrevention } from '@/entities/prevention';
import { UserRoles } from '@/entities/user';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/shared/hooks/use-auth';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface PreventionListProps {
  data: any;
  isLoading: boolean;
  isPassed: boolean;
}

export const PreventionListTable: FC<PreventionListProps> = ({ data, isLoading, isPassed }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: deletePrevention } = useDeletePrevention();

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
    ...(user?.role !== UserRoles.INSPECTOR && isPassed
      ? [
          {
            header: 'Inspektor',
            accessorKey: 'inspectorName',
          },
        ]
      : []),
    ...(isPassed
      ? [
          {
            header: 'Tadbir o‘tkazilgan sana',
            accessorFn: (row: any) => getDate(row.createdAt),
          },
        ]
      : []),
    ...(user?.role === UserRoles.INSPECTOR && !isPassed
      ? [
          {
            id: 'actions',
            header: 'Amallar',
            cell: ({ row }: any) => {
              return (
                <div className="flex gap-2">
                  <Button onClick={() => navigate(`/preventions/create/${row.original.tin}`)}>Tadbir o'tkazish</Button>
                </div>
              );
            },
          },
        ]
      : isPassed
        ? [
            {
              id: 'actions',
              header: 'Amallar',
              cell: ({ row }: any) => {
                return (
                  <div className="flex gap-2">
                    <DataTableRowActions
                      row={row}
                      showView
                      showDelete={user?.role === UserRoles.INSPECTOR}
                      onView={() => navigate(`/preventions/view/${row.original.id}?tin=${row.original.tin}`)}
                      onDelete={() => deletePrevention(row.original.id)}
                    />
                  </div>
                );
              },
            },
          ]
        : []),
  ];

  return <DataTable columns={columns} data={data || []} isLoading={isLoading} className="h-[calc(100svh-320px)]" />;
};
