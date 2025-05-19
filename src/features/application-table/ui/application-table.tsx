import { ApplicationStatusBadge } from '@/entities/application';
import { useApplicationPage } from '@/features/application-table/hooks';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const ApplicationTable = () => {
  const { t } = useTranslation('common');
  const { applications } = useApplicationPage();

  const handleViewApplication = (id: string) => {
    // onViewApplication(id);
    console.log(id);
  };
  const columns: ColumnDef<any>[] = [
    {
      maxSize: 30,
      header: t('sequence_number'),
      cell: (cell) => cell.row.index + 1,
    },
    {
      accessorKey: 'number',
      header: 'Ariza raqami',
    },
    {
      header: 'Ariza sanasi',
      accessorFn: (row) => getDate(row.createdDate),
    },
    {
      // accessorKey: 'appealType',
      header: 'Ariza turi',
      cell: () => 'XICHOni ro‘yxatga olish',
    },
    {
      minSize: 150,
      accessorKey: 'officeName',
      header: 'Qo‘mita maʼsul bo‘limi',
    },
    {
      minSize: 200,
      accessorKey: 'regionName',
      header: 'Ijrochi hududiy boshqarma',
    },
    {
      accessorKey: 'executorName',
      header: 'Maʼsul ijrochi',
    },
    {
      maxSize: 80,
      header: 'Ijro muddati',
      accessorFn: (row) => getDate(row.deadline),
    },
    {
      header: 'Ariza holati',
      cell: (cell) => ApplicationStatusBadge({ status: cell.row.original.status }),
    },
    {
      id: 'actions',
      maxSize: 40,
      // minSize: 20,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ];

  return (
    <DataTable
      isPaginated
      data={applications || []}
      columns={columns as unknown as any}
      className="h-[calc(100svh-270px)]"
    />
  );
};
