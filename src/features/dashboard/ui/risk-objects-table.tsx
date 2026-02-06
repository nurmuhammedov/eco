import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RiskObjectsTableProps {
  data: any[]
}

export const RiskObjectsTable = ({ data }: RiskObjectsTableProps) => {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Muddati o‘tayotgan eng xavfli obyektlar</h3>
        <div className="flex space-x-1">
          <button className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="rounded p-1 text-slate-600 hover:bg-slate-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50/50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">T/R</th>
              <th className="px-4 py-3 font-medium">Ro‘yxatga olish raqami</th>
              <th className="px-4 py-3 font-medium">Qurilma turi</th>
              <th className="px-4 py-3 font-medium">Muddati tugaydi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item.id} className="border-b transition-colors last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{idx + 1}</td>
                <td className="px-4 py-3 font-mono text-slate-700">{item.regNumber}</td>
                <td className="px-4 py-3 text-slate-700">{item.type}</td>
                <td className="px-4 py-3 text-slate-700">{item.expireDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center">
        <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 rounded-full bg-slate-400"></div>
        </div>
      </div>
    </div>
  )
}
