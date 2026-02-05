import { CheckCircle2, FileClock, Inbox, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react'

interface DailyTasksProps {
  data: any[]
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'check-circle':
      return <CheckCircle2 className="h-5 w-5 text-slate-500" />
    case 'file-clock':
      return <FileClock className="h-5 w-5 text-slate-500" />
    case 'inbox':
      return <Inbox className="h-5 w-5 text-slate-500" />
    case 'alert-circle':
      return <AlertCircle className="h-5 w-5 text-slate-500" />
    default:
      return <CheckCircle2 className="h-5 w-5 text-slate-500" />
  }
}

export const DailyTasks = ({ data }: DailyTasksProps) => {
  return (
    <div className="flex h-full flex-col rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Bugun nima qilish kerak?</h3>
      </div>

      <div className="flex-1 space-y-0">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="group -mx-2 flex cursor-pointer items-center justify-between rounded border-b border-slate-100 px-2 py-4 transition-colors last:border-0 hover:bg-slate-50"
          >
            <div className="flex items-center space-x-4">
              {getIcon(item.icon)}
              <span className="text-sm leading-tight font-medium text-slate-700">{item.label}</span>
            </div>
            <span className="text-xl font-bold text-slate-800">{item.count}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <button className="rounded bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
          Barchasi
        </button>
        <div className="flex space-x-1">
          <button className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="rounded p-1 text-slate-600 hover:bg-slate-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
