import { Card } from '@/shared/components/ui/card'
import { cn } from '@/shared/lib/utils'
import { CheckCircle2, XCircle, AlertCircle, FileQuestion, Layers } from 'lucide-react'

interface StatsCardsProps {
  type: 'hf' | 'equipment' | 'irs' | 'xray'
  data: any
}

export const StatsCards = ({ type, data }: StatsCardsProps) => {
  const renderCard = (title: string, value: number, icon: any, colorClass: string, bgClass: string) => (
    <Card
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden border-l-4 p-5 shadow-sm transition-all hover:shadow-md',
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
        <button className="rounded-md border border-transparent bg-white px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:border-slate-200 hover:bg-slate-50">
          Ko‘rish
        </button>
      </div>
    </Card>
  )

  if (type === 'hf' || type === 'irs' || type === 'xray') {
    const typeName = type === 'hf' ? 'XICHOlar' : type === 'irs' ? 'INMlar' : 'Rentgenlar'

    return (
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {renderCard(
          'Barchasi',
          data.total,
          <Layers className="h-6 w-6 opacity-60" />,
          'border-blue-500 text-blue-900',
          'bg-blue-50'
        )}
        {renderCard(
          `Amaldagi ${typeName}`,
          data.active,
          <CheckCircle2 className="h-6 w-6 opacity-60" />,
          'border-emerald-500 text-emerald-900',
          'bg-emerald-50'
        )}
        {renderCard(
          `Reyestrdan chiqarilgan ${typeName}`,
          data.inactive,
          <XCircle className="h-6 w-6 opacity-60" />,
          'border-slate-400 text-slate-800',
          'bg-slate-50'
        )}
      </div>
    )
  }

  if (type === 'equipment') {
    return (
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        {renderCard(
          'Barchasi',
          data.total,
          <Layers className="h-6 w-6 opacity-60" />,
          'border-blue-500 text-blue-900',
          'bg-blue-50'
        )}
        {renderCard(
          'Reyestrdagi qurilmalar',
          data.active,
          <CheckCircle2 className="h-6 w-6 opacity-60" />,
          'border-emerald-500 text-emerald-900',
          'bg-emerald-50'
        )}
        {renderCard(
          'Reyestrdan chiqarilgan',
          data.inactive,
          <XCircle className="h-6 w-6 opacity-60" />,
          'border-slate-400 text-slate-800',
          'bg-slate-50'
        )}
        {renderCard(
          'Muddati o‘tgan qurilmalar',
          data.expired,
          <AlertCircle className="h-6 w-6 opacity-60" />,
          'border-red-500 text-red-900',
          'bg-red-50'
        )}
        {renderCard(
          'Muddati kiritilmaganlar',
          data.noDate,
          <FileQuestion className="h-6 w-6 opacity-60" />,
          'border-yellow-500 text-yellow-900',
          'bg-yellow-50'
        )}
      </div>
    )
  }

  return null
}
