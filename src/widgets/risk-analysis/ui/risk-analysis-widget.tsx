import { Attraction } from '@/features/risk-analysis/ui/table/attraction';
import { Irs } from '@/features/risk-analysis/ui/table/irs';
import { Lift } from '@/features/risk-analysis/ui/table/lift';
import { HFList } from '@/features/risk-analysis/ui/table/hf';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRiskAnalysis } from '../model/use-risk-analysis';
import { RiskAnalysisTab } from '../types';
import { RiskLevelTabs } from './RiskLevelTabs';
import { Badge } from '@/shared/components/ui/badge';
import { useData } from '@/shared/hooks/api';
import { useCustomSearchParams } from '@/shared/hooks';
import { UserRoles } from '@/entities/user';
import { Button } from '@/shared/components/ui/button';
import { NotebookText } from 'lucide-react';
import { useAuth } from '@/shared/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const RiskAnalysisWidget = () => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    addParams,
    paramsObject: { mainTab = 'HF' },
  } = useCustomSearchParams();
  const { hfCount, irsCount, xrayCount } = useRiskAnalysis();

  const { data: elevatorCount = 0 } = useData<number>('/equipments/count?type=ELEVATOR');
  const { data: attractionCount = 0 } = useData<number>('/equipments/count?type=ATTRACTION');
  const { data: lpgPoweredCount = 0 } = useData<number>('/equipments/count?type=LPG_POWERED');

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

  return (
    <Fragment>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-semibold">{t('menu.risk_analysis')}</h5>
        {action}
      </div>

      <Tabs defaultValue={mainTab} onValueChange={(tab) => addParams({ mainTab: tab, page: 1 })} className="w-full">
        <div className="flex justify-between items-center mb-4">
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
        </div>

        <TabsContent value={RiskAnalysisTab.XICHO} className="mt-4">
          <RiskLevelTabs type="HF" ListContentComponent={HFList} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.INM} className="mt-4">
          <RiskLevelTabs type="IRS" ListContentComponent={Irs} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.LIFT} className="mt-4">
          <RiskLevelTabs type="ELEVATOR" ListContentComponent={Lift} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.ATTRACTION} className="mt-4">
          <RiskLevelTabs type="ATTRACTION" ListContentComponent={Attraction} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.XRAY} className="mt-4">
          <Attraction />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.LPG_POWERED} className="mt-4">
          <Attraction />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
};

export default RiskAnalysisWidget;
