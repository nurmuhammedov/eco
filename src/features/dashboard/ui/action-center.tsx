// import { FileText, Search, BarChart2, ShieldCheck, ClipboardCheck, AlertTriangle, Activity } from 'lucide-react'
import { AlertTriangle, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAccidentsStats } from '../model/use-accidents-stats'

interface ActionCenterProps {
  regionId?: string | null
}

export const ActionCenter = ({ regionId }: ActionCenterProps) => {
  const { injury, nonInjury } = useAccidentsStats(regionId)

  // const actions = [
  //   { label: 'Arizalarni ko‘rish', icon: FileText, path: '/applications' },
  //   { label: 'Reyestrdan qidirish', icon: Search, path: '/register' },
  //   { label: 'Profilaktika', icon: ShieldCheck, path: '/preventions' },
  //   { label: 'Tekshiruv o‘tkazish', icon: ClipboardCheck, path: '/inspections' },
  //   { label: 'Hisobotlar', icon: BarChart2, path: '/reports' },
  // ]

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
      {/* Tezkor amallar bo'limi vaqtincha yashirildi */}
      {/* <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-slate-800">Tezkor amallar</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {actions.map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className="group flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border border-transparent bg-slate-50 p-4 text-slate-700 transition-all duration-200 hover:border-[#0B626B]/20 hover:bg-[#0B626B]/5 hover:shadow-md"
            >
              <div className="rounded-full bg-white p-3 text-slate-600 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:text-[#0B626B]">
                <action.icon className="h-6 w-6" />
              </div>
              <span className="text-center text-sm font-medium transition-colors group-hover:text-[#0B626B]">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div> */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {statsActions.map((action, idx) => (
          <div
            key={idx}
            className={`flex flex-col rounded-xl border border-l-4 border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ${action.borderColor} ${action.hoverBorder} hover:shadow-md`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl ${action.bgColor} p-2.5 ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">{action.label}</h3>
              </div>
              <Link to={action.path} className="text-sm font-medium text-[#0B626B] underline-offset-4 hover:underline">
                Barchasini ko‘rish
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 p-3">
                <span className="text-2xl font-bold text-slate-900">{action.stats.new}</span>
                <span className="text-xs font-medium text-slate-500">Yangi</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-amber-50/50 p-3">
                <span className="text-2xl font-bold text-amber-600">{action.stats.process}</span>
                <span className="text-xs font-medium text-slate-500">Jarayonda</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-emerald-50/50 p-3">
                <span className="text-2xl font-bold text-emerald-600">{action.stats.completed}</span>
                <span className="text-xs font-medium text-slate-500">Yakunlangan</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-sm font-medium text-slate-500">Umumiy soni</span>
              <span className="text-lg font-bold text-slate-900">{action.stats.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
