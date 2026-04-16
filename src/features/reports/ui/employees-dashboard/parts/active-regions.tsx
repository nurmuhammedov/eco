import { Card } from '@/shared/components/ui/card'
import { regionalActivityData } from '../mock-data'
import { BarChart3, TrendingDown } from 'lucide-react'

const ActiveRegions = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Eng faol hududlar */}
      <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#1E293B]">
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Eng faol hududlar</h3>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {regionalActivityData.map((reg, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-5 font-medium text-slate-400">0{i + 1}</span>
                  <span className="font-semibold text-slate-700">{reg.region}</span>
                </div>
                <span className="font-bold text-slate-900">{reg.active} ta</span>
              </div>
              <div
                className="ml-8 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
                style={{ width: 'calc(100% - 2rem)' }}
              >
                <div
                  className={`h-full rounded-full ${i < 3 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${reg.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Eng sust hududlar */}
      <Card className="flex flex-col rounded-xl border-l-4 border-none border-l-orange-400 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
          <TrendingDown className="h-6 w-6 text-orange-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Eng sust hududlar</h3>
        </div>

        <div className="flex flex-col gap-5">
          {[...regionalActivityData]
            .reverse()
            .slice(0, 3)
            .map((reg, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-medium text-orange-400">0{i + 1}</span>
                    <span className="font-semibold text-slate-700">{reg.region}</span>
                  </div>
                  <span className="font-bold text-slate-900">{reg.active} ta</span>
                </div>
                <div
                  className="ml-8 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
                  style={{ width: 'calc(100% - 2rem)' }}
                >
                  <div className="h-full rounded-full bg-orange-400" style={{ width: `${reg.percent}%` }}></div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )
}

export default ActiveRegions
