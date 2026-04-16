import { Card } from '@/shared/components/ui/card'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { topEmployees } from '../mock-data'
import { Trophy } from 'lucide-react'

const TopEmployees = () => {
  return (
    <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
        <Trophy className="h-6 w-6 text-amber-500" />
        <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Top 10 faol xodimlar</h3>
      </div>
      <div className="mb-4 text-sm text-slate-500">Joriy oy uchun</div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topEmployees} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#475569' }}
              width={130}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '14px',
              }}
            />
            <Bar
              dataKey="logins"
              fill="#0ea5e9"
              radius={[0, 6, 6, 0]}
              barSize={16}
              label={{ position: 'right', fill: '#1e293b', fontSize: 13, fontWeight: 'bold' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default TopEmployees
