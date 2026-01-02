import Table from '@/features/risk-analysis/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RiskAnalysisTab } from '../types'
import { Badge } from '@/shared/components/ui/badge'
import { useData } from '@/shared/hooks/api'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { UserRoles } from '@/entities/user'
import { Button } from '@/shared/components/ui/button'
import { NotebookText } from 'lucide-react'
import { useAuth } from '@/shared/hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types'
import { RiskStatisticsCards } from '@/widgets/risk-analysis/ui/parts/risk-statistics-cards'
import { cn } from '@/shared/lib/utils'
import { TabsLayout } from '@/shared/layouts'
import { getRegionLabel } from '@/widgets/prevention/ui/prevention-widget'
import { getQuarter } from 'date-fns'

const TAB_TO_API_TYPE: Record<string, string> = {
  [RiskAnalysisTab.XICHO]: 'HF',
  [RiskAnalysisTab.INM]: 'IRS',
  [RiskAnalysisTab.LIFT]: 'ELEVATOR',
  [RiskAnalysisTab.ATTRACTION]: 'ATTRACTION',
  [RiskAnalysisTab.XRAY]: 'XRAY',
  [RiskAnalysisTab.LPG_POWERED]: 'LPG_POWERED',
}

const RiskAnalysisWidget = () => {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    addParams,
    paramsObject: {
      mainTab = RiskAnalysisTab.XICHO,
      riskLevel = 'ALL',
      year = new Date().getFullYear(),
      size = 10,
      page = 1,
      regionId,
      quarter = getQuarter(new Date()).toString(),
      // month = getCurrentMonthEnum(),
    },
  } = useCustomSearchParams()

  const { data: regions = [] } = useData<{ id: number; name: string }[]>('/regions/select')

  const activeRegion = regionId?.toString() || (regions && regions.length > 0 ? regions[0].id?.toString() : '')

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(
    '/risk-analyses',
    {
      type: mainTab,
      level: riskLevel == 'ALL' ? undefined : riskLevel,
      year,
      size,
      page,
      quarter,
      regionId: activeRegion,
    },
    !!activeRegion
  )

  const { data: hfCount = 0 } = useData<number>('/hf/count', false)
  const { data: irsCount = 0 } = useData<number>('/irs/count', false)
  const { data: xrayCount = 0 } = useData<number>('/xrays/count', false)
  const { data: elevatorCount = 0 } = useData<number>('/equipments/count?type=ELEVATOR', false)
  const { data: attractionCount = 0 } = useData<number>('/equipments/count?type=ATTRACTION', false)
  const { data: lpgPoweredCount = 0 } = useData<number>('/equipments/count?type=LPG_POWERED', false)

  const currentApiType = TAB_TO_API_TYPE[mainTab as string] || 'HF'

  const action = useMemo(() => {
    if ([UserRoles.INSPECTOR, UserRoles.INDIVIDUAL]?.includes(user?.role as unknown as UserRoles)) {
      return (
        <Button onClick={() => navigate('/risk-analysis/my-tasks')}>
          <NotebookText /> Mening topshiriqlarim
        </Button>
      )
    }
    return null
  }, [user?.role])

  const handleCardTabChange = (level: string) => {
    addParams({ riskLevel: level }, 'page')
  }

  const regionTabs = useMemo(() => {
    return (
      regions?.map((item) => ({
        id: item?.id?.toString(),
        name: getRegionLabel(item.name || ''),
        count: 0,
      })) || []
    )
  }, [regions])

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
        <div className={cn('scrollbar-hidden mb-2 flex justify-between overflow-x-auto overflow-y-hidden')}>
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

      {/*<Tabs*/}
      {/*  className="mb-2 w-full"*/}
      {/*  value={month?.toString()}*/}
      {/*  onValueChange={(val) => addParams({ month: val, page: 1 })}*/}
      {/*>*/}
      {/*  <div className={cn('scrollbar-hidden mb-2 flex w-full justify-between overflow-x-auto overflow-y-hidden')}>*/}
      {/*    <TabsList className="h-auto w-full p-1">*/}
      {/*      {MONTHS.map((type) => (*/}
      {/*        <TabsTrigger className="flex-1" key={type.value} value={type.value}>*/}
      {/*          {type.label}*/}
      {/*          <Badge*/}
      {/*            variant="destructive"*/}
      {/*            className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"*/}
      {/*          >*/}
      {/*            {type?.count || 0}*/}
      {/*          </Badge>*/}
      {/*        </TabsTrigger>*/}
      {/*      ))}*/}
      {/*    </TabsList>*/}
      {/*  </div>*/}
      {/*</Tabs>*/}

      {regionTabs.length > 0 ? (
        <TabsLayout
          classNameTabList="!mb-0 w-full"
          classNameWrapper="w-full"
          classNameTrigger="flex-1"
          className="mb-2"
          tabs={regionTabs}
          activeTab={activeRegion}
          onTabChange={(val) => addParams({ regionId: val, page: 1 })}
        />
      ) : null}

      <Table isLoading={isLoading} data={data} />
    </Fragment>
  )
}

export default RiskAnalysisWidget
