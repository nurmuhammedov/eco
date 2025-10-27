import { TabsLayout } from '@/shared/layouts';
import { useCustomSearchParams } from '@/shared/hooks';
import { Badge } from '@/shared/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';

interface RiskLevelTabsProps {
  type: string;
  ListContentComponent: React.ComponentType;
}

const riskLevels = [
  {
    id: 'ALL',
    name: 'Barchasi',
    // lightColor: 'bg-[#016B7B]',
    darkColor: 'bg-[#016B7B]',
    badgeColor: 'bg-[#016B7B]',
  },
  {
    id: 'LOW',
    name: 'Xavfi past (0-60)',
    lightColor: 'bg-green-100',
    darkColor: 'bg-green-700',
    badgeColor: 'bg-green-500',
  },
  {
    id: 'MEDIUM',
    name: 'Xavfi o‘rta (61-80)',
    lightColor: 'bg-yellow-100',
    darkColor: 'bg-yellow-600',
    badgeColor: 'bg-yellow-500',
  },
  {
    id: 'HIGH',
    name: 'Xavfi yuqori (81-100)',
    lightColor: 'bg-red-100',
    darkColor: 'bg-red-700',
    badgeColor: 'bg-red-500',
  },
];

export const RiskLevelTabs = ({ type, ListContentComponent }: RiskLevelTabsProps) => {
  const { paramsObject, addParams } = useCustomSearchParams();
  const activeRiskLevel = paramsObject.riskLevel || 'ALL';

  const { data: counts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ['riskCounts', type],
    queryFn: () => ({ LOW: 5, MEDIUM: 2, HIGH: 1, ALL: 8 }),
  });

  const tabs = riskLevels.map((level) => {
    const count = counts?.[level.id as keyof typeof counts] || 0;
    const isActive = activeRiskLevel === level.id;

    return {
      id: level.id,
      name: level.name,
      count: count,
      renderName: (
        <div
          className={clsx(
            'flex items-center mx-1 space-x-2 rounded-md px-3 py-1.5 transition-all duration-200 border',
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
              isLoadingCounts && 'animate-pulse',
            )}
          >
            {isLoadingCounts ? '...' : count}
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
      classNameTrigger="bg-[#F6F6F6]! cursor-pointer rounded-lg p-1!  border-none border-0! outline-none! shadow-none! focus-visible:ring-0!"
      onTabChange={(risk) => addParams({ riskLevel: risk }, 'page')}
      className="space-x-2"
    >
      <div className="mt-4">
        <ListContentComponent />
      </div>
    </TabsLayout>
  );
};
