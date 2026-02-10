import { Factory, Settings, Ticket, Zap, FileText } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { DOCUMENTS_STATS } from '../model/documents-stats'
import { useState } from 'react'

export const InquiriesStats = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'process' | 'completed'>('all')

  const tabs = [
    { id: 'all', label: 'Jami', count: 124 },
    { id: 'new', label: 'Yangi', count: 12 },
    { id: 'process', label: 'Ko‘rib chiqilmoqda', count: 45 },
    { id: 'closed', label: 'Ko‘rib chiqilgan', count: 67 },
  ]

  // Simplified card for cleaner look
  const renderCleanCard = (title: string, value: number, icon: any, colorText: string, bgColor: string) => (
    <div className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className={cn('rounded-xl p-2.5', bgColor, colorText)}>{icon}</span>
      </div>
      <div>
        <span className="mb-1 block text-2xl font-bold text-slate-900">{value?.toLocaleString()}</span>
        <span className="text-sm font-medium text-slate-500">{title}</span>
      </div>
    </div>
  )

  const inquiries = DOCUMENTS_STATS.inquiries

  // Simulate data filtering based on tab
  const getFilteredData = () => {
    let multiplier = 1
    if (activeTab === 'new') multiplier = 0.15
    if (activeTab === 'process') multiplier = 0.35
    if (activeTab === 'completed') multiplier = 0.5

    return {
      total: Math.round(inquiries.total * multiplier),
      hf: Math.round(inquiries.hf * multiplier),
      equipment: Math.round(inquiries.equipment * multiplier),
      irs: Math.round(inquiries.irs * multiplier),
      xray: Math.round(inquiries.xray * multiplier),
      byRegion: inquiries.byRegion.map((r) => ({
        ...r,
        count: Math.round(r.count * multiplier),
      })),
    }
  }

  const data = getFilteredData()

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Murojaatlar</h2>
          <p className="mt-1 text-sm text-slate-500">Kelib tushgan murojaatlar bo‘yicha umumiy hisobot</p>
        </div>

        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200',
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-semibold',
                  activeTab === tab.id ? 'bg-slate-100 text-slate-900' : 'bg-white text-slate-500'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-5">
        {renderCleanCard('Jami', data.total, <FileText className="h-6 w-6" />, 'text-blue-600', 'bg-blue-50')}
        {renderCleanCard('XICHO', data.hf, <Factory className="h-6 w-6" />, 'text-indigo-600', 'bg-indigo-50')}
        {renderCleanCard(
          'Qurilmalar',
          data.equipment,
          <Settings className="h-6 w-6" />,
          'text-orange-600',
          'bg-orange-50'
        )}
        {renderCleanCard('INM', data.irs, <Ticket className="h-6 w-6" />, 'text-red-600', 'bg-red-50')}
        {renderCleanCard('Rentgenlar', data.xray, <Zap className="h-6 w-6" />, 'text-emerald-600', 'bg-emerald-50')}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Viloyatlar kesimida</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {data.byRegion?.map((region: any, index: number) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{region.name}</span>
                <span className="text-slate-500">
                  {region.count} ta ({region.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${region.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
