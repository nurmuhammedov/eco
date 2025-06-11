import { IrsUsageType } from '@/entities/create-application';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

export const IrsList = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams();
  const { data = [] } = usePaginatedData<any>(`/irs`, { ...rest });

  const handleViewApplication = (id: string) => {
    navigate(`${id}/irs`);
  };

  const columns: ColumnDef<ISearchParams>[] = [
    {
      header: 'INM hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
    },
    {
      header: 'INM ro‘yxat raqami',
      accessorFn: (row) => row?.registryNumber,
    },
    {
      header: 'Manzil',
      accessorFn: (row) => row?.address,
    },
    {
      header: 'Kategoriyasi',
      accessorFn: (row) => row?.category,
    },
    {
      header: 'Aktivligi',
      accessorFn: (row) => row?.activity,
    },
    {
      header: 'Soha',
      accessorFn: (row) => row?.sphere,
    },
    {
      header: 'Radionuklid belgisi',
      accessorFn: (row) => row?.symbol,
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

  return (
    <DataTable isPaginated data={data || []} columns={columns as unknown as any} className="h-[calc(100svh-220px)]" />
  );
};
