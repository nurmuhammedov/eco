import { Card } from '@/shared/components/ui/card'
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts'
import { leastActiveEmployees, inactiveEmployees, activityPeakData, securityLogs } from '../mock-data'
import { AlertTriangle, Activity, UserMinus, ShieldAlert } from 'lucide-react'

const OtherStats = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Kam faol xodimlar */}
      <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Kam faol xodimlar</h3>
        </div>
        <div className="flex flex-col gap-5">
          {leastActiveEmployees.map((emp, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-medium text-slate-700">
                <span>{emp.name}</span>
                <span className="font-bold text-slate-900">
                  {emp.sessions} / {emp.totalSessions} sessiya
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${(emp.sessions / emp.totalSessions) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Aktivlik */}
      <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
          <Activity className="h-6 w-6 text-blue-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Aktivlik</h3>
        </div>
        <div className="mb-4 text-sm text-slate-500">Kunlik o‘rtacha (foydalanuvchilar soni)</div>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityPeakData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <Tooltip
                cursor={{ stroke: '#94a3b8', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '14px',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1d4ed8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Ushbu haftada kirmaganlar */}
      <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
          <UserMinus className="h-6 w-6 text-slate-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Ushbu haftada kirmaganlar</h3>
        </div>
        <div className="flex flex-col divide-y divide-slate-100">
          {inactiveEmployees.map((emp, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <span className="text-sm font-bold text-slate-800">{emp.name}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 uppercase">
                {emp.position}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Xavfsizlik kuzatuvlari */}
      <Card className="flex flex-col rounded-xl border-none bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3 text-[#1E293B]">
          <ShieldAlert className="h-6 w-6 text-orange-600" />
          <h3 className="text-base font-bold tracking-tight text-slate-800 uppercase">Xavfsizlik kuzatuvlari</h3>
        </div>
        <div className="flex flex-col gap-4">
          {securityLogs.map((log, i) => (
            <div
              key={i}
              className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-orange-50/50"
            >
              <div className="mt-1 shrink-0">
                {log.type === 'alert' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                {log.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
                {log.type === 'info' && <ShieldAlert className="h-5 w-5 text-blue-600" />}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-bold text-slate-900">{log.name}</span>
                <span className="mt-1 text-xs font-medium break-words text-slate-600">
                  {log.ip || log.device} – {log.reason}
                </span>
                <span className="mt-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  {log.time} {log.location && `| ${log.location}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default OtherStats
