import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { getDate } from '@/shared/utils/date';
import { useNavigate } from 'react-router-dom';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';

export const HfList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { page = 1, size = 10, search = '', mode = '', hfOfficeId = '' },
  } = useCustomSearchParams();

  const { data = [] } = usePaginatedData<any>(`/hf`, { page, size, search, mode, officeId: hfOfficeId });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/hf`);
  };
  //
  // const handleDownloadExel = async () => {
  //   const res = await apiClient.downloadFile<Blob>('/hf/export/excel', {
  //     mode,
  //     search,
  //   });
  //
  //   const blob = res.data;
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   const today = new Date();
  //   const filename = `XICHOlar (${format(today, 'yyyy-MM-dd_hh:mm:ss')}).xlsx`;
  //   a.href = url;
  //   a.download = filename;
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   URL.revokeObjectURL(url);
  // };

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
    },
    {
      header: 'Hisobga olish raqami',
      accessorKey: 'registryNumber',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      accessorKey: 'legalAddress',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'STIR',
      accessorKey: 'legalTin',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'XICHOning nomi',
      accessorKey: 'name',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'XICHO manzili',
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'XICHOning turi',
      accessorKey: 'typeName',
      filterKey: 'search',
      filterType: 'search',
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
      {/*<div className={'flex justify-between items-start'}>*/}
      {/*  <Filter inputKeys={['search', 'mode', 'hfOfficeId']} />*/}
      {/*  <Button onClick={handleDownloadExel}>*/}
      {/*    <Download /> MS Exel*/}
      {/*  </Button>*/}
      {/*</div>*/}

      <DataTable
        showFilters={true}
        isPaginated
        data={data || []}
        columns={columns as unknown as any}
        className="h-[calc(100svh-220px)]"
      />
    </>
  );
};
