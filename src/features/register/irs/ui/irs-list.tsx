import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const IrsList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams();
  const { data = [] } = usePaginatedData<any>(`/irs`, { ...rest });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/irs`);
  };

  const columns: ColumnDef<ISearchParams>[] = [
    {
      header: 'Hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
    },
    {
      id: 'actions',
      maxSize: 40,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ];

  return (
    <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-220px)]" />
  );
};
