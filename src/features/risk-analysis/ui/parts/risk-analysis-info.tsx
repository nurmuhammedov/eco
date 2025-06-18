import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import { useState } from 'react';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import RiskAnalysisForm from '@/features/risk-analysis/ui/parts/risk-analysis-form.tsx';
import { useRiskAnalysisDetail } from '@/features/risk-analysis/hooks/use-risk-analysis-detail.ts';

const RiskAnalysisInfo = () => {
  const { user } = useAuth();
  const isInspector = user?.role === UserRoles.INSPECTOR;
  const defaultTab = isInspector ? 'analysis_indicators' : 'inspector_info';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { data, isLoading, isError } = useRiskAnalysisDetail();
  const totalScore = data?.reduce((sum: any, item: any) => sum + (item.score ?? 0), 0) || 0;

  if (isLoading || isError) {
    return null;
  }
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center">
        {!isInspector && (
          <TabsList className="bg-[#EDEEEE]">
            <TabsTrigger value="inspector_info">Inspektor to‘g‘risida ma’lumot</TabsTrigger>
            <TabsTrigger value="analysis_indicators">Tahlil uchun baholash ko‘rsatkichlari holati</TabsTrigger>
          </TabsList>
        )}
        <div className="ml-auto bg-neutral-200 rounded-md px-3 py-1.5">
          Total score: <b className="font-medium">{totalScore}</b>
        </div>
      </div>
      <TabsContent value="inspector_info">inspector_info</TabsContent>
      <TabsContent value="analysis_indicators">
        <RiskAnalysisForm data={data} />
      </TabsContent>
    </Tabs>
  );
};

export default RiskAnalysisInfo;
