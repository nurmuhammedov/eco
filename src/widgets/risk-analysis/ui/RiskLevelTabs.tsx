// src/features/risk-analysis/ui/RiskLevelTabs.tsx
import { TabsLayout } from '@/shared/layouts';
import { useCustomSearchParams } from '@/shared/hooks';
import { Badge } from '@/shared/components/ui/badge'; // (Loyihangizdagi Badge komponenti)
import { useQuery } from '@tanstack/react-query'; // Ma'lumot sonini olish uchun

// Yangi: Har bir tur uchun sonlarni olish uchun API funksiyasi (taxminiy)
// Buni alohida api/ papkasida yaratish kerak
/* const getRiskCountsByType = async (type: string) => {
  // const { data } = await apiClient.get(`/risk-analysis/counts?type=${type}`);
  // return data;
  
  // Hozircha statik, test uchun ma'lumot
  return { LOW: 5, MEDIUM: 2, HIGH: 1, ALL: 8 };
}; */

interface RiskLevelTabsProps {
  type: string;
  ListContentComponent: React.ComponentType;
}

const riskLevels = [
  { id: 'ALL', name: 'Barchasi', baseColor: 'bg-gray-500', activeColor: 'bg-teal-600' }, // "Barchasi" uchun rang
  { id: 'LOW', name: 'Xavfi past (0-60)', baseColor: 'bg-green-500', activeColor: 'bg-green-700' }, // Yashil
  { id: 'MEDIUM', name: "Xavfi o'rta (61-80)", baseColor: 'bg-yellow-500', activeColor: 'bg-yellow-600' }, // Sariq
  { id: 'HIGH', name: 'Xavfi yuqori (81-100)', baseColor: 'bg-red-500', activeColor: 'bg-red-700' }, // Qizil
];

export const RiskLevelTabs = ({ type, ListContentComponent }: RiskLevelTabsProps) => {
  const { paramsObject, addParams } = useCustomSearchParams();
  const activeRiskLevel = paramsObject.riskLevel || 'ALL';

  // Har bir risk darajasi uchun sonlarni backenddan olamiz
  const { data: counts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ['riskCounts', type],
    // Ma'lumotni to'g'ridan-to'g'ri shu yerda qaytaramiz
    queryFn: () => {
      // Kelajakda bu yerga API so'rovi qo'yiladi:
      // const { data } = await apiClient.get(`/risk-analysis/counts?type=${type}`);
      // return data;

      // Hozircha test uchun
      return { LOW: 5, MEDIUM: 2, HIGH: 1, ALL: 8 };
    },
  });
  const tabs = riskLevels.map((level) => {
    const count = counts?.[level.id as keyof typeof counts] || 0;
    const isActive = activeRiskLevel === level.id;

    return {
      id: level.id,
      name: level.name, // `TabsLayout` buni ishlatmaydi, lekin majburiy bo'lishi mumkin
      count: count,
      // `renderName` orqali tabning ko'rinishini to'liq o'zimiz boshqaramiz
      renderName: (
        <div
          className={`flex items-center space-x-2 rounded-md px-3 py-1.5 transition-colors duration-200 ${isActive ? level.activeColor : 'hover:bg-gray-100'}`}
        >
          <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>{level.name}</span>
          <Badge
            variant="secondary"
            className={`
              ${isActive ? 'bg-white text-black' : `${level.baseColor} text-white`}
              ${isLoadingCounts ? 'animate-pulse' : ''}
            `}
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
      tabs={tabs}
      onTabChange={(risk) => addParams({ riskLevel: risk }, 'page')}
      // `TabsLayout` tablar orasida bo'sh joy qoldirishi uchun (ixtiyoriy)
      className="space-x-2"
    >
      <div className="mt-4">
        <ListContentComponent />
      </div>
    </TabsLayout>
  );
};
