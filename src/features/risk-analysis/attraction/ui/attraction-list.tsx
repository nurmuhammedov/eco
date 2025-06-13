import { RiskAnalysisItem, RiskAnalysisParams } from '@/entities/risk-analysis/models/risk-analysis.types';
import { UserRoles } from '@/entities/user';
import { API_ENDPOINTS } from '@/shared/api';
import { DataTable } from '@/shared/components/common/data-table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useCurrentRole, useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { useAuth } from '@/shared/hooks/use-auth';
import { AssignedStatusTab } from '@/widgets/risk-analysis/types';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const AttractionList = () => {
  const { t } = useTranslation('common');
  const currentRole = useCurrentRole();
  const isRegional = currentRole === UserRoles.REGIONAL;
  const { user } = useAuth();

  const { paramsObject, addParams } = useCustomSearchParams();

  const activeAssignedStatus = (paramsObject.assignedStatus as AssignedStatusTab) || AssignedStatusTab.NOT_ASSIGNED;

  const handleAssignedStatusChange = (status: string) => {
    addParams({ assignedStatus: status });
  };

  const apiParams = useMemo(() => {
    const params: RiskAnalysisParams = {};
    if (isRegional) {
      params.isAssigned = activeAssignedStatus === AssignedStatusTab.ASSIGNED;
    }
    if (user?.interval?.id) {
      params.intervalId = user.interval.id;
    }
    return params;
  }, [isRegional, activeAssignedStatus, user]);

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_ATTRACTIONS, apiParams);

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
    {
      header: t('risk_analysis_columns.inspectorName'),
      accessorKey: 'inspectorName',
      cell: ({ row }) => row.original.inspectorName || '-',
    },
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
    </div>
  );
};
