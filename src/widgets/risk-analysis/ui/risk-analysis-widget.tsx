import Table from '@/features/risk-analysis/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { RiskAnalysisTab } from '@/entities/risk-analysis/model/risk-analysis-tabs'
import { Badge } from '@/shared/components/ui/badge'
import { useData } from '@/shared/hooks/api'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { UserRoles } from '@/shared/types/user'
import { useAuth } from '@/shared/hooks/use-auth'
import {
  RECHECK_HIGH_LEVEL,
  RECHECK_LEVEL_FILTERS,
  riskLevelParams,
  riskPeriodParams,
  type RiskAnalysisItem,
  type RiskAnalysisPeriodType,
  type RiskLevelCount,
  type RiskRegionCount,
} from '@/entities/risk-analysis/model/risk-analysis.types'
import { RiskStatisticsCards } from '@/entities/risk-analysis/ui/risk-statistics-cards'
import { RecheckRegionSummary } from './recheck-region-summary'
import { cn } from '@/shared/lib/utils'
import { TabsLayout } from '@/shared/layouts'
import { subDays, format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { toast } from 'sonner'
import { useRegionSelectQuery } from '@/shared/api/dictionaries'

const TAB_TO_API_TYPE: Record<string, string> = {
  [RiskAnalysisTab.HF]: 'HF',
  [RiskAnalysisTab.INM]: 'IRS',
  [RiskAnalysisTab.LIFT]: 'ELEVATOR',
  [RiskAnalysisTab.ATTRACTION]: 'ATTRACTION',
  [RiskAnalysisTab.XRAY]: 'XRAY',
}

import { getDefaultYearAndQuarterForRiskAnalysis } from '@/shared/utils/date'
import { paramOneOf, paramText } from '@/shared/lib/url-params'
import { invalidateEndpoint } from '@/shared/lib/query/endpoint-key'

interface RiskAnalysisWidgetProps {
  periodType: RiskAnalysisPeriodType
}

/** The recheck list and its summary share the space below the cards, one at a time. */
const RECHECK_VIEWS = ['list', 'regions'] as const
type RecheckView = (typeof RECHECK_VIEWS)[number]

const RECHECK_VIEW_TABS: { id: RecheckView; name: string }[] = [
  { id: 'list', name: 'Ro‘yxat' },
  { id: 'regions', name: 'Viloyatlar kesimida' },
]

/** The region select's "no region" value; the list is then the whole country's. */
const ALL_REGIONS = 'ALL'

/**
 * The tables fill what the cards leave, which on a short screen is a row or
 * two; below this the page scrolls instead of the table shrinking further.
 */
const TABLE_MIN_HEIGHT = 'min-h-[400px]'

const RiskAnalysisWidget = ({ periodType }: RiskAnalysisWidgetProps) => {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const isChairman = user?.role === UserRoles.CHAIRMAN
  const isDaily = periodType === 'DAILY'

  const { data: switchData } = useData<boolean>('/risk-analysis-switch', isChairman && isDaily)

  const { mutate: runDaily, isPending: isRunningDaily } = useMutation({
    mutationFn: async () => (await apiClient.post<{ message?: string }>('/risk-analyses/run-daily')).data,
    onSuccess: (response) => {
      toast.success(response?.message || 'Kunlik tahlil muvaffaqiyatli ishga tushirildi!', { richColors: true })
      void invalidateEndpoint(queryClient, '/risk-analysis-switch')
    },
  })

  const handleRunDaily = () => {
    runDaily()
  }

  const { year: defaultYear, quarter: defaultQuarter } = getDefaultYearAndQuarterForRiskAnalysis()

  const previousDayDate = subDays(new Date(), 1)
  const defaultDate = format(previousDayDate, 'yyyy-MM-dd')

  const {
    addParams,
    paramsObject: {
      mainTab: mainTabParam,
      riskLevel = 'ALL',
      year: yearParam,
      quarter: quarterParam,
      date: dateParam,
      size = 10,
      page = 1,
      regionId,
      name,
      registryNumber,
      ownerName,
      address,
      identity,
      inspectorId,
      periodId,
      status,
      recheckView: recheckViewParam,
      // isWarningSent, - its column is hidden, so an old link must not filter unseen
    },
  } = useCustomSearchParams()

  const mainTab = paramText(mainTabParam, RiskAnalysisTab.HF)
  const year = paramText(yearParam, defaultYear)
  const quarter = paramText(quarterParam, defaultQuarter)
  const date = paramText(dateParam, defaultDate)
  const period = riskPeriodParams(periodType, { year, quarter, date })

  const isRestrictedRole = user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL
  const isSupervisorOrController = user?.isSupervisor || user?.isController
  const shouldShowRegions = !isRestrictedRole || isSupervisorOrController

  const { data: regions = [] } = useRegionSelectQuery(shouldShowRegions)

  const currentApiType = TAB_TO_API_TYPE[mainTab] || 'HF'

  // The chairman's breakdown of the recheck; the backend counts XICHO only
  const hasRecheckSummary = (level: string) =>
    isChairman && periodType === 'QUARTERLY' && level === RECHECK_HIGH_LEVEL && currentApiType === 'HF'
  const showRecheckSummary = hasRecheckSummary(String(riskLevel))
  const recheckView = paramOneOf(recheckViewParam, RECHECK_VIEWS, 'list')

  /**
   * The recheck list is the whole country's until a region is picked in its
   * select or its summary; elsewhere the region strip always has one selected.
   */
  const activeRegion = showRecheckSummary
    ? regionId?.toString() || undefined
    : shouldShowRegions
      ? regionId?.toString() || (regions.length > 0 ? regions[0].id.toString() : '')
      : undefined

  const apiParams = {
    type: currentApiType,
    ...period,
    ...riskLevelParams(String(riskLevel)),
    size,
    page,
    regionId: activeRegion,
    name,
    registryNumber,
    ownerName,
    address,
    identity,
    inspectorId,
    periodId,
    // isWarningSent,
  }

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(
    '/risk-analyses',
    apiParams,
    showRecheckSummary ? recheckView === 'list' : shouldShowRegions ? !!activeRegion : true
  )

  const countsApiParams = period

  const { data: hfRiskCounts } = useData<RiskLevelCount>('/risk-analyses/count', true, {
    type: 'HF',
    ...countsApiParams,
  })
  const { data: irsRiskCounts } = useData<RiskLevelCount>('/risk-analyses/count', true, {
    type: 'IRS',
    ...countsApiParams,
  })
  const { data: xrayRiskCounts } = useData<RiskLevelCount>('/risk-analyses/count', true, {
    type: 'XRAY',
    ...countsApiParams,
  })
  const { data: attractionRiskCounts } = useData<RiskLevelCount>('/risk-analyses/count', true, {
    type: 'ATTRACTION',
    ...countsApiParams,
  })

  const getSum = (counts?: RiskLevelCount) =>
    (counts?.lowCount || 0) + (counts?.mediumCount || 0) + (counts?.highCount || 0)

  const hfTotalCount = getSum(hfRiskCounts)
  const irsTotalCount = getSum(irsRiskCounts)
  const xrayTotalCount = getSum(xrayRiskCounts)
  const attractionTotalCount = getSum(attractionRiskCounts)

  // The recheck summary's table already counts every region, so the strip would only repeat it
  const showRegionStrip = shouldShowRegions && !showRecheckSummary

  const { data: regionCounts = [] } = useData<RiskRegionCount[]>('/risk-analyses/count/by-region', showRegionStrip, {
    type: currentApiType,
    ...period,
    ...riskLevelParams(String(riskLevel)),
    name,
    registryNumber,
    ownerName,
    address,
    identity,
    inspectorId,
    periodId,
    status,
  })

  // The recheck always opens on the whole country's list
  const handleCardTabChange = (level: string) => {
    if (hasRecheckSummary(level)) {
      addParams({ riskLevel: level }, 'page', 'recheckView', 'regionId')
    } else {
      addParams({ riskLevel: level }, 'page', 'recheckView')
    }
  }

  const handleRecheckRegionChange = (value: string) => {
    if (value === ALL_REGIONS) {
      addParams({ page: 1 }, 'regionId')
    } else {
      addParams({ regionId: value, page: 1 })
    }
  }

  /** A summary row opens its region's list; the total row, every region's. */
  const handleRecheckRegionSelect = (selectedRegionId: number | null) => {
    if (selectedRegionId === null) {
      addParams({ recheckView: 'list', page: 1 }, 'regionId')
    } else {
      addParams({ recheckView: 'list', regionId: selectedRegionId, page: 1 })
    }
  }

  // LOW and MEDIUM results are never rechecked, so the figure would only ever read 0 there
  const showRecheckCount = periodType === 'QUARTERLY' && RECHECK_LEVEL_FILTERS.includes(String(riskLevel))

  const regionTabs = useMemo(() => {
    return (
      regions?.map((item) => {
        const id = item?.id?.toString()
        const countItem = regionCounts.find((c) => c.regionId === item.id)
        const count = countItem?.count || 0

        return {
          id,
          name: item.name || '',
          count: count,
          // Absent until the backend sends it, and then the tab shows nothing extra
          secondaryCount: showRecheckCount ? countItem?.recheckCount : undefined,
          secondaryTitle: 'Qayta xavf tahlili o‘tkazilganlar',
        }
      }) || []
    )
  }, [regions, regionCounts, showRecheckCount])

  return (
    <>
      <Tabs
        defaultValue={mainTab}
        value={mainTab}
        onValueChange={(tab) => addParams({ mainTab: tab, page: 1, riskLevel: 'ALL' }, 'recheckView')}
        className="w-full"
      >
        <div className={cn('scrollbar-hidden mb-2 flex justify-between overflow-x-auto overflow-y-hidden')}>
          <TabsList>
            <TabsTrigger value={RiskAnalysisTab.HF}>
              {t('risk_analysis_tabs.XICHO')}
              <Badge variant="destructive" className="ml-2">
                {hfTotalCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.INM}>
              {t('risk_analysis_tabs.INM')}
              <Badge variant="destructive" className="ml-2">
                {irsTotalCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.XRAY}>
              {t('risk_analysis_tabs.XRAY')}
              <Badge variant="destructive" className="ml-2">
                {xrayTotalCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.ATTRACTION}>
              {t('risk_analysis_tabs.ATTRACTION')}
              <Badge variant="destructive" className="ml-2">
                {attractionTotalCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
          {isChairman && isDaily && (
            <Button variant="default" onClick={handleRunDaily} disabled={switchData === false || isRunningDaily}>
              {isRunningDaily ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('Kunlik tahlilni ishga tushirish')}
            </Button>
          )}
        </div>
      </Tabs>

      <RiskStatisticsCards
        type={currentApiType || ''}
        activeRiskLevel={riskLevel as string}
        onTabChange={handleCardTabChange}
        periodType={periodType}
        year={year}
        quarter={quarter}
        date={date}
        regionId={activeRegion}
      />

      {showRecheckSummary ? (
        <TabsLayout
          className="mb-2"
          tabs={RECHECK_VIEW_TABS}
          activeTab={recheckView}
          onTabChange={(view) => addParams({ recheckView: view })}
          action={
            recheckView === 'list' ? (
              <Select value={activeRegion ?? ALL_REGIONS} onValueChange={handleRecheckRegionChange}>
                <SelectTrigger className="h-10 w-[220px] bg-white">
                  <SelectValue placeholder="Hudud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_REGIONS}>Respublika bo‘yicha</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={String(region.id)}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null
          }
        />
      ) : regionTabs.length > 0 && showRegionStrip ? (
        <TabsLayout
          className="mb-2"
          tabs={regionTabs}
          activeTab={activeRegion ?? ''}
          onTabChange={(val) => addParams({ regionId: val, page: 1 })}
          outlineInactiveCount={true}
          showArrows={true}
        />
      ) : null}

      {showRecheckSummary && recheckView === 'regions' ? (
        <RecheckRegionSummary
          className={TABLE_MIN_HEIGHT}
          year={year}
          quarter={quarter}
          regions={regions}
          onRegionSelect={handleRecheckRegionSelect}
        />
      ) : (
        <Table className={TABLE_MIN_HEIGHT} isLoading={isLoading} data={data} />
      )}
    </>
  )
}

export default RiskAnalysisWidget
