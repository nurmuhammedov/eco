import { ApplicationStatus } from '@/entities/application';
import { APPLICATIONS_DATA } from '@/entities/create-application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const EquipmentsList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { status = ApplicationStatus.ALL, type = '', ...rest },
  } = useCustomSearchParams();
  const { data = [] } = usePaginatedData<any>(`/equipments`, { ...rest, type, status: status !== 'ALL' ? status : '' });

  const handleViewApplication = (id: string) => {
    navigate(`detail/${id}`);
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
      header: 'Qurilmaning turi',
      cell: (cell) => APPLICATIONS_DATA?.find((i) => i?.equipmentType == cell.row.original.type)?.title || '',
    },
    {
      header: 'Qurilmaning egasi',
      accessorKey: 'legalName',
    },
    {
      header: 'Tashkilot STIR',
      accessorKey: 'legalTin',
    },
    {
      header: 'Qurilmaning zavod raqami',
      accessorKey: 'factoryNumber',
    },
    {
      header: 'XICHO nomi',
      accessorKey: 'hfName',
    },
    {
      accessorKey: 'address',
      header: 'Qurilma manzili',
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
