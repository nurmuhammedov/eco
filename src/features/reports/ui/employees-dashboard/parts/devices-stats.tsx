import { Card } from '@/shared/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { devicesData, browsersData } from '../mock-data'
import { Laptop, Globe } from 'lucide-react'

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null
}

const DevicesStats = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
          <Laptop className="h-6 w-6 text-purple-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Qurilmalar statistikasi</h3>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Pie
                  data={devicesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {devicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-3">
            {devicesData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
          <Globe className="h-6 w-6 text-teal-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Brauzerlar statistikasi</h3>
        </div>

        <div className="flex flex-col items-center">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Pie
                  data={browsersData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  innerRadius={75}
                  dataKey="value"
                  stroke="none"
                >
                  {browsersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 grid w-full grid-cols-2 gap-x-4 gap-y-3">
            {browsersData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DevicesStats
