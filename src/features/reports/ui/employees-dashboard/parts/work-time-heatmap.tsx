import { Card } from '@/shared/components/ui/card'
import { heatmapData } from '../mock-data'
import { MapPin } from 'lucide-react'

const hours = ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '22:00']

// 0: none, 1: light, 2: medium, 3: heavy, 4: max
const getColor = (level: number) => {
  switch (level) {
    case 1:
      return 'bg-blue-200'
    case 2:
      return 'bg-blue-400'
    case 3:
      return 'bg-blue-600'
    case 4:
      return 'bg-blue-800'
    default:
      return 'bg-slate-100'
  }
}

const WorkTimeHeatmap = () => {
  return (
    <Card className="col-span-1 flex flex-col rounded-xl border-none bg-white p-6 shadow-sm md:col-span-2">
      <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
        <MapPin className="h-6 w-6 text-indigo-600" />
        <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Ish vaqti tahlili</h3>
      </div>
      <div className="mb-6 text-sm text-slate-500">Xodimlar faollik darajasi (soatlar bo‘yicha)</div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="mb-4 flex">
            <div className="w-24"></div>
            {hours.map((h, i) => (
              <div key={i} className="flex-1 text-center text-xs font-bold text-slate-500 uppercase">
                {h}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {heatmapData.map((row, i) => (
              <div key={i} className="flex items-center">
                <div className="w-24 truncate pr-4 text-sm font-semibold text-slate-700">{row.name}</div>
                <div className="flex flex-1 gap-1.5">
                  {row.hours.map((level, j) => (
                    <div
                      key={j}
                      className={`h-8 flex-1 rounded-md ${getColor(level)} cursor-pointer border border-slate-200/20 transition-all duration-200 hover:scale-[1.02]`}
                      title={`${row.name} - ${hours[j]}: faollik darajasi ${level}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 text-xs font-medium text-slate-500">
        <span>Kam faol</span>
        <div className="h-4 w-4 rounded border border-slate-200 bg-slate-100"></div>
        <div className="h-4 w-4 rounded border border-blue-300 bg-blue-200"></div>
        <div className="h-4 w-4 rounded border border-blue-500 bg-blue-400"></div>
        <div className="h-4 w-4 rounded border border-blue-700 bg-blue-600"></div>
        <div className="h-4 w-4 rounded border border-blue-900 bg-blue-800"></div>
        <span>Juda faol</span>
      </div>
    </Card>
  )
}

export default WorkTimeHeatmap
