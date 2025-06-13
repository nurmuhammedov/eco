import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import { useState } from 'react';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import RiskAnalysisForm from '@/features/risk-analysis/ui/parts/risk-analysis-form.tsx';

const RiskAnalysisInfo = () => {
  const { user } = useAuth();
  const isInspector = user?.role === UserRoles.INSPECTOR;
  const defaultTab = isInspector ? 'analysis_indicators' : 'inspector_info';
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      {!isInspector && <>
        <TabsList className="bg-[#EDEEEE]">
          <TabsTrigger value="inspector_info">Inspektor to‘g‘risida ma’lumot</TabsTrigger>
          <TabsTrigger value="analysis_indicators">Tahlil uchun baholash ko‘rsatkichlari holati</TabsTrigger>
        </TabsList>
        <TabsContent value="inspector_info">
          inspector_info
        </TabsContent>
      </>
      }
      <TabsContent value="analysis_indicators">
        <RiskAnalysisForm />
      </TabsContent>
    </Tabs>
  );
};

export default RiskAnalysisInfo;