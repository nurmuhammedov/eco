import { ReactNode } from 'react'
import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { CheckCircle2, XCircle, AlertCircle, FileQuestion, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StatsCardsProps {
  type: 'hf' | 'equipment' | 'irs' | 'xray'
  data: any
  regionId?: string | null
}

/** Hoisted: a component declared inside the body remounts the whole grid on every render. */
const StatsSection = ({ label, isLoading, children }: { label: string; isLoading: boolean; children: ReactNode }) => (
  <section aria-busy={isLoading} className="mb-4">
    {/* One live region for the whole grid; per-card ones would announce five times. */}
    <h2 className="sr-only">{label}</h2>
    {children}
  </section>
)

const SECTION_LABELS: Record<StatsCardsProps['type'], string> = {
  hf: 'Xavfli ishlab chiqarish obyektlari bo‘yicha statistika',
  equipment: 'Texnik qurilmalar bo‘yicha statistika',
  irs: 'Ionlashtiruvchi nurlanish manbalari bo‘yicha statistika',
  xray: 'Rentgen qurilmalari bo‘yicha statistika',
}

export const StatsCards = ({ type, data, regionId }: StatsCardsProps) => {
  const isLoading = Boolean(data?.isLoading)

  const renderCard = (title: string, value: number, icon: any, colorClass: string, bgClass: string, link: string) => (
    <Card
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-xl border border-l-4 border-slate-200 p-5 shadow-sm transition-all hover:shadow-md',
        bgClass,
        colorClass
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-base font-medium opacity-90">{title}</span>
        <span aria-hidden="true">{icon}</span>
      </div>
      <div className="mt-2 flex items-end justify-between">
        {isLoading ? (
          <Skeleton className="my-1 h-7 w-24 bg-current/10" />
        ) : (
          <span className="text-3xl font-bold">{value?.toLocaleString() || 0}</span>
        )}
        <Link
          to={link}
          aria-label={`${title}ni ko‘rish`}
          className="rounded-md border border-transparent bg-white px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-slate-200 hover:bg-slate-50"
        >
          Ko‘rish
        </Link>
      </div>
    </Card>
  )

  if (type === 'hf' || type === 'irs') {
    const typeName = type === 'hf' ? 'XICHOlar' : 'INMlar'
    const statusKey = type === 'hf' ? 'active' : 'valid'
    const baseUrl = `/register?tab=${type}${regionId ? `&regionId=${regionId}` : ''}`

    return (
      <StatsSection label={SECTION_LABELS[type]} isLoading={isLoading}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {renderCard(
            `Barcha ${typeName}`,
            data.total,
            <Layers className="h-6 w-6 opacity-60" />,
            'border-blue-500 text-blue-900',
            'bg-blue-50',
            `${baseUrl}&${statusKey}=${type === 'hf' ? 'ALL' : 'all'}`
          )}
          {renderCard(
            `Amaldagi ${typeName}`,
            data.active,
            <CheckCircle2 className="h-6 w-6 opacity-60" />,
            'border-emerald-500 text-emerald-900',
            'bg-emerald-50',
            `${baseUrl}&${statusKey}=true`
          )}
          {renderCard(
            `Reyestrdan chiqarilgan ${typeName}`,
            data.inactive,
            <XCircle className="h-6 w-6 opacity-60" />,
            'border-slate-400 text-slate-800',
            'bg-slate-50',
            `${baseUrl}&${statusKey}=false`
          )}
        </div>
      </StatsSection>
    )
  }

  if (type === 'xray') {
    let baseUrl = '/register?tab=xrays'
    if (regionId) {
      baseUrl += `&regionId=${regionId}`
    }

    return (
      <StatsSection label={SECTION_LABELS[type]} isLoading={isLoading}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {renderCard(
            'Barcha rentgenlar',
            data.total,
            <Layers className="h-6 w-6 opacity-60" />,
            'border-blue-500 text-blue-900',
            'bg-blue-50',
            `${baseUrl}&status=ALL`
          )}
          {renderCard(
            'Reyestrdagi rentgenlar',
            data.active,
            <CheckCircle2 className="h-6 w-6 opacity-60" />,
            'border-emerald-500 text-emerald-900',
            'bg-emerald-50',
            `${baseUrl}&status=ACTIVE`
          )}
          {renderCard(
            'Reyestrdan chiqarilganlar',
            data.inactive,
            <XCircle className="h-6 w-6 opacity-60" />,
            'border-slate-400 text-slate-800',
            'bg-slate-50',
            `${baseUrl}&status=INACTIVE`
          )}
          {renderCard(
            'Muddati o‘tgan rentgenlar',
            data.expired,
            <AlertCircle className="h-6 w-6 opacity-60" />,
            'border-red-500 text-red-900',
            'bg-red-50',
            `${baseUrl}&status=EXPIRED`
          )}
          {renderCard(
            'Muddati kiritilmaganlar',
            data.noDate,
            <FileQuestion className="h-6 w-6 opacity-60" />,
            'border-yellow-500 text-yellow-900',
            'bg-yellow-50',
            `${baseUrl}&status=NO_DATE`
          )}
        </div>
      </StatsSection>
    )
  }

  if (type === 'equipment') {
    let baseUrl = '/register?tab=equipments'
    if (regionId) {
      baseUrl += `&regionId=${regionId}`
    }

    return (
      <StatsSection label={SECTION_LABELS[type]} isLoading={isLoading}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {renderCard(
            'Barcha qurilmalar',
            data.total,
            <Layers className="h-6 w-6 opacity-60" />,
            'border-blue-500 text-blue-900',
            'bg-blue-50',
            baseUrl
          )}
          {renderCard(
            'Reyestrdagi qurilmalar',
            data.active,
            <CheckCircle2 className="h-6 w-6 opacity-60" />,
            'border-emerald-500 text-emerald-900',
            'bg-emerald-50',
            `${baseUrl}&status=ACTIVE`
          )}
          {renderCard(
            'Reyestrdan chiqarilgan',
            data.inactive,
            <XCircle className="h-6 w-6 opacity-60" />,
            'border-slate-400 text-slate-800',
            'bg-slate-50',
            `${baseUrl}&status=INACTIVE`
          )}
          {renderCard(
            'Muddati o‘tgan qurilmalar',
            data.expired,
            <AlertCircle className="h-6 w-6 opacity-60" />,
            'border-red-500 text-red-900',
            'bg-red-50',
            `${baseUrl}&status=EXPIRED`
          )}
          {renderCard(
            'Muddati kiritilmaganlar',
            data.noDate,
            <FileQuestion className="h-6 w-6 opacity-60" />,
            'border-yellow-500 text-yellow-900',
            'bg-yellow-50',
            `${baseUrl}&status=NO_DATE`
          )}
        </div>
      </StatsSection>
    )
  }

  return null
}
