import { GoBack } from '@/shared/components/common'
import DailyLogins from './parts/daily-logins'
import TopEmployees from './parts/top-employees'
import WorkTimeHeatmap from './parts/work-time-heatmap'
import DevicesStats from './parts/devices-stats'
import ActiveRegions from './parts/active-regions'
import OtherStats from './parts/other-stats'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useState } from 'react'

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 2025 + 1 }, (_, i) => (2025 + i).toString())
const MONTHS = [
  { id: '01', name: 'Yanvar' },
  { id: '02', name: 'Fevral' },
  { id: '03', name: 'Mart' },
  { id: '04', name: 'Aprel' },
  { id: '05', name: 'May' },
  { id: '06', name: 'Iyun' },
  { id: '07', name: 'Iyul' },
  { id: '08', name: 'Avgust' },
  { id: '09', name: 'Sentabr' },
  { id: '10', name: 'Oktabr' },
  { id: '11', name: 'Noyabr' },
  { id: '12', name: 'Dekabr' },
]

const EmployeesDashboard = () => {
  const [year, setYear] = useState('2026')
  const [month, setMonth] = useState('04')

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 pb-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <GoBack title="Xodimlar faolligi doir umumiy boshqaruv paneli" />
        </div>

        <div className="flex items-center gap-3">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-28 border-slate-200 bg-white">
              <SelectValue placeholder="Yil" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40 border-slate-200 bg-white">
              <SelectValue placeholder="Oy" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-1 xl:col-span-4">
          <ActiveRegions />
          <DevicesStats />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1 xl:col-span-5">
          <DailyLogins />
          <TopEmployees />
          <WorkTimeHeatmap />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2 xl:col-span-3">
          <OtherStats />
        </div>
      </div>
      <div className="h-4 w-full shrink-0" />
    </div>
  )
}

export default EmployeesDashboard
