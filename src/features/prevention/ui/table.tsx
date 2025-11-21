import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
import { UserRoles } from '@/entities/user';
import { AssignInspectorModal } from '@/features/risk-analysis/ui/modals/assign-inspector-modal';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { ColumnDef } from '@tanstack/react-table';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AssignInspectorButton } from '@/features/risk-analysis/ui/assign-inspector-button';

interface Props {
  data?: any;
  isLoading?: boolean;
}

const List: FC<Props> = ({ data = [], isLoading = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const isRegional = user?.role === UserRoles.REGIONAL || user?.role === UserRoles.HEAD;

  const navigate = useNavigate();
  const {
    paramsObject: { assignment: activeAssignedStatus = isRegional ? 'UNASSIGNED' : 'ASSIGNED', mainTab = 'HF' },
  } = useCustomSearchParams();

  const handleView = (row: RiskAnalysisItem) => {
    navigate(`/preventions/detail/${row.id}?type=${mainTab}&tin=${row.legalTin}`);
  };

  const columns: ColumnDef<any>[] = [
    {
      header: t('risk_analysis_columns.registryNumber'),
      accessorKey: 'registryNumber',
    },
    {
      header: t('risk_analysis_columns.name'),
      accessorKey: 'name',
    },
    {
      header: t('risk_analysis_columns.legalName'),
      accessorKey: 'legalName',
    },
    {
      header: t('risk_analysis_columns.legalTin'),
      accessorKey: 'legalTin',
    },
    {
      header: t('risk_analysis_columns.address'),
      accessorKey: 'address',
    },
    {
      header: t('Ballar'),
      accessorKey: 'score',
      cell: ({ row }: any) => row.original?.score ?? "Yo'q",
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
      : []),
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
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        className={user?.role == UserRoles.REGIONAL ? 'h-[calc(100svh-380px)]' : 'h-[calc(100svh-320px)]'}
      />
      <AssignInspectorModal />
    </>
  );
};

export default List;
