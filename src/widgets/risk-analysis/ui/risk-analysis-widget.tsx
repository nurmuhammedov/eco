import Table from '@/features/risk-analysis/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RiskAnalysisTab } from '../types'
import { Badge } from '@/shared/components/ui/badge'
import { useData } from '@/shared/hooks/api'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types'
import { RiskStatisticsCards } from '@/widgets/risk-analysis/ui/parts/risk-statistics-cards'
import { cn } from '@/shared/lib/utils'
import { TabsLayout } from '@/shared/layouts'
import { getRegionLabel } from '@/widgets/prevention/ui/prevention-widget'
import { getQuarter, subQuarters } from 'date-fns'

interface RiskCountResponse {
  lowCount: number
  mediumCount: number
  highCount: number
}

interface RegionCountDto {
  regionId: number
  count: number
  region: string
}

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

  const previousQuarterDate = subQuarters(new Date(), 1)
  const defaultYear = previousQuarterDate.getFullYear()
  const defaultQuarter = getQuarter(previousQuarterDate).toString()

  const {
    addParams,
    paramsObject: {
      mainTab = RiskAnalysisTab.XICHO,
      riskLevel = 'ALL',
      year = defaultYear,
      size = 10,
      page = 1,
      regionId,
      quarter = defaultQuarter,
    },
  } = useCustomSearchParams()

  const { data: regions = [] } = useData<{ id: number; name: string }[]>('/regions/select')

  // Agar regionId URL da bo'lmasa, birinchi regionni olamiz
  const activeRegion = regionId?.toString() || (regions.length > 0 ? regions[0].id.toString() : '')

  const currentApiType = TAB_TO_API_TYPE[mainTab as string] || 'HF'

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(
    '/risk-analyses',
    {
      type: currentApiType,
      level: riskLevel == 'ALL' ? undefined : riskLevel,
      year,
      size,
      page,
      quarter,
      regionId: activeRegion,
    },
    !!activeRegion
  )

  const { data: irsCount = 0 } = useData<number>('/irs/count', false)
  const { data: xrayCount = 0 } = useData<number>('/xrays/count', false)
  const { data: elevatorCount = 0 } = useData<number>('/equipments/count?type=ELEVATOR', false)
  const { data: attractionCount = 0 } = useData<number>('/equipments/count?type=ATTRACTION', false)
  const { data: lpgPoweredCount = 0 } = useData<number>('/equipments/count?type=LPG_POWERED', false)

  const { data: hfRiskCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    type: 'HF',
    year,
    quarter,
  })

  const { data: regionCounts = [] } = useData<RegionCountDto[]>('/risk-analyses/count/by-region', true, {
    type: currentApiType,
    year,
    quarter,
  })

  const hfTotalCount = (hfRiskCounts?.lowCount || 0) + (hfRiskCounts?.mediumCount || 0) + (hfRiskCounts?.highCount || 0)

  const handleCardTabChange = (level: string) => {
    addParams({ riskLevel: level }, 'page')
  }

  const regionTabs = useMemo(() => {
    return (
      regions?.map((item) => {
        const id = item?.id?.toString()
        const countItem = regionCounts.find((c) => c.regionId === item.id)
        const count = countItem?.count || 0

        return {
          id,
          name: getRegionLabel(item.name || ''),
          count: count,
        }
      }) || []
    )
  }, [regions, regionCounts])

  return (
    <Fragment>
      <RiskStatisticsCards
        type={currentApiType || ''}
        activeRiskLevel={riskLevel as string}
        onTabChange={handleCardTabChange}
        year={year}
        quarter={quarter}
        regionId={activeRegion}
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
                {hfTotalCount}
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
        </div>
      </Tabs>

      {regionTabs.length > 0 &&
      ![UserRoles.INSPECTOR, UserRoles.REGIONAL]?.includes(user?.role as unknown as UserRoles) ? (
        <TabsLayout
          classNameTabList="!mb-0 w-full"
          classNameWrapper="w-full"
          classNameTrigger="flex-1"
          className="mb-2"
          tabs={regionTabs}
          activeTab={activeRegion}
          onTabChange={(val) => addParams({ regionId: val, page: 1 })}
          outlineInactiveCount={true}
        />
      ) : null}

      <Table isLoading={isLoading} data={data} />
    </Fragment>
  )
}

export default RiskAnalysisWidget
