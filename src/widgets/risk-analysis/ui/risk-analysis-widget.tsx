import { AttractionList } from '@/features/risk-analysis/attraction/ui/attraction-list';
import { InmList } from '@/features/risk-analysis/inm/ui/inm-list';
import { LiftList } from '@/features/risk-analysis/lift/ui/lift-list';
import { XichoList } from '@/features/risk-analysis/xicho/ui/xicho-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useRiskAnalysis } from '../model/use-risk-analysis';
import { RiskAnalysisTab } from '../types';

const RiskAnalysisWidget = () => {
  const { t } = useTranslation('common');
  const { activeTab, handleChangeTab } = useRiskAnalysis();

  return (
    <Fragment>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-2xl font-semibold">{t('menu.risk_analysis')}</h5>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={handleChangeTab} className="w-full">
        <TabsList>
          <TabsTrigger value={RiskAnalysisTab.XICHO}>{t('risk_analysis_tabs.XICHO')}</TabsTrigger>
          <TabsTrigger value={RiskAnalysisTab.INM}>{t('risk_analysis_tabs.INM')}</TabsTrigger>
          <TabsTrigger value={RiskAnalysisTab.LIFT}>{t('risk_analysis_tabs.LIFT')}</TabsTrigger>
          <TabsTrigger value={RiskAnalysisTab.ATTRACTION}>{t('risk_analysis_tabs.ATTRACTION')}</TabsTrigger>
        </TabsList>

        <TabsContent value={RiskAnalysisTab.XICHO} className="mt-4">
          <XichoList />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.INM} className="mt-4">
          <InmList />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.LIFT} className="mt-4">
          <LiftList />
        </TabsContent>
        <TabsContent value={RiskAnalysisTab.ATTRACTION} className="mt-4">
          <AttractionList />
        </TabsContent>
      </Tabs>
    </Fragment>
  );
};

export default RiskAnalysisWidget;
