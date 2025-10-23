import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import Filter from '@/shared/components/common/filter';
import { apiClient } from '@/shared/api';
import { format } from 'date-fns';
import { Button } from '@/shared/components/ui/button.tsx';
import { Download } from 'lucide-react';

export const XrayList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams();
  const { data = [] } = usePaginatedData<any>(`/xrays`, { ...rest });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/xrays`);
  };

  const columns: ColumnDef<ISearchParams>[] = [
    {
      header: 'Ruxsatnoma berilgan sana',
      accessorFn: (row) => getDate(row.registrationDate),
    },
    {
      header: "Ruxsatnoma reestri bo'yicha tartib raqami",
      accessorFn: (row) => row?.registryNumber,
    },
    {
      header: 'License tizimidagi ruxsatnoma reestri  tartib raqami',
      accessorFn: (row) => row?.licenseRegistryNumber,
    },
    {
      header: 'Ruxsatnomani amal qilish muddati',
      accessorFn: (row) => row?.licenseExpiryDate,
    },
    {
      header: 'Tashkilot nomi',
      accessorFn: (row) => row?.legalName,
    },
    {
      header: 'Tashkilot STIR',
      accessorFn: (row) => row?.legalTin,
    },
    {
      header: 'Rentgen joylashgan manzil',
      accessorFn: (row) => row?.address,
    },
    {
      id: 'actions',
      maxSize: 40,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ];

  const handleDownloadExel = async () => {
    const res = await apiClient.downloadFile<Blob>('/xrays/export/excel', {
      mode: rest.mode,
      ...rest,
    });

    const blob = res.data;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date();
    const filename = `rentgenlar_${format(today, 'yyyy-MM-dd_hh:mm:ss')}.xlsx`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className={'flex justify-between items-start'}>
        <Filter inputKeys={['search', 'xrayRegionId']} />
        <Button onClick={handleDownloadExel}>
          <Download /> MS Exel
        </Button>
      </div>
      <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-300px)]" />
    </>
  );
};
