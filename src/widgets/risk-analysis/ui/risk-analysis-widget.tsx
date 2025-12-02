import Table from '@/features/risk-analysis/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import { getCurrentMonthEnum, MONTHS } from '@/widgets/prevention/ui/prevention-widget';
import { cn } from '@/shared/lib/utils';

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
    paramsObject: {
      mainTab = RiskAnalysisTab.XICHO,
      riskLevel = 'ALL',
      year = new Date().getFullYear(),
      size = 10,
      page = 1,
      month = getCurrentMonthEnum(),
    },
  } = useCustomSearchParams();

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(API_ENDPOINTS.RISK_ASSESSMENT_HF, {
    type: mainTab,
    level: riskLevel == 'ALL' ? undefined : riskLevel,
    year,
    size,
    page,
  });

  const { data: hfCount = 0 } = useData<number>('/hf/count', false);
  const { data: irsCount = 0 } = useData<number>('/irs/count', false);
  const { data: xrayCount = 0 } = useData<number>('/xrays/count', false);
  const { data: elevatorCount = 0 } = useData<number>('/equipments/count?type=ELEVATOR', false);
  const { data: attractionCount = 0 } = useData<number>('/equipments/count?type=ATTRACTION', false);
  const { data: lpgPoweredCount = 0 } = useData<number>('/equipments/count?type=LPG_POWERED', false);

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
        <div className={cn('flex justify-between overflow-x-auto no-scrollbar overflow-y-hidden mb-2')}>
          <TabsList>
            <TabsTrigger value={RiskAnalysisTab.XICHO}>
              {t('risk_analysis_tabs.XICHO')}
              <Badge variant="destructive" className="ml-2">
                {hfCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.INM}>
              {t('risk_analysis_tabs.INM')}
              <Badge variant="destructive" className="ml-2">
                {irsCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.LIFT}>
              {t('risk_analysis_tabs.LIFT')}
              <Badge variant="destructive" className="ml-2">
                {elevatorCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.ATTRACTION}>
              {t('risk_analysis_tabs.ATTRACTION')}
              <Badge variant="destructive" className="ml-2">
                {attractionCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.XRAY}>
              {t('risk_analysis_tabs.XRAY')}
              <Badge variant="destructive" className="ml-2">
                {xrayCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.LPG_POWERED}>
              {t('risk_analysis_tabs.LPG_POWERED')}
              <Badge variant="destructive" className="ml-2">
                {lpgPoweredCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
          {action}
        </div>
      </Tabs>

      <Tabs
        className="mb-2 w-full"
        value={month?.toString()}
        onValueChange={(val) => addParams({ month: val, page: 1 })}
      >
        <div className={cn('flex w-full justify-between overflow-x-auto no-scrollbar overflow-y-hidden mb-2')}>
          <TabsList className="h-auto p-1 w-full">
            {MONTHS.map((type) => (
              <TabsTrigger className="flex-1" key={type.value} value={type.value}>
                {type.label}
                <Badge
                  variant="destructive"
                  className="ml-2  group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary"
                >
                  {type?.count || 0}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <Table isLoading={isLoading} data={data} />
    </Fragment>
  );
};

export default RiskAnalysisWidget;
