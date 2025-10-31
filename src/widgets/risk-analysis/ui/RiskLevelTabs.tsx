import { TabsLayout } from '@/shared/layouts';
import { useCurrentRole, useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { Badge } from '@/shared/components/ui/badge';
import clsx from 'clsx';
import { ComponentType, useMemo } from 'react';
import { RiskAnalysisItem, RiskAnalysisParams } from '@/entities/risk-analysis/models/risk-analysis.types';
import { AssignedStatusTab } from '@/widgets/risk-analysis/types';
import { API_ENDPOINTS } from '@/shared/api';
import { UserRoles } from '@/entities/user';

interface RiskLevelTabsProps {
  type?: string;
  ListContentComponent: ComponentType<{ data: any; isLoading: boolean }>;
}

// const riskLevels = [
//   {
//     id: 'ALL',
//     name: 'Barchasi',
//     // lightColor: 'bg-[#016B7B]',
//     darkColor: 'bg-[#016B7B]',
//     badgeColor: 'bg-[#016B7B]',
//   },
//   {
//     id: 'LOW',
//     name: 'Xavfi past (0-60)',
//     lightColor: 'bg-green-100',
//     darkColor: 'bg-green-700',
//     badgeColor: 'bg-green-500',
//   },
//   {
//     id: 'MEDIUM',
//     name: 'Xavfi o‘rta (61-80)',
//     lightColor: 'bg-yellow-100',
//     darkColor: 'bg-yellow-600',
//     badgeColor: 'bg-yellow-500',
//   },
//   {
//     id: 'HIGH',
//     name: 'Xavfi yuqori (81-100)',
//     lightColor: 'bg-red-100',
//     darkColor: 'bg-red-700',
//     badgeColor: 'bg-red-500',
//   },
// ];

export const RiskLevelTabs = ({ ListContentComponent, type = 'HF' }: RiskLevelTabsProps) => {
  const { paramsObject, addParams } = useCustomSearchParams();
  const activeRiskLevel = paramsObject.riskLevel || 'ALL';
  const currentRole = useCurrentRole();
  const isRegional = currentRole === UserRoles.REGIONAL;
  const activeAssignedStatus = (paramsObject.assignedStatus as AssignedStatusTab) || AssignedStatusTab.NOT_ASSIGNED;

  const apiParams = useMemo(() => {
    const params: RiskAnalysisParams = {};
    if (isRegional) {
      params.isAssigned = activeAssignedStatus === AssignedStatusTab.ASSIGNED;
    }
    return params;
  }, [isRegional, activeAssignedStatus]);

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_HF, {
    ...apiParams,
    type: type,
    level: paramsObject.riskLevel == 'ALL' ? undefined : paramsObject.riskLevel,
    size: paramsObject?.size || 10,
    page: paramsObject?.page || 1,
  });

  const { data: hf } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_HF, {
    ...apiParams,
    type,
    size: 1,
    page: 1,
  });

  const { data: low } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_HF, {
    ...apiParams,
    type,
    level: 'LOW',
    size: 1,
    page: 1,
  });

  const { data: medium } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_HF, {
    ...apiParams,
    type,
    level: 'MEDIUM',
    size: 1,
    page: 1,
  });
  const { data: high } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_HF, {
    ...apiParams,
    type,
    level: 'HIGH',
    size: 1,
    page: 1,
  });

  const riskLevelsWithCount = [
    {
      id: 'ALL',
      name: 'Barchasi',
      darkColor: 'bg-[#016B7B]',
      // lightColor: 'bg-[#016B7B]',
      badgeColor: 'bg-[#016B7B]',
      count: hf?.page?.totalElements || 0,
    },
    {
      id: 'LOW',
      name: 'Xavfi past (0-60)',
      lightColor: 'bg-green-100',
      darkColor: 'bg-green-700',
      badgeColor: 'bg-green-500',
      count: low?.page?.totalElements || 0,
    },
    {
      id: 'MEDIUM',
      name: 'Xavfi o‘rta (61-80)',
      lightColor: 'bg-yellow-100',
      darkColor: 'bg-yellow-600',
      badgeColor: 'bg-yellow-500',
      count: medium?.page?.totalElements || 0,
    },
    {
      id: 'HIGH',
      name: 'Xavfi yuqori (81-100)',
      lightColor: 'bg-red-100',
      darkColor: 'bg-red-700',
      badgeColor: 'bg-red-500',
      count: high?.page?.totalElements || 0,
    },
  ];

  const tabs = riskLevelsWithCount.map((level) => {
    const isActive = activeRiskLevel === level.id;

    return {
      id: level.id,
      name: level.name,
      renderName: (
        <div
          className={clsx(
            'flex items-center space-x-2 rounded-md px-3 py-1 transition-all duration-200 border',
            isActive
              ? `${level.darkColor} text-white border-transparent`
              : `${level.lightColor} text-gray-700 border-gray-300 hover:border-gray-400`,
          )}
        >
          <span className="text-sm font-medium">{level.name}</span>
          <Badge
            variant="secondary"
            className={clsx(
              'text-xs',
              isActive ? 'bg-white text-black' : `${level.badgeColor} text-white`,
              isLoading && 'animate-pulse',
            )}
          >
            {level.count}
          </Badge>
        </div>
      ),
    };
  });

  return (
    <TabsLayout
      activeTab={activeRiskLevel}
      classNameTabList="bg-[#F6F6F6]"
      tabs={tabs}
      classNameTrigger="bg-[#F6F6F6]! cursor-pointer rounded-lg p-1! border-none border-0! outline-none! shadow-none! focus-visible:ring-0!"
      onTabChange={(risk) => addParams({ riskLevel: risk }, 'page')}
    >
      <div className="mt-4">
        <ListContentComponent data={data} isLoading={isLoading} />
      </div>
    </TabsLayout>
  );
};
