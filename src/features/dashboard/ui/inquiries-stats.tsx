import { Factory, Settings, Ticket, Zap, FileText } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { DOCUMENTS_STATS } from '../model/documents-stats'

export const InquiriesStats = () => {
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

  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100">
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Murojaatlar</h2>
        <p className="mt-1 text-sm text-slate-500">Kelib tushgan murojaatlar bo‘yicha umumiy hisobot</p>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-5">
        {renderCleanCard('Jami', inquiries.total, <FileText className="h-6 w-6" />, 'text-blue-600', 'bg-blue-50')}
        {renderCleanCard('XICHO', inquiries.hf, <Factory className="h-6 w-6" />, 'text-indigo-600', 'bg-indigo-50')}
        {renderCleanCard(
          'Qurilmalar',
          inquiries.equipment,
          <Settings className="h-6 w-6" />,
          'text-orange-600',
          'bg-orange-50'
        )}
        {renderCleanCard('INM', inquiries.irs, <Ticket className="h-6 w-6" />, 'text-red-600', 'bg-red-50')}
        {renderCleanCard(
          'Rentgenlar',
          inquiries.xray,
          <Zap className="h-6 w-6" />,
          'text-emerald-600',
          'bg-emerald-50'
        )}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Viloyatlar kesimida</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {(inquiries as any).byRegion?.map((region: any, index: number) => (
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
