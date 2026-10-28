import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { GoBack } from '@/shared/components/common'
import { DetailCardAccordion, DetailPageSkeleton } from '@/shared/components/common/detail-card'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomSearchParams } from '@/shared/hooks'
import useDetail from '@/shared/hooks/api/use-detail'
import { paramText } from '@/shared/lib/url-params'
import LegalApplicantInfo from '@/features/application/application-detail/ui/parts/legal-applicant-info'
import RiskAnalysisForm from './parts/risk-analysis-form'
import {
  RiskAnalysisInspectionLink,
  RiskAnalysisRecheckResult,
  RiskAnalysisWarning,
} from './parts/risk-analysis-warning'
import { RiskLevelBadge } from './parts/risk-level'
import { RiskProcessBar } from './parts/risk-process'
import type { RiskAnalysisData } from './risk-analysis'

const day = (value?: string | null) => (value ? format(new Date(value), 'dd.MM.yyyy') : '...')

const ScoreBadges = ({ level, score }: { level?: RiskAnalysisData['level']; score?: number | null }) => (
  <div className="flex items-center gap-2">
    <RiskLevelBadge level={level} />
    <Badge variant={(score ?? 0) > 80 ? 'destructive' : 'success'}>Jami ballar: {score ?? '—'}</Badge>
  </div>
)

/**
 * One quarter's analysis of one object, opened straight from the list: where
 * it stands, the organisation, then the first analysis and the recheck each in
 * its own section.
 */
const RiskAnalysisInfoById = () => {
  const {
    paramsObject: { tin, name },
  } = useCustomSearchParams()
  const { id } = useParams()

  const { data, isLoading } = useDetail<RiskAnalysisData>('/risk-analyses', id)

  const tinNumber = paramText(tin) || (data?.identity ? String(data.identity) : '')
  const title = `Tashkilot: ${paramText(name)} ${tinNumber ? `(${tinNumber})` : ''}`

  if (isLoading) return <DetailPageSkeleton sections={3} />

  if (!data) {
    return (
      <>
        <GoBack title={title} />
        <p className="mt-6 text-sm text-neutral-500">Xavf tahlili topilmadi.</p>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <GoBack title={title} />
        {/* The quarter is what the whole page is about, so it sits by the title rather than in a section */}
        <div className="flex shrink-0 items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm">
          <CalendarDays className="size-4 text-neutral-500" />
          <span className="text-neutral-500">Davr:</span>
          <span className="font-semibold text-gray-800">
            {day(data.startDate)} – {day(data.endDate)}
          </span>
        </div>
      </div>

      <RiskProcessBar data={data} />
      <RiskAnalysisInspectionLink data={data} />

      {/* The organisation is looked up on demand; the analyses are what the page is opened for */}
      <DetailCardAccordion defaultValue={['first_analysis', 'second_analysis']}>
        <DetailCardAccordion.Item value="org_info" title="Tashkilot to‘g‘risida ma’lumot">
          <LegalApplicantInfo tinNumber={tinNumber} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item
          value="first_analysis"
          title="O‘tkazilgan xavf tahlili"
          action={<ScoreBadges level={data.level} score={data.totalScore} />}
        >
          <RiskAnalysisWarning data={data} />
          <RiskAnalysisForm data={data.indicators} />
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item
          value="second_analysis"
          title="Qayta o‘tkazilgan xavf tahlili"
          action={data.recheckAt ? <ScoreBadges level={data.recheckLevel} score={data.recheckTotalScore} /> : null}
        >
          <RiskAnalysisRecheckResult data={data} />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  )
}

export default RiskAnalysisInfoById
