import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { CheckCircle2, XCircle, AlertCircle, FileQuestion, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'

interface StatsCardsProps {
  type: 'hf' | 'equipment' | 'irs' | 'xray'
  data: any
  regionId?: string | null
}

export const StatsCards = ({ type, data, regionId }: StatsCardsProps) => {
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
        {icon}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-3xl font-bold">{value?.toLocaleString() || 0}</span>
        <Link
          to={link}
          className="rounded-md border border-transparent bg-white px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-slate-200 hover:bg-slate-50"
        >
          Ko‘rish
        </Link>
      </div>
    </Card>
  )

  if (type === 'hf' || type === 'irs' || type === 'xray') {
    const typeName =
      type === 'hf' ? 'XICHOlar' : type === 'irs' ? 'INMlar' : type === 'xray' ? 'Rentgenlar' : 'Qurilmalar'

    const getLink = (status: 'total' | 'active' | 'inactive') => {
      let baseUrl = `/register?tab=${type === 'xray' ? 'xrays' : type}`
      if (regionId) {
        baseUrl += `&regionId=${regionId}`
      }

      if (type === 'xray') return baseUrl
      if (type === 'irs') {
        if (status === 'total') return `${baseUrl}&valid=all`
        if (status === 'active') return `${baseUrl}&valid=true`
        if (status === 'inactive') return `${baseUrl}&valid=false`
      } else {
        // HF
        if (status === 'total') return `${baseUrl}&active=ALL`
        if (status === 'active') return `${baseUrl}&active=true`
        if (status === 'inactive') return `${baseUrl}&active=false`
      }
      return baseUrl
    }

    return (
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {renderCard(
          `Barcha ${typeName}`,
          data.total,
          <Layers className="h-6 w-6 opacity-60" />,
          'border-blue-500 text-blue-900',
          'bg-blue-50',
          getLink('total')
        )}
        {renderCard(
          `Amaldagi ${typeName}`,
          data.active,
          <CheckCircle2 className="h-6 w-6 opacity-60" />,
          'border-emerald-500 text-emerald-900',
          'bg-emerald-50',
          getLink('active')
        )}
        {renderCard(
          `Reyestrdan chiqarilgan ${typeName}`,
          data.inactive,
          <XCircle className="h-6 w-6 opacity-60" />,
          'border-slate-400 text-slate-800',
          'bg-slate-50',
          getLink('inactive')
        )}
      </div>
    )
  }

  if (type === 'equipment') {
    let baseUrl = '/register?tab=equipments'
    if (regionId) {
      baseUrl += `&regionId=${regionId}`
    }

    return (
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-5">
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
    )
  }

  return null
}
