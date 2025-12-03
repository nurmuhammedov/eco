import { ApplicationStatus } from '@/entities/application';
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { TabsLayout } from '@/shared/layouts';
import { getDate } from '@/shared/utils/date';
import { useNavigate } from 'react-router-dom';
import useData from '@/shared/hooks/api/useData';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';

export const EquipmentsList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: {
      status = ApplicationStatus.ALL,
      type = 'ALL',
      page = 1,
      size = 10,
      search = '',
      mode = '',
      officeId = '',
      regionId = '',
    },
    addParams,
  } = useCustomSearchParams();

  const { data } = usePaginatedData<any>(`/equipments`, {
    page,
    size,
    search,
    officeId,
    regionId,
    mode,
    type: type !== 'ALL' ? type : '',
    status: status !== 'ALL' ? status : '',
  });

  const { data: dataForNewCount } = useData<number>(`/equipments/count`, true, {
    type: type !== 'ALL' ? type : '',
  });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/equipments`);
  };

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Hisobga olish sanasi',
      maxSize: 95,
      accessorFn: (row) => getDate(row.registrationDate),
    },
    {
      header: 'Hisobga olish raqami',
      accessorKey: 'registryNumber',
      maxSize: 90,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Qurilma',
      cell: (cell) => APPLICATIONS_DATA?.find((i) => i?.equipmentType == cell.row.original.type)?.name || '',
    },
    {
      header: 'Qurilmaning turi',
      accessorKey: 'childEquipment',
      maxSize: 150,
    },
    {
      header: 'Tashkilot/Fuqaro nomi',
      accessorKey: 'ownerName',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot/Fuqaro manzili',
      accessorFn: (row) => row?.ownerAddress,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR/JSHSHIR',
      accessorKey: 'ownerIdentity',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Qurilmaning zavod raqami',
      accessorKey: 'factoryNumber',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'XICHO nomi',
      accessorKey: 'hfName',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'Qurilma manzili',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      accessorFn: (row) => (row.partialCheckDate ? getDate(row.partialCheckDate) : '-'),
      maxSize: 95,

      header: 'O‘tkazilgan qisman (CHTO) yoki toʻliq texnik koʻrik (PTO) sanasi',
    },
    {
      accessorFn: (row) => (row.fullCheckDate ? getDate(row.fullCheckDate) : '-'),
      maxSize: 120,
      header: 'O‘tkaziladigan qisman (CHTO) yoki toʻliq texnik koʻrik (PTO) sanasi',
    },
    {
      id: 'actions',
      maxSize: 50,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ];

  // const handleDownloadExel = async () => {
  //   const res = await apiClient.downloadFile<Blob>('/equipments/export/excel', {
  //     ...rest,
  //     type: type !== 'ALL' ? type : '',
  //     status: status !== 'ALL' ? status : '',
  //   });
  //   const blob = res.data;
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   const today = new Date();
  //   const filename = `Qurilmalar (${format(today, 'yyyy-MM-dd_hh:mm:ss')}).xlsx`;
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   URL.revokeObjectURL(url);
  // };

  return (
    <div className="flex flex-col gap-2">
      <TabsLayout
        activeTab={type}
        tabs={[
          {
            id: 'ALL',
            name: 'Barcha qurilmalar',
          },
          ...(APPLICATIONS_DATA?.filter(
            (i) => i?.category == ApplicationCategory.EQUIPMENTS && i?.parentId == MainApplicationCategory.REGISTER,
          )?.map((i) => ({
            id: i?.equipmentType?.toString() || '',
            name: i?.name?.toString() || '',
          })) || []),
        ]?.map((i) => ({
          ...i,
          count: i?.id == type ? (dataForNewCount ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ type: type }, 'page')}
      />
      <TabsLayout
        activeTab={status?.toString()}
        tabs={[
          {
            id: 'ALL',
            name: 'Barchasi',
          },
          {
            id: 'ACTIVE',
            name: 'Amaldagi qurilmalar',
          },
          {
            id: 'INACTIVE',
            name: 'Reyestrdan chiqarilgan qurilmalar',
          },
          {
            id: 'EXPIRED',
            name: 'Muddati o‘tgan qurilmalar',
          },
          {
            id: 'NO_DATE',
            name: 'Muddati kiritilmaganlar',
          },
        ]?.map((i) => ({
          ...i,
          count: i?.id == status ? (data?.page?.totalElements ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ status: type }, 'page')}
      />

      <DataTable
        showFilters
        isPaginated
        data={data || []}
        columns={columns as unknown as any}
        className="h-[calc(100svh-320px)]"
      />
    </div>
  );
};
