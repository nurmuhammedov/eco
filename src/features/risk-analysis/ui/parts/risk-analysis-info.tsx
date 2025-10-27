import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import { useState, useEffect, FC } from 'react';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { UserRoles } from '@/entities/user';
import RiskAnalysisForm from '@/features/risk-analysis/ui/parts/risk-analysis-form.tsx';
import { useRiskAnalysisDetail } from '@/features/risk-analysis/hooks/use-risk-analysis-detail.ts';
import RiskAnalysisInspectorInfo from '@/features/risk-analysis/ui/parts/risk-analysis-inspector-info.tsx';
import { Badge } from '@/shared/components/ui/badge.tsx';
//import ConfirmModal from '@/features/risk-analysis/ui/modals/confirm-modal';
import { RiskAnalysisData } from '../riskAnalysis';
import { apiClient } from '@/shared/api';

interface RiskAnalysisIndicatorProps {
  belongId: string;
  intervalId: number;
}

const RiskAnalysisIndicator: FC<RiskAnalysisIndicatorProps> = ({ belongId, intervalId }) => {
  const { user } = useAuth();
  const isInspector = user?.role === UserRoles.INSPECTOR;
  const defaultTab = isInspector ? 'analysis_indicators' : 'inspector_info';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const { isLoading: isRiskDetailLoading, isError: isRiskDetailError } = useRiskAnalysisDetail();

  const [analysisData, setAnalysisData] = useState<RiskAnalysisData | null>(null);
  const [isAnalysisLoading, setAnalysisLoading] = useState<boolean>(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (!belongId || !intervalId) {
      setAnalysisLoading(false);
      setAnalysisError('Kerakli parametrlar (belongId yoki intervalId) mavjud emas.');
      return;
    }

    const fetchData = async () => {
      setAnalysisLoading(true);
      try {
        const url = `/risk-analyses/belong/${belongId}?intervalId=${intervalId}`;
        const response = await apiClient.get<{ data: RiskAnalysisData }>(url);
        setAnalysisData(response.data.data);
      } catch (err) {
        setAnalysisError("Ma'lumotlarni yuklashda xatolik yuz berdi");
      } finally {
        setAnalysisLoading(false);
      }
    };

    fetchData();
  }, [belongId, intervalId]);

  const totalScore = analysisData?.totalScore || 0;

  if (isAnalysisLoading || isRiskDetailLoading) {
    return <div>Yuklanmoqda...</div>;
  }

  if (analysisError || isRiskDetailError) {
    return <div>{analysisError || "Ma'lumotlarni yuklashda xatolik."}</div>;
  }

  if (!analysisData) {
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
        <div className="ml-auto flex items-center gap-4">
          <Badge variant={totalScore > 80 ? 'destructive' : 'success'}>Jami ballar: {totalScore}</Badge>
          {/* {isInspector && <ConfirmModal />} */}
        </div>
      </div>
      <TabsContent value="inspector_info">
        {/* <RiskAnalysisInspectorInfo/> */}
        <RiskAnalysisInspectorInfo data={analysisData} />
      </TabsContent>
      <TabsContent value="analysis_indicators">
        <RiskAnalysisForm data={analysisData.indicators} />
      </TabsContent>
    </Tabs>
  );
};

export default RiskAnalysisIndicator;
