import { type ReactNode, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowRight, Check, Circle, Clock, Minus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Skeleton } from '@/shared/components/ui/skeleton'
import useDetail from '@/shared/hooks/api/use-detail'
import { cn } from '@/shared/lib/utils'
import type { RiskAnalysisPeriod } from '@/entities/risk-analysis/model/risk-analysis.types'
import type { RiskAnalysisData } from '../risk-analysis'
import { RISK_LEVEL_LABELS, canHaveWarning } from './risk-level'

type StepState = 'done' | 'active' | 'pending' | 'skipped'

interface ProcessStep {
  title: string
  /** What fits on the chevron */
  short: string
  state: StepState
  caption: string
}

const day = (value?: string | null) => (value ? format(new Date(value), 'dd.MM.yyyy') : '')

const periodLabel = (period: Pick<RiskAnalysisPeriod, 'startDate' | 'endDate'>) =>
  [period.startDate, period.endDate].map((value) => day(value) || '...').join(' – ')

const score = (total?: number | null, level?: RiskAnalysisData['level']) =>
  [total !== null && total !== undefined ? `${total} ball` : null, level ? RISK_LEVEL_LABELS[level] : null]
    .filter(Boolean)
    .join(' · ')

/**
 * The chain one quarter's analysis goes through: result → warning → recheck →
 * inspection. Each step is read off the analysis itself; there is no status
 * field for the chain yet. A LOW result ends it at the first step, and an
 * analysis that went straight to an inspection (before warnings existed) shows
 * the two middle steps as not applied.
 */
export const deriveRiskProcess = (data: RiskAnalysisData): ProcessStep[] => {
  const needsWarning = canHaveWarning(data.level)
  const movedOn = !!data.inspectionId

  const warning: ProcessStep = data.warningDate
    ? { title: 'Tavsiyanoma', short: 'Tavsiyanoma', state: 'done', caption: `Yuborilgan: ${day(data.warningDate)}` }
    : !needsWarning
      ? { title: 'Tavsiyanoma', short: 'Tavsiyanoma', state: 'skipped', caption: 'Talab qilinmaydi' }
      : movedOn || data.recheckAt
        ? { title: 'Tavsiyanoma', short: 'Tavsiyanoma', state: 'skipped', caption: 'Yuborilmagan' }
        : { title: 'Tavsiyanoma', short: 'Tavsiyanoma', state: 'active', caption: 'Yuborilishi kutilmoqda' }

  const recheck: ProcessStep = data.recheckAt
    ? {
        title: '2-xavf tahlili natijasi',
        short: '2-tahlil',
        state: 'done',
        caption: `${data.totalScore ?? '—'} → ${data.recheckTotalScore ?? '—'} ball, ${day(data.recheckAt)}`,
      }
    : !needsWarning
      ? { title: '2-xavf tahlili natijasi', short: '2-tahlil', state: 'skipped', caption: 'Talab qilinmaydi' }
      : movedOn
        ? { title: '2-xavf tahlili natijasi', short: '2-tahlil', state: 'skipped', caption: 'O‘tkazilmagan' }
        : data.warningDate
          ? { title: '2-xavf tahlili natijasi', short: '2-tahlil', state: 'active', caption: 'Kutilmoqda' }
          : { title: '2-xavf tahlili natijasi', short: '2-tahlil', state: 'pending', caption: 'Tavsiyanomadan keyin' }

  const inspection: ProcessStep = movedOn
    ? { title: 'Tekshiruv', short: 'Tekshiruv', state: 'done', caption: 'Shakllangan' }
    : !needsWarning
      ? { title: 'Tekshiruv', short: 'Tekshiruv', state: 'skipped', caption: 'Talab qilinmaydi' }
      : data.recheckAt && data.recheckLevel === 'HIGH'
        ? { title: 'Tekshiruv', short: 'Tekshiruv', state: 'active', caption: 'Shakllanishi kutilmoqda' }
        : data.recheckAt
          ? { title: 'Tekshiruv', short: 'Tekshiruv', state: 'skipped', caption: 'Xavf kamaygan, talab qilinmaydi' }
          : { title: 'Tekshiruv', short: 'Tekshiruv', state: 'pending', caption: 'Qayta tahlil yuqori chiqsa' }

  return [
    { title: '1-xavf tahlili natijasi', short: '1-tahlil', state: 'done', caption: score(data.totalScore, data.level) },
    warning,
    recheck,
    inspection,
  ]
}

const STATE_STYLES: Record<StepState, string> = {
  done: 'bg-teal text-white',
  active: 'bg-amber-100 text-amber-900',
  pending: 'bg-gray-100 text-gray-500',
  skipped: 'bg-gray-50 text-gray-400',
}

const STATE_ICON: Record<StepState, ReactNode> = {
  done: <Check className="size-3.5 shrink-0" strokeWidth={3} />,
  active: <Clock className="size-3.5 shrink-0" />,
  pending: <Circle className="size-3 shrink-0" />,
  skipped: <Minus className="size-3.5 shrink-0" />,
}

/**
 * Arrow head on the right, notch on the left, so the segments nest into one
 * another; the overlap leaves a 3px gap. Only from md up - stacked on a narrow
 * screen they are plain boxes. Written out in full for Tailwind to find them.
 */
const CHEVRON = {
  first: 'md:[clip-path:polygon(0_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,0_100%)]',
  middle: 'md:-ml-[9px] md:[clip-path:polygon(0_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,0_100%,12px_50%)]',
  last: 'md:-ml-[9px] md:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,12px_50%)]',
}

const chevronShape = (index: number, count: number) =>
  index === 0 ? CHEVRON.first : index === count - 1 ? CHEVRON.last : CHEVRON.middle

const ProcessChevrons = ({ steps }: { steps: ProcessStep[] }) => (
  <ol className="flex flex-col gap-1 md:flex-row md:gap-0">
    {steps.map((step, index) => (
      <li
        key={step.title}
        title={`${step.title}: ${step.caption || '—'}`}
        className={cn(
          'flex h-9 min-w-0 items-center gap-1.5 rounded-md px-3 text-xs md:flex-1 md:rounded-none',
          index > 0 && 'md:pl-6',
          chevronShape(index, steps.length),
          STATE_STYLES[step.state]
        )}
      >
        {STATE_ICON[step.state]}
        <span className="shrink-0 font-semibold">{step.short}</span>
        <span className="truncate opacity-90">· {step.caption || '—'}</span>
      </li>
    ))}
  </ol>
)

interface RiskProcessProps {
  periods: RiskAnalysisPeriod[]
  /** Query string the full analysis page is opened with (tin and organisation name) */
  detailQuery: string
}

/** One quarter's analysis and where it stands, with a picker for the earlier quarters. */
export const RiskProcess = ({ periods, detailQuery }: RiskProcessProps) => {
  const sorted = useMemo(
    () => [...periods].sort((a, b) => String(b.startDate ?? '').localeCompare(String(a.startDate ?? ''))),
    [periods]
  )
  const [selectedId, setSelectedId] = useState<string | undefined>()
  const currentId = selectedId ?? sorted[0]?.id

  const { data, isLoading } = useDetail<RiskAnalysisData>('/risk-analyses', currentId)

  if (!sorted.length) return null

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-lg border bg-white px-3 py-2.5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-800">Xavf tahlili jarayoni</span>
          {data && (
            <>
              {' · Hozirgi holati: '}
              <span className="font-semibold text-gray-800">
                {score(data.recheckTotalScore ?? data.totalScore, data.recheckLevel ?? data.level)}
              </span>
            </>
          )}
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Select value={currentId} onValueChange={setSelectedId}>
            <SelectTrigger className="h-8 w-auto min-w-[250px] gap-2 bg-white text-sm whitespace-nowrap [&>span]:overflow-visible">
              <SelectValue placeholder="Davrni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {sorted.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {periodLabel(period)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentId && (
            <Button asChild size="sm" variant="outline" className="h-8">
              <Link to={`/risk-analysis/objects/${currentId}?${detailQuery}`}>
                Batafsil
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isLoading || !data ? <Skeleton className="h-9 w-full" /> : <ProcessChevrons steps={deriveRiskProcess(data)} />}
    </div>
  )
}
