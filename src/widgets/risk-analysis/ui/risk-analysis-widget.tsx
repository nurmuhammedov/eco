import Table from '@/features/risk-analysis/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useMemo } from 'react'
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
import { subMonths, subDays, getMonth, format } from 'date-fns'
import { Button } from '@/shared/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/api-client'
import { toast } from 'sonner'
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

const MONTHS = [
  { id: 'JANUARY', name: 'Yanvar' },
  { id: 'FEBRUARY', name: 'Fevral' },
  { id: 'MARCH', name: 'Mart' },
  { id: 'APRIL', name: 'Aprel' },
  { id: 'MAY', name: 'May' },
  { id: 'JUNE', name: 'Iyun' },
  { id: 'JULY', name: 'Iyul' },
  { id: 'AUGUST', name: 'Avgust' },
  { id: 'SEPTEMBER', name: 'Sentabr' },
  { id: 'OCTOBER', name: 'Oktabr' },
  { id: 'NOVEMBER', name: 'Noyabr' },
  { id: 'DECEMBER', name: 'Dekabr' },
]

interface RiskAnalysisWidgetProps {
  periodType: 'DAILY' | 'MONTHLY'
}

const RiskAnalysisWidget = ({ periodType }: RiskAnalysisWidgetProps) => {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const isChairman = user?.role === UserRoles.CHAIRMAN
  const isDaily = periodType === 'DAILY'

  const { data: switchData } = useData<boolean>('/risk-analysis-switch', isChairman && isDaily)

  const { mutate: runDaily, isPending: isRunningDaily } = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<any>('/risk-analyses/run-daily')
      return response
    },
    onSuccess: (res: any) => {
      const message = res?.message || res?.data?.message || 'Kunlik tahlil muvaffaqiyatli ishga tushirildi!'
      toast.success(message, { richColors: true })
      queryClient.invalidateQueries({ queryKey: ['/risk-analysis-switch'] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Xatolik yuz berdi'
      toast.error(message, { richColors: true })
    },
  })

  const handleRunDaily = () => {
    runDaily()
  }

  const previousMonthDate = subMonths(new Date(), 1)
  const defaultYear = previousMonthDate.getFullYear().toString()
  const defaultMonth = MONTHS[getMonth(previousMonthDate)].id

  const previousDayDate = subDays(new Date(), 1)
  const defaultDate = format(previousDayDate, 'yyyy-MM-dd')

  const {
    addParams,
    paramsObject: {
      mainTab = RiskAnalysisTab.XICHO,
      riskLevel = 'ALL',
      year = defaultYear,
      month = defaultMonth,
      date = defaultDate,
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
    },
  } = useCustomSearchParams()

  const isRestrictedRole = [UserRoles.INSPECTOR, UserRoles.REGIONAL].includes(user?.role as unknown as UserRoles)
  const isSupervisorOrController = user?.isSupervisor || user?.isController
  const shouldShowRegions = !isRestrictedRole || isSupervisorOrController

  const { data: regions = [] } = useData<{ id: number; name: string }[]>('/regions/select', shouldShowRegions)

  const activeRegion = shouldShowRegions
    ? regionId?.toString() || (regions.length > 0 ? regions[0].id.toString() : '')
    : undefined

  const currentApiType = TAB_TO_API_TYPE[mainTab as string] || 'HF'

  const apiParams = {
    type: currentApiType,
    periodType,
    level: riskLevel == 'ALL' ? undefined : riskLevel,
    year: periodType === 'MONTHLY' ? year : undefined,
    month: periodType === 'MONTHLY' ? month : undefined,
    date: periodType === 'DAILY' ? date : undefined,
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
  }

  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>(
    '/risk-analyses',
    apiParams,
    shouldShowRegions ? !!activeRegion : true
  )

  const countsApiParams = {
    periodType,
    year: periodType === 'MONTHLY' ? year : undefined,
    month: periodType === 'MONTHLY' ? month : undefined,
    date: periodType === 'DAILY' ? date : undefined,
  }

  const { data: hfRiskCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    type: 'HF',
    ...countsApiParams,
  })
  const { data: irsRiskCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    type: 'IRS',
    ...countsApiParams,
  })
  const { data: xrayRiskCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    type: 'XRAY',
    ...countsApiParams,
  })
  const { data: attractionRiskCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    type: 'ATTRACTION',
    ...countsApiParams,
  })
  const { data: lpgPoweredRiskCounts } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    type: 'LPG_POWERED',
    ...countsApiParams,
  })

  const getSum = (counts?: RiskCountResponse) =>
    (counts?.lowCount || 0) + (counts?.mediumCount || 0) + (counts?.highCount || 0)

  const hfTotalCount = getSum(hfRiskCounts)
  const irsTotalCount = getSum(irsRiskCounts)
  const xrayTotalCount = getSum(xrayRiskCounts)
  const attractionTotalCount = getSum(attractionRiskCounts)
  const lpgPoweredTotalCount = getSum(lpgPoweredRiskCounts)

  const { data: regionCounts = [] } = useData<RegionCountDto[]>('/risk-analyses/count/by-region', shouldShowRegions, {
    type: currentApiType,
    periodType,
    level: riskLevel == 'ALL' ? undefined : riskLevel,
    year: periodType === 'MONTHLY' ? year : undefined,
    month: periodType === 'MONTHLY' ? month : undefined,
    date: periodType === 'DAILY' ? date : undefined,
    name,
    registryNumber,
    ownerName,
    address,
    identity,
    inspectorId,
    periodId,
    status,
  })

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
          name: item.name || '',
          count: count,
        }
      }) || []
    )
  }, [regions, regionCounts])

  return (
    <>
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
                {irsTotalCount}
              </Badge>
            </TabsTrigger>
            {/*<TabsTrigger value={RiskAnalysisTab.LIFT}>*/}
            {/*  {t('risk_analysis_tabs.LIFT')}*/}
            {/*  <Badge variant="destructive" className="ml-2">*/}
            {/*    {elevatorTotalCount}*/}
            {/*  </Badge>*/}
            {/*</TabsTrigger>*/}
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
            <TabsTrigger value={RiskAnalysisTab.LPG_POWERED}>
              {t('risk_analysis_tabs.LPG_POWERED')}
              <Badge variant="destructive" className="ml-2">
                {lpgPoweredTotalCount}
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
        month={month}
        date={date}
        regionId={activeRegion}
      />

      {regionTabs.length > 0 && shouldShowRegions ? (
        <TabsLayout
          className="mb-2"
          tabs={regionTabs}
          activeTab={activeRegion}
          onTabChange={(val) => addParams({ regionId: val, page: 1 })}
          outlineInactiveCount={true}
          showArrows={true}
        />
      ) : null}

      <Table isLoading={isLoading} data={data} />
    </>
  )
}

export default RiskAnalysisWidget
