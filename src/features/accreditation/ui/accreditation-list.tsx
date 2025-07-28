import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { useNavigate } from 'react-router-dom';
import { getDate } from '@/shared/utils/date';
// import FileLink from '@/shared/components/common/file-link';

export const AccreditationList = () => {
  const {
    paramsObject: { ...rest },
  } = useCustomSearchParams();
  const navigate = useNavigate();
  const { data = [], isLoading } = usePaginatedData<any>(`/accreditations`, {
    ...rest,
    page: rest.page || 1,
    size: rest?.size || 10,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'legalName',
      header: 'Ekspert tashkilotining nomi',
    },
    {
      accessorKey: 'fullName',
      header: 'Ekspert tashkiloti rahbarining F.I.SH.',
    },
    {
      accessorKey: 'legalAddress',
      header: 'Ekspert tashkilotining yuridik manzili',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Ekspert tashkilotining telefon raqami',
    },
    {
      accessorKey: 'tin',
      header: 'STIR',
    },
    {
      header: 'Akkreditatsiya sohasi haqida maʼlumot',
      cell: ({ row }) => getDate(row.original.certificateDate),
    },
    {
      accessorKey: 'certificateDate',
      header: 'Attestat berilgan sanasi',
      cell: ({ row }) => getDate(row.original.certificateDate),
    },
    {
      accessorKey: 'certificateValidityDate',
      header: 'Attestat amal qilish muddati',
      cell: ({ row }) => getDate(row.original.certificateValidityDate),
    },
    {
      accessorKey: 'certificateNumber',
      header: 'Attestat ro‘yxat raqami',
    },
    // {
    //   // accessorKey: 'accreditationCommissionDecisionPath',
    //   header: 'Akkreditatsiya komissiyasining qarori',
    //   cell: ({ row }) =>
    //     row.original?.accreditationCommissionDecisionPath ? (
    //       <FileLink url={row.original?.accreditationCommissionDecisionPath} />
    //     ) : (
    //       <span className="text-red-600">Mavjud emas</span>
    //     ),
    // },
    // {
    //   // accessorKey: 'assessmentCommissionDecisionPath',
    //   header: 'Baholash komissiyasining qarori',
    //   cell: ({ row }) =>
    //     row.original?.assessmentCommissionDecisionPath ? (
    //       <FileLink url={row.original?.assessmentCommissionDecisionPath} />
    //     ) : (
    //       <span className="text-red-600">Mavjud emas</span>
    //     ),
    // },
    // {
    //   // accessorKey: 'referencePath',
    //   header: 'Ma’lumotnoma',
    //   cell: ({ row }) =>
    //     row.original?.referencePath ? (
    //       <FileLink url={row.original?.referencePath} />
    //     ) : (
    //       <span className="text-red-600">Mavjud emas</span>
    //     ),
    // },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={() => navigate(`/accreditations/detail/${row.original.appealId}?id=${row.original.id}`)}
            />
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data || []} isLoading={isLoading} className="h-[calc(100svh-220px)]" />;
};
