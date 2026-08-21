import { AlertTriangle, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAccidentsStats } from '../model/use-accidents-stats'
import { StatValue } from './stat-value'

interface ActionCenterProps {
  regionId?: string | null
}

export const ActionCenter = ({ regionId }: ActionCenterProps) => {
  const { injury, nonInjury, isLoading } = useAccidentsStats(regionId)

  const statsActions = [
    {
      label: 'Baxtsiz hodisalar',
      icon: Activity,
      path: '/accidents?type=INJURY',
      color: 'text-amber-600',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-50',
      hoverBorder: 'hover:border-amber-200',
      stats: injury,
    },
    {
      label: 'Avariyalar',
      icon: AlertTriangle,
      path: '/accidents?type=NON_INJURY',
      color: 'text-red-600',
      borderColor: 'border-red-500',
      bgColor: 'bg-red-50',
      hoverBorder: 'hover:border-red-200',
      stats: nonInjury,
    },
  ]

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {statsActions.map((action, idx) => (
          <div
            key={idx}
            className={`flex flex-col rounded-xl border border-l-4 border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 ${action.borderColor} ${action.hoverBorder} hover:shadow-md`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl ${action.bgColor} p-2.5 ${action.color}`}>
                  <action.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{action.label}</h2>
              </div>
              <Link
                to={action.path}
                aria-label={`${action.label} — barchasini ko‘rish`}
                className="text-teal text-sm font-medium underline-offset-4 hover:underline"
              >
                Barchasini ko‘rish
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-3">
                <StatValue
                  value={action.stats.new}
                  isLoading={isLoading}
                  className="text-2xl font-bold text-slate-900"
                  skeletonClassName="h-8 w-10"
                />
                <span className="text-center text-xs font-medium text-slate-500">Yangi</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-3">
                <StatValue
                  value={action.stats.decreeUploaded}
                  isLoading={isLoading}
                  className="text-2xl font-bold text-blue-600"
                  skeletonClassName="h-8 w-10"
                />
                <span className="text-center text-xs font-medium text-slate-500">Hujjat yuklangan</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-3">
                <StatValue
                  value={action.stats.process}
                  isLoading={isLoading}
                  className="text-2xl font-bold text-amber-600"
                  skeletonClassName="h-8 w-10"
                />
                <span className="text-center text-xs font-medium text-slate-500">Jarayonda</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-3">
                <StatValue
                  value={action.stats.completed}
                  isLoading={isLoading}
                  className="text-2xl font-bold text-emerald-600"
                  skeletonClassName="h-8 w-10"
                />
                <span className="text-center text-xs font-medium text-slate-500">Yakunlangan</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm font-medium text-slate-500">Umumiy soni</span>
              <StatValue
                value={action.stats.total}
                isLoading={isLoading}
                className="text-lg font-bold text-slate-900"
                skeletonClassName="h-6 w-10"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
