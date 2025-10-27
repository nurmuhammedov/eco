import { RiskAnalysisItem, RiskAnalysisParams } from '@/entities/risk-analysis/models/risk-analysis.types';
import { UserRoles } from '@/entities/user';
import { AssignInspectorModal } from '@/features/risk-analysis/ui/modals/assign-inspector-modal';
import { API_ENDPOINTS } from '@/shared/api';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useCurrentRole, useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { AssignedStatusTab, RiskAnalysisTab } from '@/widgets/risk-analysis/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AssignInspectorButton } from '../../ui/assign-inspector-button';
import { cleanParams } from '@/shared/lib';

export const XichoList = () => {
  const { t } = useTranslation('common');
  const currentRole = useCurrentRole();
  const isRegional = currentRole === UserRoles.REGIONAL;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { paramsObject, addParams } = useCustomSearchParams();

  const activeAssignedStatus = (paramsObject.assignedStatus as AssignedStatusTab) || AssignedStatusTab.NOT_ASSIGNED;

  const handleAssignedStatusChange = (status: string) => {
    addParams({ assignedStatus: status, page: 1 });
  };

  const type = paramsObject.mainTab || RiskAnalysisTab.XICHO;

  const apiParams = useMemo(() => {
    const params: RiskAnalysisParams = {};
    if (isRegional) {
      params.isAssigned = activeAssignedStatus === AssignedStatusTab.ASSIGNED;
    }
    if (user?.interval?.id) {
      params.intervalId = paramsObject.intervalId || user.interval.id;
    }
    return params;
  }, [isRegional, activeAssignedStatus, user, paramsObject.intervalId]);

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(
    API_ENDPOINTS.RISK_ASSESSMENT_HF,
    cleanParams({
      ...apiParams,
      level: paramsObject.riskLevel == 'ALL' ? undefined : paramsObject.riskLevel ? paramsObject.riskLevel : undefined,
      size: paramsObject?.size || 10,
      page: paramsObject?.page || 1,
    }),
  );

  const handleView = (row: RiskAnalysisItem) => {
    const intervalId = paramsObject.intervalId || user?.interval?.id;
    navigate(
      `/risk-analysis/detail?tin=${row.legalTin}&id=${row.id}&assignId=${row.assignId}&intervalId=${intervalId}&type=${type}`,
    );
  };

  const columns: ColumnDef<RiskAnalysisItem>[] = [
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
    ...(activeAssignedStatus === AssignedStatusTab.NOT_ASSIGNED && user?.role == UserRoles.REGIONAL
      ? [
          {
            id: 'assignInspector',
            header: 'Inspektorni belgilash',
            cell: ({ row }: any) => <AssignInspectorButton disabled={!!paramsObject?.intervalId} row={row.original} />,
            meta: {
              className: 'w-[200px]',
            },
          },
        ]
      : [
          {
            header: t('Ballar'),
            accessorKey: 'score',
            cell: ({ row }: any) => row.original?.score ?? "Yo'q",
          },
          {
            header: t('risk_analysis_columns.inspectorName'),
            accessorKey: 'inspectorName',
            cell: ({ row }: any) => row.original.inspectorName || '-',
          },
          {
            id: 'actions',
            header: 'Amallar',
            cell: ({ row }: any) => <DataTableRowActions showView onView={() => handleView(row.original)} row={row} />,
          },
        ]),
  ];

  const assignedStatusTabs = [
    { id: AssignedStatusTab.NOT_ASSIGNED, label: t('risk_analysis_tabs.NOT_ASSIGNED') },
    { id: AssignedStatusTab.ASSIGNED, label: t('risk_analysis_tabs.ASSIGNED') },
  ];

  return (
    <div>
      {isRegional && (
        <Tabs value={activeAssignedStatus} onValueChange={handleAssignedStatusChange} className="mb-4">
          <TabsList>
            {assignedStatusTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}
      <DataTable
        isPaginated
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        className="h-[calc(100svh-320px)]"
      />
      <AssignInspectorModal />
    </div>
  );
};
