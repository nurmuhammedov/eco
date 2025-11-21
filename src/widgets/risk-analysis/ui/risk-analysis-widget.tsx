import Table from '@/features/risk-analysis/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRiskAnalysis } from '../model/use-risk-analysis';
import { RiskAnalysisTab } from '../types';
import { Badge } from '@/shared/components/ui/badge';
import { useData } from '@/shared/hooks/api';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { UserRoles } from '@/entities/user';
import { Button } from '@/shared/components/ui/button';
import { NotebookText } from 'lucide-react';
import { useAuth } from '@/shared/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '@/shared/api';
import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
import { RiskStatisticsCards } from '@/widgets/risk-analysis/ui/parts/risk-statistics-cards';

const TAB_TO_API_TYPE: Record<string, string> = {
  [RiskAnalysisTab.XICHO]: 'HF',
  [RiskAnalysisTab.INM]: 'IRS',
  [RiskAnalysisTab.LIFT]: 'ELEVATOR',
  [RiskAnalysisTab.ATTRACTION]: 'ATTRACTION',
  [RiskAnalysisTab.XRAY]: 'XRAY',
  [RiskAnalysisTab.LPG_POWERED]: 'LPG_POWERED',
};

const RiskAnalysisWidget = () => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    addParams,
    paramsObject: { mainTab = RiskAnalysisTab.XICHO, riskLevel = 'ALL', size = 10, page = 1 },
  } = useCustomSearchParams();

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_HF, {
    type: mainTab,
    level: riskLevel == 'ALL' ? undefined : riskLevel,
    size,
    page,
  });

  const { hfCount, irsCount, xrayCount } = useRiskAnalysis();

  const { data: elevatorCount = 0 } = useData<number>('/equipments/count?type=ELEVATOR');
  const { data: attractionCount = 0 } = useData<number>('/equipments/count?type=ATTRACTION');
  const { data: lpgPoweredCount = 0 } = useData<number>('/equipments/count?type=LPG_POWERED');

  const currentApiType = TAB_TO_API_TYPE[mainTab as string] || 'HF';

  const action = useMemo(() => {
    if ([UserRoles.INSPECTOR, UserRoles.INDIVIDUAL]?.includes(user?.role as unknown as UserRoles)) {
      return (
        <Button onClick={() => navigate('/risk-analysis/my-tasks')}>
          <NotebookText /> Mening topshiriqlarim
        </Button>
      );
    }
    return null;
  }, [user?.role]);

  const handleCardTabChange = (level: string) => {
    addParams({ riskLevel: level }, 'page');
  };

  return (
    <Fragment>
      <RiskStatisticsCards
        type={currentApiType}
        activeRiskLevel={riskLevel as string}
        onTabChange={handleCardTabChange}
      />

      <Tabs
        defaultValue={mainTab}
        value={mainTab}
        onValueChange={(tab) => addParams({ mainTab: tab, page: 1, riskLevel: 'ALL' })}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value={RiskAnalysisTab.XICHO}>
              {t('risk_analysis_tabs.XICHO')}
              {hfCount ? (
                <Badge variant="destructive" className="ml-2">
                  {hfCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.INM}>
              {t('risk_analysis_tabs.INM')}
              {irsCount ? (
                <Badge variant="destructive" className="ml-2">
                  {irsCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.LIFT}>
              {t('risk_analysis_tabs.LIFT')}
              {elevatorCount ? (
                <Badge variant="destructive" className="ml-2">
                  {elevatorCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.ATTRACTION}>
              {t('risk_analysis_tabs.ATTRACTION')}
              {attractionCount ? (
                <Badge variant="destructive" className="ml-2">
                  {attractionCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.XRAY}>
              {t('risk_analysis_tabs.XRAY')}
              {xrayCount ? (
                <Badge variant="destructive" className="ml-2">
                  {xrayCount}
                </Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.LPG_POWERED}>
              {t('risk_analysis_tabs.LPG_POWERED')}
              {lpgPoweredCount ? (
                <Badge variant="destructive" className="ml-2">
                  {lpgPoweredCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
          {action}
        </div>
        <Table isLoading={isLoading} data={data} />
      </Tabs>
    </Fragment>
  );
};

export default RiskAnalysisWidget;
