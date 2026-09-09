import { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, FileQuestion, Layers, PauseCircle, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { StatValue } from './stat-value'

interface StatsCardsProps {
  type: 'hf' | 'equipment' | 'irs' | 'xray'
  data: any
  regionId?: string | null
}

type Tone = 'total' | 'active' | 'inactive' | 'expired' | 'noDate' | 'invalid'

/**
 * Colour carries meaning rather than decoration: a neutral surface with a single
 * accent keeps five tiles side by side readable instead of turning into a
 * rainbow, and leaves the figure itself as the most legible thing on the card.
 */
const TONES: Record<Tone, { accent: string; icon: string }> = {
  total: { accent: 'bg-teal', icon: 'text-teal' },
  active: { accent: 'bg-emerald-500', icon: 'text-emerald-600' },
  inactive: { accent: 'bg-slate-300', icon: 'text-slate-400' },
  expired: { accent: 'bg-red-500', icon: 'text-red-600' },
  noDate: { accent: 'bg-amber-500', icon: 'text-amber-600' },
  invalid: { accent: 'bg-slate-400', icon: 'text-slate-500' },
}

const TONE_ICONS: Record<Tone, ReactNode> = {
  total: <Layers className="size-5" />,
  active: <CheckCircle2 className="size-5" />,
  inactive: <XCircle className="size-5" />,
  expired: <AlertCircle className="size-5" />,
  noDate: <FileQuestion className="size-5" />,
  invalid: <PauseCircle className="size-5" />,
}

const SECTION_LABELS: Record<StatsCardsProps['type'], string> = {
  hf: 'Xavfli ishlab chiqarish obyektlari bo‘yicha statistika',
  equipment: 'Texnik qurilmalar bo‘yicha statistika',
  irs: 'Ionlashtiruvchi nurlanish manbalari bo‘yicha statistika',
  xray: 'Rentgen qurilmalari bo‘yicha statistika',
}

interface StatCardProps {
  title: string
  value: number
  tone: Tone
  href: string
  isLoading: boolean
}

const StatCard = ({ title, value, tone, href, isLoading }: StatCardProps) => {
  const { accent, icon } = TONES[tone]

  return (
    <Card className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200 p-4 pl-5 shadow-sm transition-shadow hover:shadow-md">
      <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-1', accent)} />

      <div className="flex items-start justify-between gap-2">
        {/* Two lines of room keeps a long title from making its card taller than the row. */}
        <span className="min-h-[2.5rem] text-sm leading-snug font-medium text-balance text-slate-600">{title}</span>
        <span aria-hidden="true" className={cn('shrink-0', icon)}>
          {TONE_ICONS[tone]}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2">
        <StatValue
          value={value}
          isLoading={isLoading}
          className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums xl:text-3xl"
          skeletonClassName="h-8 w-20 bg-slate-200"
        />
        <Link
          to={href}
          aria-label={`${title}ni ko‘rish`}
          className="focus-visible:ring-teal shrink-0 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:ring-1 focus-visible:outline-hidden focus-visible:ring-inset xl:text-sm"
        >
          Ko‘rish
        </Link>
      </div>
    </Card>
  )
}

/** Hoisted: a component declared inside the body remounts the whole grid on every render. */
const StatsSection = ({ label, isLoading, children }: { label: string; isLoading: boolean; children: ReactNode }) => (
  <section aria-busy={isLoading}>
    {/* One live region for the whole grid; per-card ones would announce five times. */}
    <h2 className="sr-only">{label}</h2>
    {children}
  </section>
)

export const StatsCards = ({ type, data, regionId }: StatsCardsProps) => {
  const isLoading = Boolean(data?.isLoading)
  const region = regionId ? `&regionId=${regionId}` : ''

  /**
   * Every card is the registry filter behind it. A "barcha" tile counted the
   * archive in with the registry, then opened a list that filters the archive
   * back out - the figure on the dashboard never matched the one it led to.
   */
  const buildCards = (): Omit<StatCardProps, 'isLoading'>[] => {
    const tab = { hf: 'hf', irs: 'irs', equipment: 'equipments', xray: 'xrays' }[type]
    const base = `/register?tab=${tab}${region}`
    // Deregistered records live in their own module; the registry list filters
    // them straight back out, so a card pointing there opened an empty filter.
    const archive = `/archive?tab=${tab}${region}`

    if (type === 'hf' || type === 'irs') {
      const label = type === 'hf' ? 'XICHOlar' : 'INMlar'
      const statusKey = type === 'hf' ? 'active' : 'valid'

      return [
        { title: `Reyestrdagi ${label}`, value: data.active, tone: 'total', href: `${base}&${statusKey}=true` },
        // The IRS registry has no status split; only the facility one does.
        ...(type === 'hf'
          ? [
              { title: 'Faol XICHOlar', value: data.valid, tone: 'active' as Tone, href: `${base}&active=VALID` },
              {
                title: 'Nofaol XICHOlar',
                value: data.invalid,
                tone: 'invalid' as Tone,
                href: `${base}&active=INVALID`,
              },
            ]
          : []),
        { title: `Arxivdagi ${label}`, value: data.inactive, tone: 'inactive', href: archive },
      ]
    }

    const isXray = type === 'xray'
    const label = isXray ? 'rentgenlar' : 'qurilmalar'

    return [
      { title: `Reyestrdagi ${label}`, value: data.active, tone: 'total', href: `${base}&status=ACTIVE` },
      // Only the equipment registry offers these two as tabs; sending the xray
      // list to them would land on a filter it cannot show as selected.
      ...(isXray
        ? []
        : [
            { title: 'Muddati amaldagi', value: data.valid, tone: 'active' as Tone, href: `${base}&status=VALID` },
            {
              title: 'Vaqtinchalik nofaol',
              value: data.invalid,
              tone: 'invalid' as Tone,
              href: `${base}&status=INVALID`,
            },
          ]),
      { title: `Muddati o‘tgan ${label}`, value: data.expired, tone: 'expired', href: `${base}&status=EXPIRED` },
      { title: 'Muddati kiritilmaganlar', value: data.noDate, tone: 'noDate', href: `${base}&status=NO_DATE` },
      { title: `Arxivdagi ${label}`, value: data.inactive, tone: 'inactive', href: archive },
    ]
  }

  const cards = buildCards()

  return (
    <StatsSection label={SECTION_LABELS[type]} isLoading={isLoading}>
      {/* Six tiles read best as two rows of three; four belong on one row once
          the screen is wide enough to hold them without squeezing the figure. */}
      <div
        className={cn(
          'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4',
          cards.length >= 6 ? 'lg:grid-cols-3' : cards.length >= 4 ? 'xl:grid-cols-4' : ''
        )}
      >
        {cards.map((card) => (
          <StatCard key={card.title} {...card} isLoading={isLoading} />
        ))}
      </div>
    </StatsSection>
  )
}
