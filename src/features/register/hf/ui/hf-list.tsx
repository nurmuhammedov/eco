import { ApplicationStatus } from '@/entities/application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import Filter from '@/shared/components/common/filter';

export const HfList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { status = ApplicationStatus.ALL, ...rest },
  } = useCustomSearchParams();
  const { data = [] } = usePaginatedData<any>(`/hf`, { ...rest, status: status !== 'ALL' ? status : '' });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/hf`);
  };

  const columns: ColumnDef<ISearchParams>[] = [
    {
      header: 'Hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
    },
    {
      header: 'Hisobga olish raqami',
      accessorKey: 'registryNumber',
    },
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
    },
    {
      header: 'Tashkilot manzili',
      accessorKey: 'legalAddress',
    },
    {
      header: 'STIR',
      accessorKey: 'legalTin',
    },
    {
      header: 'XICHOning nomi',
      accessorKey: 'name',
    },
    {
      accessorKey: 'address',
      header: 'XICHO manzili',
    },
    {
      header: 'XICHOning turi',
      accessorKey: 'typeName',
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
    <>
      <Filter inputKeys={['search']} />
      <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-300px)]" />
    </>
  );
};
