import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { getDate } from '@/shared/utils/date';
import { useNavigate } from 'react-router-dom';

export const AccreditationConclusionList = () => {
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams();
  const navigate = useNavigate();
  const { data = [], isLoading } = usePaginatedData<any>(`/accreditations/conclusions`, {
    ...rest,
    page: rest.page || 1,
    size: rest?.size || 10,
  });

  const expertiseConclusionColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'expertiseConclusionDate',
      header: 'Ekspertiza xulosasi ro‘yxat sanasi',
      cell: ({ row }) => getDate(row.original.expertiseConclusionDate) || '-',
    },
    {
      accessorKey: 'customerLegalName',
      header: 'Ekspertiza xulosasi raqami',
      cell: () => '-',
    },
    {
      accessorKey: 'customerLegalName',
      header: 'Buyurtmachi tashkilot nomi',
      cell: ({ row }) => row.original.customerLegalName || '-',
    },
    {
      accessorKey: 'customerLegalAddress',
      header: 'Buyurtmachi tashkilot manzili',
      cell: ({ row }) => row.original.customerLegalAddress || '-',
    },
    {
      accessorKey: 'customerTin',
      header: 'Buyurtmachi tashkilot STIR',
      cell: ({ row }) => row.original.customerTin || '-',
    },
    {
      accessorKey: 'expertOrganizationName',
      header: 'Ekspert tashkiloti nomi',
      cell: ({ row }) => row.original.expertOrganizationName || '-',
    },
    {
      accessorKey: 'expertiseObjectName',
      header: 'Ekspertiza obyekti nomi',
      cell: ({ row }) => row.original.expertiseObjectName || '-',
    },
    {
      accessorKey: 'firstSymbolsGroup',
      header: 'Birinchi belgilar guruhi (XXX)',
      cell: ({ row }) => row.original.firstSymbolsGroup || '-',
    },
    {
      accessorKey: 'secondSymbolsGroup',
      header: 'Ikkinchi belgilar guruhi (XX)',
      cell: ({ row }) => row.original.secondSymbolsGroup || '-',
    },
    {
      accessorKey: 'thirdSymbolsGroup',
      header: 'Uchinchi belgilar guruhi (XXXX)',
      cell: ({ row }) => row.original.thirdSymbolsGroup || '-',
    },
    {
      accessorKey: 'fourthSymbolsGroup',
      header: 'To‘rtinchi belgilar guruhi (XXXXX)',
      cell: ({ row }) => row.original.fourthSymbolsGroup || '-',
    },
    {
      accessorKey: 'objectAddress',
      header: 'Obyekt manzili',
      cell: ({ row }) => row.original.objectAddress || '-',
    },
    {
      accessorKey: 'expertiseConclusionNumber',
      header: 'Ekspert tashkiloti bergan ekspertiza xulosasi raqami',
      cell: ({ row }) => row.original.expertiseConclusionNumber || '-',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={() =>
                navigate(`/accreditations/conclusions/detail/${row.original.appealId}?id=${row.original.id}`)
              }
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={expertiseConclusionColumns}
      data={data || []}
      isLoading={isLoading}
      className="h-[calc(100svh-220px)]"
    />
  );
};
