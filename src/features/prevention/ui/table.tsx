import { UserRoles } from '@/entities/user';
import { AssignInspectorModal } from '@/features/prevention/ui/parts/assign-inspector-modal';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AssignInspectorButton } from '@/features/risk-analysis/ui/assign-inspector-button';
import { getCurrentMonthEnum } from '@/widgets/prevention/ui/prevention-widget';
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';

interface Props {
  regions?: any;
}

const List: FC<Props> = ({ regions }) => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const isRegional = user?.role === UserRoles.REGIONAL;
  const isInspector = user?.role === UserRoles.INSPECTOR;

  const {
    paramsObject: {
      assignment: activeAssignedStatus = isInspector ? 'ASSIGNED' : 'ALL',
      belongType = 'HF',
      month = getCurrentMonthEnum(),
      year = new Date().getFullYear(),
      regionId = !isRegional && !isInspector && regions && regions.length > 0 ? regions[0].id?.toString() : '',
      size = 10,
      page = 1,
      address = '',
      registryNumber = '',
      name = '',
      identity = '',
      ownerName = '',
    },
  } = useCustomSearchParams();
  const { data, isLoading } = usePaginatedData<any>(
    '/preventions',
    {
      belongType,
      month,
      year,
      regionId,
      size,
      page,
      registryNumber,
      name,
      identity,
      ownerName,
      address,
      assigned: activeAssignedStatus == 'ALL' ? '' : activeAssignedStatus === 'ASSIGNED',
    },
    !!month && !!belongType && !!year,
  );

  const handleView = (row: any) => {
    navigate(`/preventions/detail/${row.id}?tin=${row.identity}`);
  };

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: t('risk_analysis_columns.registryNumber'),
      accessorKey: 'registryNumber',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.name'),
      accessorKey: 'name',
      filterKey: 'name',
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.legalName'),
      accessorKey: 'ownerName',
      filterKey: 'ownerName',
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.legalTin'),
      accessorKey: 'identity',
      filterKey: 'identity',
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.address'),
      accessorKey: 'address',
      filterKey: 'address',
      filterType: 'search',
    },

    ...(activeAssignedStatus === 'UNASSIGNED' && isRegional
      ? [
          {
            id: 'assignInspector',
            header: 'Inspektorni belgilash',
            cell: ({ row }: any) => <AssignInspectorButton row={row.original} />,
            meta: {
              className: 'w-[200px]',
            },
          },
        ]
      : [
          {
            header: 'Inspektor',
            accessorKey: 'executorName',
            cell: ({ row }: any) => row?.original?.executorName || 'Inspektor biriktirilmagan',
          },
        ]),
    {
      id: 'status',
      header: 'Holati',
      cell: ({ row }: any) =>
        row.original?.status ? (
          row.original?.status == 'CONDUCTED' ? (
            <Badge variant="success">Bajrilgan</Badge>
          ) : (
            <Badge variant="info">Yangi</Badge>
          )
        ) : (
          '-'
        ),
      meta: {
        className: 'w-[200px]',
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => <DataTableRowActions showView onView={() => handleView(row.original)} row={row} />,
    },
  ];

  return (
    <>
      <DataTable
        isPaginated
        showFilters
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        className={
          isInspector ? 'h-[calc(100svh-310px)]' : isRegional ? 'h-[calc(100svh-350px)]' : 'h-[calc(100svh-400px)]'
        }
      />
      <AssignInspectorModal />
    </>
  );
};

export default List;
