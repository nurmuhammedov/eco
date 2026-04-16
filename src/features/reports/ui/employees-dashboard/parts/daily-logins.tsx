import { Card } from '@/shared/components/ui/card'
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { dailyLoginsData } from '../mock-data'
import { Users } from 'lucide-react'

const DailyLogins = () => {
  return (
    <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
        <Users className="h-6 w-6 text-blue-600" />
        <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Kunlik loginlar</h3>
      </div>
      <div className="mb-6 text-sm text-slate-500">Joriy oy uchun (aprel)</div>

      <div className="mb-6 h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyLoginsData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '14px',
              }}
            />
            <Bar dataKey="logins" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-4">
          <span className="mb-1 text-sm text-slate-500">Jami loginlar</span>
          <span className="text-2xl font-black text-slate-900">1,742</span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <span className="mb-1 text-sm text-emerald-600">O‘sish (o‘tgan oydan)</span>
          <span className="text-2xl font-black text-emerald-700">+15%</span>
        </div>
      </div>
    </Card>
  )
}

export default DailyLogins
