import { IrsUsageType } from '@/entities/create-application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { getDate } from '@/shared/utils/date';
import { useNavigate } from 'react-router-dom';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';

export const IrsList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { size = 10, page = 1, mode = '', search = '', irsRegionId = '' },
  } = useCustomSearchParams();
  const { data = [] } = usePaginatedData<any>(`/irs`, { page, size, mode, regionId: irsRegionId, search });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/irs`);
  };

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'INM hisobga olish sanasi',
      maxSize: 120,
      accessorFn: (row) => getDate(row.registrationDate),
    },
    {
      header: 'INM ro‘yxat raqami',
      maxSize: 120,
      accessorFn: (row) => row?.registryNumber,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      minSize: 220,
      accessorFn: (row) => row?.legalName,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      minSize: 220,
      accessorFn: (row) => row?.legalAddress,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      maxSize: 120,
      accessorFn: (row) => row?.legalTin,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'INM manzili',
      accessorFn: (row) => row?.address,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Kategoriyasi',
      maxSize: 110,
      accessorFn: (row) => row?.category,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Aktivligi',
      maxSize: 100,
      accessorFn: (row) => row?.activity,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Soha',
      accessorFn: (row) => row?.sphere,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Radionuklid belgisi',
      maxSize: 100,
      accessorFn: (row) => row?.symbol,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Foydalanish maqsadi',
      accessorFn: (row) =>
        [
          { id: IrsUsageType.USAGE, name: 'Ishlatish (foydalanish) uchun' },
          { id: IrsUsageType.DISPOSAL, name: 'Ko‘mish uchun' },
          { id: IrsUsageType.EXPORT, name: 'Chet-elga olib chiqish uchun' },
          { id: IrsUsageType.STORAGE, name: 'Vaqtinchalik saqlash uchun' },
        ]?.find((i) => i?.id == row?.usageType)?.name || '',
    },
    {
      id: 'actions',
      maxSize: 40,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ];

  // const handleDownloadExel = async () => {
  //   const res = await apiClient.downloadFile<Blob>('/irs/export/excel', {
  //     mode: rest.mode,
  //     ...rest,
  //   });
  //
  //   const blob = res.data;
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   const today = new Date();
  //   const filename = `INMlar (${format(today, 'yyyy-MM-dd_hh:mm:ss')}).xlsx`;
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   URL.revokeObjectURL(url);
  // };

  return (
    <>
      {/*<div className={'flex justify-between items-start'}>*/}
      {/*<Filter inputKeys={['search', 'irsRegionId']} />*/}
      {/*  <Button onClick={handleDownloadExel}>*/}
      {/*    <Download /> MS Exel*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <DataTable
        showFilters
        isPaginated
        data={data || []}
        columns={columns as unknown as any}
        className="h-[calc(100svh-220px)]"
      />
    </>
  );
};
