import { FileText, Search, BarChart2, ShieldCheck, ClipboardCheck } from 'lucide-react'

export const ActionCenter = () => {
  const actions = [
    { label: 'Arizalarni ko‘rish', icon: FileText },
    { label: 'Reyestrdan qidirish', icon: Search },
    { label: 'Profilaktika', icon: ShieldCheck },
    { label: 'Tekshiruv o‘tkazish', icon: ClipboardCheck },
    { label: 'Hisobotlar', icon: BarChart2 },
  ]

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-slate-800">Tezkor amallar</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="group flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border border-transparent bg-slate-50 p-4 text-slate-700 transition-all duration-200 hover:border-[#0B626B]/20 hover:bg-[#0B626B]/5 hover:shadow-md"
          >
            <div className="rounded-full bg-white p-3 text-slate-600 shadow-sm transition-all duration-200 group-hover:scale-110 group-hover:text-[#0B626B]">
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-center text-sm font-medium transition-colors group-hover:text-[#0B626B]">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
