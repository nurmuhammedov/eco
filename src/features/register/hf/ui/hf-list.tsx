import { ApplicationStatus } from '@/entities/application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import Filter from '@/shared/components/common/filter';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';
import { apiClient } from '@/shared/api';
import { format } from 'date-fns';

export const HfList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { status = ApplicationStatus.ALL, ...rest },
  } = useCustomSearchParams();

  const { data = [] } = usePaginatedData<any>(`/hf`, { ...rest, status: status !== 'ALL' ? status : '' });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/hf`);
  };

  const handleDownloadExel = async () => {
    const res = await apiClient.downloadFile<Blob>('/hf/export/excel', {
      mode: rest.mode,
      ...rest,
    });

    const blob = res.data;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date();
    const filename = `xicho_${format(today, 'yyyy-MM-dd_hh:mm:ss')}.xlsx`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
      <div className={'flex justify-between items-start'}>
        <Filter inputKeys={['search', 'mode', 'officeId', 'executorId']} />
        <Button onClick={handleDownloadExel}>
          <Download /> MS Exel
        </Button>
      </div>

      <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-300px)]" />
    </>
  );
};
