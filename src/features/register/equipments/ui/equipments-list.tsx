import { ApplicationStatus } from '@/entities/application';
import { ApplicationCategory, APPLICATIONS_DATA } from '@/entities/create-application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { TabsLayout } from '@/shared/layouts';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const EquipmentsList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { status = ApplicationStatus.ALL, type = 'ALL', ...rest },
    addParams,
  } = useCustomSearchParams();
  const { data = [] } = usePaginatedData<any>(`/equipments`, {
    ...rest,
    type: type !== 'ALL' ? type : '',
    status: status !== 'ALL' ? status : '',
  });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/equipments`);
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
      cell: (cell) => APPLICATIONS_DATA?.find((i) => i?.equipmentType == cell.row.original.type)?.name || '',
    },
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
    },
    {
      header: 'Tashkilot manzili',
      accessorFn: (row) => row?.legalAddress,
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
    <TabsLayout
      activeTab={type}
      tabs={[
        {
          id: 'ALL',
          name: 'Barchasi',
        },
        ...(APPLICATIONS_DATA?.filter((i) => i?.category == ApplicationCategory.HOKQ)?.map((i) => ({
          id: i?.equipmentType?.toString() || 'ALL',
          name: i?.name?.toString() || 'Bachasi',
        })) || []),
      ]}
      onTabChange={(type) => addParams({ type: type }, 'page')}
    >
      <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-320px)]" />
    </TabsLayout>
  );
};
