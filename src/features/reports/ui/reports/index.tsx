import React, { Fragment, useMemo } from 'react'
import {
  AlertTriangle,
  Siren,
  Flame,
  BarChart,
  Clock,
  FileSearch,
  FileText,
  Map,
  Users,
  Box,
  PlusSquare,
  CalendarClock,
  Zap,
  ClipboardCheck,
  Target,
  // Trash2,
  LineChart,
  PieChart,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Link } from 'react-router-dom'
import { useCurrentRole } from '@/shared/hooks/use-current-role'
import { UserRoles } from '@/entities/user'

interface ReportItem {
  id: string
  title: string
  icon?: React.ElementType
  url: string
  badge?: string
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
        icon: Map,
        url: '/reports/applications-regions',
      },
      {
        id: 'rep-2',
        title: 'Arizalar turlari bo‘yicha taqsimlanishi',
        icon: PieChart,
        url: '/reports/applications-types',
      },
      {
        id: 'rep-appeal-execution',
        title: 'Arizalarning ijro muddati bo‘yicha umumiy hisobot',
        icon: Clock,
        url: '/reports/appeal-execution',
        badge: 'Yangi',
      },
      {
        id: 'rep-appeal-status-duration',
        title: 'Arizalar holati va muddati bo‘yicha hisobot',
        icon: Clock,
        url: '/reports/appeal-status-duration',
        badge: 'Yangi',
      },
    ],
  },
  {
    id: 'registers',
    title: 'Reyestrlar',
    items: [
      {
        id: 'rep-3',
        title: 'Davlat ro‘yxatiga olingan/chiqarilgan obyektlar',
        icon: Box,
        url: '/reports/registers-objects',
      },
      {
        id: 'rep-4',
        title: 'Davlat ro‘yxatidagi yangi qo‘shilgan va amaldagi obyektlar',
        icon: PlusSquare,
        url: '/reports/registers-new-objects',
      },
      {
        id: 'rep-5',
        title: 'Qurilmalarning muddatlari bo‘yicha hisobot',
        icon: CalendarClock,
        url: '/reports/registers-equipment-terms',
      },
      {
        id: 'rep-8',
        title: 'Reyestr maʼlumotlarini o‘zgartirish so‘rovlari bo‘yicha hisobot',
        icon: Zap,
        url: '/reports/changes',
      },
      {
        id: 'rep-9',
        title: 'Inspektorlar tomonidan reyestrdan chiqarish so‘rovlari bo‘yicha hisobot',
        icon: ClipboardCheck,
        url: '/reports/registers-deregister',
      },
      // {
      //   id: 'rep-11',
      //   title: 'Hududiy boshqarma tomonidan reyestrga kiritish bo‘yicha hisobot',
      //   icon: ClipboardCheck,
      //   url: '/reports/registers-register',
      // },
      {
        id: 'rep-hf-employee-stats',
        title: 'XICHOlarda ishchi xodimlari bo‘yicha statistika',
        icon: Users,
        url: '/reports/hf-employee-stats',
        badge: 'Yangi',
      },
    ],
  },
  {
    id: 'accidents-and-incidents',
    title: 'Baxtsiz hodisalar va avariyalar',
    items: [
      {
        id: 'rep-6',
        title: 'Baxtsiz hodisalar bo‘yicha umumiy hisobot',
        icon: Siren,
        // url: '/reports/accidents',
        // badge: 'Yangi',
        url: '#',
        badge: 'Jarayonda',
      },
      {
        id: 'rep-7',
        title: 'Avariyalar bo‘yicha umumiy hisobot',
        icon: Flame,
        // url: '/reports/incidents',
        // badge: 'Yangi',
        url: '#',
        badge: 'Jarayonda',
      },
    ],
  },
  {
    id: 'prevention',
    title: 'Profilaktika',
    items: [
      {
        id: 'prev-stats',
        title: 'Profilaktika ishlari statistikasi',
        icon: ShieldCheck,
        url: '/reports/prevention-stats',
      },
      { id: 'prev-inspector-load', title: 'Profilaktika hududlar kesimida', icon: Map, url: '#', badge: 'Jarayonda' },
    ],
  },
  {
    id: 'risk-analysis',
    title: 'Xavfni tahlil qilish',
    items: [
      {
        id: 'risk-date-comparison',
        title: 'Xavf tahlili natijasi bo‘yicha muddatlar o‘rtasida solishtirish hisoboti',
        icon: LineChart,
        url: '/reports/risk-date-comparison',
        badge: 'Yangi',
      },
      {
        id: 'risk-objects',
        title: 'Xavf darajasi bo‘yicha obyektlar',
        icon: AlertTriangle,
        url: '#',
        badge: 'Jarayonda',
      },
      { id: 'risk-trends', title: 'Xavf ko‘rsatkichlari dinamikasi', icon: Target, url: '#', badge: 'Jarayonda' },
    ],
  },
  {
    id: 'inspections',
    title: 'Tekshiruvlar',
    items: [
      {
        id: 'insp-stats',
        title: 'Tekshiruv holati bo‘yicha',
        icon: FileSearch,
        url: '/reports/inspection-stats',
        badge: 'Yangi',
      },
      { id: 'insp-types', title: 'Rejali va rejadan tashqari', icon: FileSearch, url: '#', badge: 'Jarayonda' },
      { id: 'insp-rejected', title: '1 kunlik va 10 kunlik tekshiruvlar', icon: Clock, url: '#', badge: 'Jarayonda' },
    ],
  },
  {
    id: 'inquiries',
    title: 'Murojaatlar',
    items: [
      { id: 'inq-content', title: 'Murojaatlar dinamikasi', icon: TrendingUp, url: '#', badge: 'Jarayonda' },
      { id: 'inq-execution', title: 'Murojaatlar oylar kesimida', icon: BarChart, url: '#', badge: 'Jarayonda' },
      { id: 'inq-regional', title: 'Hududiy murojaatlar', icon: Map, url: '#', badge: 'Jarayonda' },
    ],
  },
  {
    id: 'employees',
    title: 'Xodimlar',
    items: [
      {
        id: 'emp-activity-dashboard',
        title: 'Xodimlar faolligi doir umumiy boshqaruv paneli',
        icon: BarChart,
        url: '/reports/employees-dashboard',
        badge: 'Yangi',
      },
      {
        id: 'emp-turniket',
        title: 'Xodimlarning ishga vaqtida kelishi bo‘yicha hisobot',
        icon: Users,
        url: '/reports/turniket-logs',
        badge: 'Yangi',
      },
      {
        id: 'emp-device-login',
        title: 'Xodimlar qaysi qurilmadan kirayotgani bo‘yicha hisobot',
        icon: FileText,
        url: '/reports/employee-device-login',
        badge: 'Yangi',
      },
    ],
  },
]

// export const currentYear = new Date().getFullYear()

export const ReportsGrid: React.FC = () => {
  const role = useCurrentRole()

  const filteredGroups = useMemo(() => {
    if (role === UserRoles.CHAIRMAN || role === UserRoles.ADMIN) {
      return REPORTS_GROUPS
    }
    return REPORTS_GROUPS.filter((group) => group.id !== 'employees')
  }, [role])

  return (
    <Fragment>
      <div className="mb-6 flex items-center justify-between">
        <h5 className="flex flex-wrap items-baseline gap-2 text-xl font-semibold text-gray-800 sm:text-2xl">
          Hisobotlar
          <span className="text-xs font-normal text-amber-600 italic sm:text-sm">
            (ushbu sahifa ishlab chiqish jarayonida)
          </span>
        </h5>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredGroups.map((group) => (
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
                      <span className="flex items-center gap-2 text-sm font-medium text-gray-600 group-hover:text-gray-900">
                        {item.title}
                        {item.badge && (
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                              item.badge === 'Jarayonda' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </span>
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
