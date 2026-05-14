import React, { Fragment, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart,
  Box,
  CalendarClock,
  ClipboardCheck,
  Clock,
  FileSearch,
  FileText,
  Flame,
  LineChart,
  Map,
  PieChart,
  PlusSquare,
  ShieldCheck,
  Siren,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { Card } from '@/shared/components/ui/card'
import { Link } from 'react-router-dom'
import { useCurrentRole } from '@/shared/hooks/use-current-role'
import { UserRoles } from '@/entities/user'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

interface ReportItem {
  id: string
  title: string
  icon?: React.ElementType
  url: string
  badge?: string
  reportType?: 'MONTHLY' | 'OTHERS'
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
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-2',
        title: 'Arizalar turlari bo‘yicha taqsimlanishi',
        icon: PieChart,
        url: '/reports/applications-types',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-appeal-execution',
        title: 'Arizalarning ijro muddati bo‘yicha umumiy hisobot',
        icon: Clock,
        url: '/reports/appeal-execution',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-appeal-status-duration',
        title: 'Arizalar holati va muddati bo‘yicha hisobot',
        icon: Clock,
        url: '/reports/appeal-status-duration',
        reportType: 'MONTHLY',
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
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-4',
        title: 'Davlat ro‘yxatidagi yangi qo‘shilgan va amaldagi obyektlar',
        icon: PlusSquare,
        url: '/reports/registers-new-objects',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-5',
        title: 'Qurilmalarning muddatlari bo‘yicha hisobot',
        icon: CalendarClock,
        url: '/reports/registers-equipment-terms',
        reportType: 'OTHERS',
      },
      {
        id: 'rep-8',
        title: 'Reyestr maʼlumotlarini o‘zgartirish so‘rovlari bo‘yicha hisobot',
        icon: Zap,
        url: '/reports/changes',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-9',
        title: 'Inspektorlar tomonidan reyestrdan chiqarish so‘rovlari bo‘yicha hisobot',
        icon: ClipboardCheck,
        url: '/reports/registers-deregister',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-hf-employee-stats',
        title: 'XICHOlarda ishchi xodimlari bo‘yicha statistika',
        icon: Users,
        url: '/reports/hf-employee-stats',
        reportType: 'OTHERS',
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
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
      {
        id: 'rep-7',
        title: 'Avariyalar bo‘yicha umumiy hisobot',
        icon: Flame,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
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
        reportType: 'MONTHLY',
      },
      {
        id: 'prev-inspector-load',
        title: 'Profilaktika hududlar kesimida',
        icon: Map,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
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
        reportType: 'MONTHLY',
      },
      {
        id: 'risk-objects',
        title: 'Xavf darajasi bo‘yicha obyektlar',
        icon: AlertTriangle,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
      {
        id: 'risk-trends',
        title: 'Xavf ko‘rsatkichlari dinamikasi',
        icon: Target,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
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
        reportType: 'MONTHLY',
      },
      {
        id: 'insp-execution',
        title: 'Tekshiruvlarning chora tadbirlari bo‘yicha hisobot',
        icon: ClipboardCheck,
        url: '/reports/inspection-execution',
        badge: 'Yangi',
        reportType: 'MONTHLY',
      },
      {
        id: 'insp-types',
        title: 'Rejali va rejadan tashqari',
        icon: FileSearch,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
      {
        id: 'insp-rejected',
        title: '1 kunlik va 10 kunlik tekshiruvlar',
        icon: Clock,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
    ],
  },
  {
    id: 'inquiries',
    title: 'Murojaatlar',
    items: [
      {
        id: 'inq-content',
        title: 'Murojaatlar dinamikasi',
        icon: TrendingUp,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
      {
        id: 'inq-execution',
        title: 'Murojaatlar oylar kesimida',
        icon: BarChart,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'MONTHLY',
      },
      {
        id: 'inq-regional',
        title: 'Hududiy murojaatlar',
        icon: Map,
        url: '#',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
    ],
  },
  {
    id: 'employees',
    title: 'Xodimlar',
    items: [
      {
        id: 'emp-top-100-orgs',
        title: 'Eng ko‘p 3 toifa xodimga ega Top-100 tashkilotlar',
        icon: Users,
        url: '/reports/top-100-organizations',
        badge: 'Yangi',
        reportType: 'OTHERS',
      },
      {
        id: 'emp-turniket',
        title: 'Xodimlarning ishga vaqtida kelishi bo‘yicha hisobot',
        icon: Users,
        url: '/reports/turniket-logs',
        reportType: 'MONTHLY',
      },
      {
        id: 'emp-device-login',
        title: 'Xodimlar qaysi qurilmadan kirayotgani bo‘yicha hisobot',
        icon: FileText,
        url: '/reports/employee-device-login',
        reportType: 'OTHERS',
      },
      {
        id: 'emp-activity-dashboard',
        title: 'Xodimlar faolligi doir umumiy boshqaruv paneli',
        icon: BarChart,
        url: '/reports/employees-dashboard',
        badge: 'Jarayonda',
        reportType: 'OTHERS',
      },
    ],
  },
]

export const ReportsGrid: React.FC = () => {
  const role = useCurrentRole()
  const [filterType, setFilterType] = useState<string>('ALL')

  const filteredGroups = useMemo(() => {
    let groups = REPORTS_GROUPS

    if (role !== UserRoles.CHAIRMAN && role !== UserRoles.ADMIN) {
      groups = groups.filter((group) => group.id !== 'employees')
    }

    if (filterType !== 'ALL') {
      groups = groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.reportType === filterType),
        }))
        .filter((group) => group.items.length > 0)
    }

    return groups
  }, [role, filterType])

  return (
    <Fragment>
      <div className="mb-6 flex items-center justify-between">
        <h5 className="flex flex-wrap items-baseline gap-2 text-xl font-semibold text-gray-800 sm:text-2xl">
          Hisobotlar
          <span className="text-xs font-normal text-amber-600 italic sm:text-sm">
            (ushbu sahifa ishlab chiqish jarayonida)
          </span>
        </h5>
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Barchasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              <SelectItem value="MONTHLY">Oylik hisobotlar</SelectItem>
              <SelectItem value="OTHERS">Boshqa turdagi hisobotlar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2 xl:grid-cols-3">
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
