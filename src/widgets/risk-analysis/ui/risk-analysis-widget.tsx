import { AttractionList } from '@/features/risk-analysis/attraction/ui/attraction-list';
import { InmList } from '@/features/risk-analysis/inm/ui/inm-list';
import { LiftList } from '@/features/risk-analysis/lift/ui/lift-list';
import { XichoList } from '@/features/risk-analysis/xicho/ui/xicho-list';
import Filter from '@/shared/components/common/filter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useRiskAnalysis } from '../model/use-risk-analysis';
import { RiskAnalysisTab } from '../types';
import { RiskLevelTabs } from './RiskLevelTabs';
import { Badge } from '@/shared/components/ui/badge';
import { useData } from '@/shared/hooks/api';

const RiskAnalysisWidget = () => {
  const { t } = useTranslation('common');
  const { activeTab, handleChangeTab, hfCount, irsCount, xrayCount } = useRiskAnalysis();

  const { data: elevatorCount = 0 } = useData<number>('/equipments/count?type=ELEVATOR');
  const { data: attractionCount = 0 } = useData<number>('/equipments/count?type=ATTRACTION');
  const { data: lpgpoweredCount = 0 } = useData<number>('/equipments/count?type=LPG_POWERED');
  return (
    <Fragment>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-semibold">{t('menu.risk_analysis')}</h5>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleChangeTab} className="w-full">
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
              {lpgpoweredCount ? (
                <Badge variant="destructive" className="ml-2">
                  {lpgpoweredCount}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>
          <Filter inputKeys={['intervalId']} className="" />
        </div>

        <TabsContent value={RiskAnalysisTab.XICHO} className="mt-4">
          <RiskLevelTabs type="XICHO" ListContentComponent={XichoList} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.INM} className="mt-4">
          <RiskLevelTabs type="INM" ListContentComponent={InmList} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.LIFT} className="mt-4">
          <RiskLevelTabs type="LIFT" ListContentComponent={LiftList} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.ATTRACTION} className="mt-4">
          <RiskLevelTabs type="ATTRACTION" ListContentComponent={AttractionList} />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.XRAY} className="mt-4">
          <AttractionList />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.LPG_POWERED} className="mt-4">
          <AttractionList />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
};

export default RiskAnalysisWidget;
