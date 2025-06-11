import { ApplicationStatus, ApplicationStatusBadge } from '@/entities/application';
import { APPLICATIONS_DATA } from '@/entities/create-application';
import { useApplicationList } from '@/features/application/application-table/hooks';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import Filter from '@/shared/components/common/filter';
import { useCustomSearchParams } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { FileWarning } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const ApplicationTable = () => {
  // const { t } = useTranslation('common');
  const {
    paramsObject: { status = ApplicationStatus.ALL, search = '', ...rest },
  } = useCustomSearchParams();
  const { data: applications = [] } = useApplicationList({
    ...rest,
    status: status !== 'ALL' ? status : '',
    legalTin: search,
  });

  const navigate = useNavigate();

  const handleViewApplication = (id: string) => {
    navigate(`detail/${id}`);
  };

  const columns: ColumnDef<ISearchParams>[] = [
    {
      accessorKey: 'number',
      maxSize: 100,
      header: 'Ariza raqami',
    },
    {
      header: 'Ariza sanasi',
      maxSize: 100,
      accessorFn: (row) => getDate(row.createdAt),
    },
    {
      header: 'Ariza turi',
      cell: (cell) => APPLICATIONS_DATA?.find((i) => i?.type == cell.row.original.appealType)?.title || '',
    },
    {
      maxSize: 200,
      accessorKey: 'test',
      header: 'Qo‘mita maʼsul bo‘limi',
    },
    {
      minSize: 200,
      accessorKey: 'officeName',
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
      cell: (cell) => {
        return (
          <div className="flex gap-2">
            {ApplicationStatusBadge({ status: cell.row.original.status })}
            {cell.row.original.isRejected && (
              <p title="Has rejected file!">
                <FileWarning size={18} className="text-yellow-200" />
              </p>
            )}
          </div>
        );
      },
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
      <Filter inputKeys={['search', 'appealType', 'officeId', 'executorId', 'startDate', 'endDate']} />
      <DataTable
        isPaginated
        data={applications || []}
        columns={columns as unknown as any}
        className="h-[calc(100svh-280px)]"
      />
    </>
  );
};
