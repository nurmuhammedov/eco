import { ApplicationStatus } from '@/entities/application';
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import Filter from '@/shared/components/common/filter';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { TabsLayout } from '@/shared/layouts';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const EquipmentsList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { status = ApplicationStatus.ALL, type = 'ALL', isActive = 'true', ...rest },
    addParams,
  } = useCustomSearchParams();
  const { data } = usePaginatedData<any>(`/equipments`, {
    ...rest,
    type: type !== 'ALL' ? type : '',
    isActive,
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
      header: 'Tashkilot nomi/ Fuqaro nomi',
      accessorKey: 'ownerName',
    },
    {
      header: 'Tashkilot manzili/ Fuqaro manzili',
      accessorFn: (row) => row?.ownerAddress,
    },
    {
      header: 'Tashkilot STIR/ JSHSHIR',
      accessorKey: 'ownerIdentity',
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
      accessorFn: (row) => (row.partialCheckDate ? getDate(row.partialCheckDate) : '-'),
      header: 'O‘tkazilgan qisman texnik ko‘rik sanasi',
    },
    {
      accessorFn: (row) => (row.fullCheckDate ? getDate(row.fullCheckDate) : '-'),
      header: 'To‘liq texnik ko‘rik sanasi',
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
        ...(APPLICATIONS_DATA?.filter(
          (i) => i?.category == ApplicationCategory.HOKQ && i?.parentId == MainApplicationCategory.REGISTER,
        )?.map((i) => ({
          id: i?.equipmentType?.toString() || 'ALL',
          name: i?.name?.toString() || 'Bachasi',
        })) || []),
      ]?.map((i) => ({
        ...i,
        count: i?.id == type ? data?.page?.totalElements || 0 : 0,
      }))}
      onTabChange={(type) => addParams({ type: type }, 'page', 'search', 'startDate', 'endDate')}
    >
      <TabsLayout
        activeTab={isActive?.toString()}
        tabs={[
          {
            id: 'true',
            name: 'Amaldagi qurilmalar',
          },
          {
            id: 'false',
            name: 'Reyestrdan chiqarilgan qurilmalar',
          },
        ]?.map((i) => ({
          ...i,
          count: i?.id == type ? data?.page?.totalElements || 0 : 0,
        }))}
        onTabChange={(type) => addParams({ isActive: type }, 'page', 'search', 'startDate', 'endDate')}
      >
        <Filter inputKeys={['search', 'startDate', 'endDate']} />
        <DataTable
          isPaginated
          data={data || []}
          columns={columns as unknown as any}
          className="h-[calc(100svh-420px)]"
        />
      </TabsLayout>
    </TabsLayout>
  );
};
