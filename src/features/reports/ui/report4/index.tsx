import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import React from 'react';
import { DataTable } from '@/shared/components/common/data-table';
import { usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import Filter from '@/shared/components/common/filter';
import { GoBack } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';
import { apiClient } from '@/shared/api';
import { format } from 'date-fns';
import { ApplicationCategory, APPLICATIONS_DATA, MainApplicationCategory } from '@/entities/create-application';

const Report1: React.FC = () => {
  const { paramsObject } = useCustomSearchParams();
  const { data: inspections, isLoading } = usePaginatedData(
    '/reports/appeal-status',
    {
      ...paramsObject,
      ownerType: 'LEGAL',
    },
    false,
  );

  const columns: ColumnDef<any>[] = [
    {
      header: 'T/r',
      cell: ({ row }) => row.index + 1,
      size: 50,
    },
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      minSize: 250,
    },
    {
      header: 'XICHO',
      cell: ({ row }) => row?.original?.count || 0,
    },
    ...(APPLICATIONS_DATA.filter(
      (i) => i?.category == ApplicationCategory.EQUIPMENTS && i?.parentId == MainApplicationCategory.REGISTER,
    )
      .map((i) => ({
        id: i?.equipmentType ?? '',
        name: i?.name ?? '',
      }))
      .map((i) => ({
        header: i?.name || '',
        cell: ({ row }: any) => row?.original?.[`${i?.id}Count`] || 0,
        minSize: 220,
      })) ?? []),
    {
      header: 'INM',
      cell: ({ row }) => row?.original?.count || 0,
    },
    {
      header: 'Rentgenlar',
      cell: ({ row }) => row?.original?.count || 0,
    },
  ];

  const handleDownloadExel = async () => {
    const res = await apiClient.downloadFile<Blob>('/reports/appeal-status/export-excel', {
      ...paramsObject,
      ownerType: 'LEGAL',
    });

    const blob = res.data;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date();
    const filename = `Davlat ro‘yxatidan o‘tqazilgan amaldagi XICHO, INM, Bosim ostidagi idishlar va qurilmalar to‘g‘risida sanalar bo‘yicha maʼlumot (${format(today, 'dd.MM.yyyy')}).xlsx`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <GoBack title="Davlat ro‘yxatidan o‘tqazilgan amaldagi XICHO, INM, Bosim ostidagi idishlar va qurilmalar to‘g‘risida sanalar bo‘yicha maʼlumot" />
      </div>

      <div className="flex my-2 justify-between items-start gap-2">
        <div className="flex-1 flex justify-start">
          <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />
        </div>
        <Button disabled={true} onClick={handleDownloadExel}>
          <Download /> MS Exel
        </Button>
      </div>

      <DataTable
        showNumeration={false}
        headerCenter={true}
        data={inspections || []}
        columns={columns as unknown as any}
        isLoading={isLoading}
        className="h-[calc(100vh-240px)]"
      />
    </div>
  );
};

export default Report1;
