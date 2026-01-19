import React, { Fragment } from 'react'
import {
  Activity,
  AlertTriangle,
  BarChart,
  ClipboardCheck,
  Clock,
  Database,
  FileSearch,
  FileText,
  Map,
  PieChart,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Link } from 'react-router-dom'
import { ApplicationTypeEnum } from '@/entities/create-application/types/enums'

interface ReportItem {
  id: string
  title: string
  icon?: React.ElementType
  url: string
}

interface ReportGroup {
  id: string
  title: string
  items: ReportItem[]
}

const REPORTS_GROUPS: ReportGroup[] = [
  {
    id: 'applications',
    title: 'Arizalar',
    items: [
      {
        id: 'rep-1',
        title: 'Arizalarning hududlar kesimida taqsimlanishi',
        icon: FileText,
        url: `/reports/${ApplicationTypeEnum.REPORT_1}`,
      },
      {
        id: 'rep-2',
        title: 'Arizalar turlari bo‘yicha taqsimlanish',
        icon: PieChart,
        url: `/reports/${ApplicationTypeEnum.REPORT_2}`,
      },
    ],
  },
  {
    id: 'registers',
    title: 'Reyestrlar',
    items: [
      {
        id: 'rep-3',
        title: 'Ro‘yxatga olingan/chiqarilgan obyektlar',
        icon: Database,
        url: `/reports/${ApplicationTypeEnum.REPORT_3}`,
      },
      {
        id: 'rep-4',
        title: 'Davlat ro‘yxatidagi amaldagi obyektlar',
        icon: Activity,
        url: `/reports/${ApplicationTypeEnum.REPORT_4}`,
      },
    ],
  },
  {
    id: 'prevention',
    title: 'Profilaktika',
    items: [
      { id: 'prev-stats', title: 'Profilaktika ishlari statistikasi', icon: ShieldCheck, url: '#' },
      { id: 'prev-inspector-load', title: 'Profilaktika hududlar kesimida', icon: Map, url: '#' },
      {
        id: 'prev-fix-rate',
        title: 'Profilaktik tadbirga inspektorlar biriktirilishi boyicha hisobot',
        icon: UserCheck,
        url: '#',
      },
    ],
  },
  {
    id: 'risk-analysis',
    title: 'Xavfni tahlil qilish',
    items: [
      { id: 'risk-objects', title: "Xavf darajasi bo'yicha obyektlar", icon: AlertTriangle, url: '#' },
      { id: 'risk-trends', title: "Xavf ko'rsatkichlari dinamikasi", icon: TrendingUp, url: '#' },
    ],
  },
  {
    id: 'inspections',
    title: 'Tekshiruvlar',
    items: [
      { id: 'insp-results', title: 'Tekshiruvlar natijalari', icon: ClipboardCheck, url: '#' },
      { id: 'insp-types', title: 'Rejali va rejadan tashqari', icon: FileSearch, url: '#' },
      { id: 'insp-rejected', title: '1 kunlik va 10 kunlik tekshiruvlar', icon: Clock, url: '#' },
    ],
  },
  {
    id: 'inquiries',
    title: 'Murojaatlar',
    items: [
      { id: 'inq-content', title: 'Murojaatlar dinamikasi', icon: TrendingUp, url: '#' },
      { id: 'inq-execution', title: 'Murojaatlar oylar kesimida', icon: BarChart, url: '#' },
      { id: 'inq-regional', title: 'Hududiy murojaatlar', icon: Map, url: '#' },
    ],
  },
]

export const ReportsGrid: React.FC = () => {
  return (
    <Fragment>
      <div className="mb-6 flex items-center justify-between">
        <h5 className="text-2xl font-semibold text-gray-800">
          Hisobotlar <span className="text-red-400">(ushbu sahifa ishlab chiqish jarayonida)</span>
        </h5>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS_GROUPS.map((group) => (
          <div key={group.id} className="flex flex-col gap-2">
            <h6 className="px-1 text-lg font-semibold text-gray-700">{group.title}</h6>
            <Card className="overflow-hidden border-none shadow-sm">
              <div className="flex flex-col">
                {group.items.map((item) => {
                  const Icon = item.icon || FileText
                  return (
                    <Link
                      key={item.id}
                      to={item.url}
                      className="group flex items-center gap-3 border-b border-gray-100 p-3 transition-colors last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="rounded-md bg-gray-50 p-2 text-gray-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </Fragment>
  )
}

ReportsGrid.displayName = 'ReportsGrid'

export default React.memo(ReportsGrid)
