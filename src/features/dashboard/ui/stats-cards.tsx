import { ReactNode } from 'react'
import { AlertCircle, CheckCircle2, FileQuestion, Layers, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { StatValue } from './stat-value'

interface StatsCardsProps {
  type: 'hf' | 'equipment' | 'irs' | 'xray'
  data: any
  regionId?: string | null
}

type Tone = 'total' | 'active' | 'inactive' | 'expired' | 'noDate'

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
}

const TONE_ICONS: Record<Tone, ReactNode> = {
  total: <Layers className="size-5" />,
  active: <CheckCircle2 className="size-5" />,
  inactive: <XCircle className="size-5" />,
  expired: <AlertCircle className="size-5" />,
  noDate: <FileQuestion className="size-5" />,
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
    <Card className="relative flex flex-col gap-5 overflow-hidden rounded-xl border border-slate-200 p-5 pl-6 shadow-sm transition-shadow hover:shadow-md">
      <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-1', accent)} />

      <div className="flex items-start justify-between gap-3">
        <span className="text-sm leading-snug font-medium text-slate-600">{title}</span>
        <span aria-hidden="true" className={icon}>
          {TONE_ICONS[tone]}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3">
        <StatValue
          value={value}
          isLoading={isLoading}
          className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums"
          skeletonClassName="h-9 w-20 bg-slate-200"
        />
        <Link
          to={href}
          aria-label={`${title}ni ko‘rish`}
          className="focus-visible:ring-teal shrink-0 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:ring-1 focus-visible:outline-hidden focus-visible:ring-inset"
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

  const buildCards = (): Omit<StatCardProps, 'isLoading'>[] => {
    if (type === 'hf' || type === 'irs') {
      const label = type === 'hf' ? 'XICHOlar' : 'INMlar'
      const statusKey = type === 'hf' ? 'active' : 'valid'
      const allValue = type === 'hf' ? 'ALL' : 'all'
      const base = `/register?tab=${type}${region}`

      return [
        { title: `Barcha ${label}`, value: data.total, tone: 'total', href: `${base}&${statusKey}=${allValue}` },
        { title: `Amaldagi ${label}`, value: data.active, tone: 'active', href: `${base}&${statusKey}=true` },
        {
          title: `Reyestrdan chiqarilgan ${label}`,
          value: data.inactive,
          tone: 'inactive',
          href: `${base}&${statusKey}=false`,
        },
      ]
    }

    const isXray = type === 'xray'
    const label = isXray ? 'rentgenlar' : 'qurilmalar'
    const base = `/register?tab=${isXray ? 'xrays' : 'equipments'}${region}`

    return [
      { title: `Barcha ${label}`, value: data.total, tone: 'total', href: isXray ? `${base}&status=ALL` : base },
      { title: `Reyestrdagi ${label}`, value: data.active, tone: 'active', href: `${base}&status=ACTIVE` },
      {
        title: 'Reyestrdan chiqarilganlar',
        value: data.inactive,
        tone: 'inactive',
        href: `${base}&status=INACTIVE`,
      },
      { title: `Muddati o‘tgan ${label}`, value: data.expired, tone: 'expired', href: `${base}&status=EXPIRED` },
      { title: 'Muddati kiritilmaganlar', value: data.noDate, tone: 'noDate', href: `${base}&status=NO_DATE` },
    ]
  }

  const cards = buildCards()

  return (
    <StatsSection label={SECTION_LABELS[type]} isLoading={isLoading}>
      <div
        className={cn(
          'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
          // Five tiles only get a column each once there is room for them.
          cards.length > 3 && 'xl:grid-cols-5'
        )}
      >
        {cards.map((card) => (
          <StatCard key={card.title} {...card} isLoading={isLoading} />
        ))}
      </div>
    </StatsSection>
  )
}
