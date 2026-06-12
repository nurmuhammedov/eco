import { Inbox, FileText, Clock, CheckCircle2, Layers } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface AccidentStatusCardsProps {
  stats: {
    total: number
    new: number
    process: number
    completed: number
    decreeUploaded: number
  }
  activeStatus?: string
  onTabChange: (status: string) => void
  className?: string
}

export const AccidentStatusCards = ({ stats, activeStatus, onTabChange, className }: AccidentStatusCardsProps) => {
  const cards = [
    {
      id: 'ALL',
      name: 'Barchasi',
      count: stats.total,
      icon: Layers,
      activeClass: 'bg-slate-100 border-slate-500 shadow-sm ring-1 ring-slate-500',
      textClass: 'text-slate-900',
      iconClass: 'bg-slate-500 text-white',
      inactiveClass: 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50',
      inactiveIconClass: 'bg-slate-100 text-slate-500 group-hover:bg-slate-500 group-hover:text-white',
    },
    {
      id: 'NEW',
      name: 'Yangi',
      count: stats.new,
      icon: Inbox,
      activeClass: 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500',
      textClass: 'text-blue-700',
      iconClass: 'bg-blue-500 text-white',
      inactiveClass: 'bg-white border-slate-200 hover:border-blue-200 hover:bg-blue-50',
      inactiveIconClass: 'bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white',
    },
    {
      id: 'DECREE_UPLOADED',
      name: 'Hujjat yuklangan',
      count: stats.decreeUploaded,
      icon: FileText,
      activeClass: 'bg-indigo-50 border-indigo-500 shadow-sm ring-1 ring-indigo-500',
      textClass: 'text-indigo-700',
      iconClass: 'bg-indigo-500 text-white',
      inactiveClass: 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-indigo-50',
      inactiveIconClass: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white',
    },
    {
      id: 'IN_PROCESS',
      name: 'Jarayonda',
      count: stats.process,
      icon: Clock,
      activeClass: 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500',
      textClass: 'text-amber-700',
      iconClass: 'bg-amber-500 text-white',
      inactiveClass: 'bg-white border-slate-200 hover:border-amber-200 hover:bg-amber-50',
      inactiveIconClass: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    },
    {
      id: 'COMPLETED',
      name: 'Yakunlangan',
      count: stats.completed,
      icon: CheckCircle2,
      activeClass: 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500',
      textClass: 'text-emerald-700',
      iconClass: 'bg-emerald-500 text-white',
      inactiveClass: 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-emerald-50',
      inactiveIconClass: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white',
    },
  ]

  return (
    <div className={cn('mb-4 grid grid-cols-1 gap-4 px-1 sm:grid-cols-2 lg:grid-cols-5', className)}>
      {cards.map((stat) => {
        const isActive = (activeStatus || 'ALL') === stat.id

        return (
          <div
            key={stat.id}
            onClick={() => onTabChange(stat.id)}
            className={cn(
              'group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border p-5 transition-all duration-300',
              isActive ? stat.activeClass : stat.inactiveClass
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500">{stat.name}</span>
              <span
                className={cn('text-2xl font-bold transition-colors', isActive ? stat.textClass : 'text-slate-900')}
              >
                {stat.count}
              </span>
            </div>

            <div className={cn('rounded-lg p-3 transition-colors', isActive ? stat.iconClass : stat.inactiveIconClass)}>
              <stat.icon size={24} className="current-color" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
