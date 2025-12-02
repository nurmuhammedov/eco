import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { formatDate } from 'date-fns';
// import { tabs } from '@/features/expertise/ui/conclusion-tabs';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';
import ExpertiseFileUploadModal from '@/features/expertise/ui/parts/expertise-file-upload-modal';
import FileLink from '@/shared/components/common/file-link';
import { UserRoles } from '@/entities/user';
import { useAuth } from '@/shared/hooks/use-auth';

export const ConclusionsTable = () => {
  const {
    paramsObject: { page = 1, size = 10, tab = 'ALL', ...rest },
  } = useCustomSearchParams();
  const { user } = useAuth();
  const [id, setId] = useState<any>(null);
  const navigate = useNavigate();
  const { data = [], isLoading } = usePaginatedData<any>('/conclusions', {
    page: page,
    size: size,
    type: tab == 'ALL' ? null : tab,
    ...rest,
  });

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'legalName',
      header: 'Ekspert tashkiloti nomi',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      accessorKey: 'legalTin',
      header: 'Ekspert tashkiloti STIRi',
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      accessorKey: 'customerName',
      header: 'Tashkilot nomi',
      filterKey: 'customerName',
      filterType: 'search',
    },
    {
      accessorKey: 'customerTin',
      header: 'Tashkilot STIR',
      filterKey: 'customerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'objectName',
      header: 'Reysterdagi obyektning nomi',
      filterKey: 'objectName',
      filterType: 'search',
    },
    {
      accessorKey: 'expertiseName',
      header: 'Ekspertiza obyektining nomi',
      filterKey: 'expertiseName',
      filterType: 'search',
    },
    // {
    //   accessorKey: 'type',
    //   size: 300,
    //   header: 'Xulosa turi',
    //   cell: (cell) => tabs.find((t) => t?.key?.toString() == cell.row.original.type?.toString())?.label || '',
    // },
    {
      accessorKey: 'registryNumber',
      header: 'Reyestr raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'createdAt',
      header: 'Rasmiylashtirish sanasi',
      cell: (cell) => (cell.row.original.createdDate ? formatDate(cell.row.original.createdDate, 'dd.MM.yyyy') : null),
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      cell: ({ row }) =>
        row.original.processStatus == 'COMPLETED' ? (
          <Badge variant="success">Yakunlangan</Badge>
        ) : row.original.processStatus == 'NEW' ? (
          <Badge variant="info">Yangi</Badge>
        ) : null,
    },
    {
      accessorKey: 'registrationDate',
      header: 'Reyestrga qo‘yilgan sana',
      cell: (cell) =>
        cell.row.original.registrationDate ? formatDate(cell.row.original.registrationDate, 'dd.MM.yyyy') : null,
    },

    {
      header: 'Xulosa fayli',
      cell: ({ row }: any) => (
        <div>
          {row.original?.processStatus == 'COMPLETED' && row.original.filePath ? (
            <FileLink url={row.original.filePath} />
          ) : user?.role == UserRoles.LEGAL ? (
            <Button
              onClick={() => {
                setId(row.original?.id);
              }}
              variant="info"
            >
              Fayl yuklash
            </Button>
          ) : null}
        </div>
      ),
    },
    {
      id: 'actions',
      size: 10,
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              showEdit={row.original?.processStatus != 'COMPLETED' && user?.role == UserRoles.LEGAL}
              row={row}
              showView
              onEdit={(row: any) => navigate(`edit/${row.original.id!}`)}
              onView={(row: any) => navigate(`detail/${row.original.id!}`)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        showNumeration={true}
        isPaginated={true}
        columns={columns}
        data={data}
        showFilters={true}
        isLoading={isLoading}
        className="h-[calc(100svh-460px)]"
      />
      {user?.role == UserRoles.LEGAL && (
        <ExpertiseFileUploadModal
          id={id}
          closeModal={() => {
            setId(null);
          }}
        />
      )}
    </>
  );
};
