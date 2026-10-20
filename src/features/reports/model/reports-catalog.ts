import { useMemo, type ElementType } from 'react'
import {
  AlertTriangle,
  BarChart,
  Box,
  CalendarClock,
  ClipboardCheck,
  Clock,
  FileSearch,
  Factory,
  FileText,
  Flame,
  LineChart,
  Map,
  PieChart,
  PlusSquare,
  Radiation,
  ShieldCheck,
  Siren,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/shared/hooks/use-auth'
import { useCurrentRole } from '@/shared/hooks/use-current-role'
import { UserRoles } from '@/shared/types/user'

export interface ReportItem {
  id: string
  title: string
  icon?: ElementType
  url: string
  badge?: string
  reportType?: 'MONTHLY' | 'OTHERS'
}

export interface ReportGroup {
  id: string
  title: string
  items: ReportItem[]
}

export const REPORTS_GROUPS: ReportGroup[] = [
  {
    id: 'applications',
    title: 'Arizalar',
    items: [
      {
        id: 'rep-1',
        title: 'Arizalarning hududlar kesimida taqsimlanishi',
        icon: Map,
        url: '/reports/applications-by-region',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-2',
        title: 'Arizalar turlari bo‘yicha taqsimlanishi',
        icon: PieChart,
        url: '/reports/applications-by-type',
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
        url: '/reports/registry-objects',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-4',
        title: 'Davlat ro‘yxatidagi yangi qo‘shilgan va amaldagi obyektlar',
        icon: PlusSquare,
        url: '/reports/registry-new-objects',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-8',
        title: 'Reyestr ma’lumotlarini o‘zgartirish so‘rovlari bo‘yicha hisobot',
        icon: Zap,
        url: '/reports/registry-changes',
        reportType: 'MONTHLY',
      },
      {
        id: 'rep-9',
        title: 'Inspektorlar tomonidan reyestrdan chiqarish so‘rovlari bo‘yicha hisobot',
        icon: ClipboardCheck,
        url: '/reports/registry-deregistrations',
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
    id: 'terms',
    title: 'Muddati bo‘yicha',
    items: [
      {
        id: 'rep-irs-xray-status',
        title: 'INM va Rentgen muddati o‘tganlar',
        icon: Radiation,
        url: '/reports/irs-xray-status',
        badge: 'Yangi',
        reportType: 'OTHERS',
      },
      {
        id: 'rep-5',
        title: 'Qurilmalarning muddatlari bo‘yicha hisobot',
        icon: CalendarClock,
        url: '/reports/registry-equipment-terms',
        reportType: 'OTHERS',
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
    id: 'cadastre-passports',
    title: 'Kadastr pasportlari',
    items: [
      {
        id: 'cadastre-passport-status',
        title: 'Kadastr pasportlari holati hududlar kesimida',
        icon: ClipboardCheck,
        url: '/reports/cadastre-passport',
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
        reportType: 'MONTHLY',
      },
      {
        id: 'insp-hf-category',
        title: 'XICHO toifalari bo‘yicha o‘tkazilgan tekshiruvlar',
        icon: Factory,
        url: '/reports/inspection-hf-category',
        reportType: 'OTHERS',
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
        id: 'inq-status',
        title: 'Murojaatlar holati bo‘yicha hisobot',
        icon: Map,
        url: '/reports/inquiries-status',
        reportType: 'OTHERS',
      },
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
    ],
  },
  {
    id: 'kpi',
    title: 'KPI',
    items: [
      {
        id: 'kpi-departments',
        title: 'Bo‘limlarning KPI ko‘rsatkichi',
        icon: Target,
        url: '/reports/kpi-departments',
        reportType: 'OTHERS',
      },
    ],
  },
  {
    id: 'employees',
    title: 'Xodimlar',
    items: [
      {
        id: 'emp-kpi-regional',
        title: 'Hududlarning KPI ko‘rsatkichi',
        icon: Users,
        url: '/reports/kpi-regional',
        reportType: 'MONTHLY',
      },
      {
        id: 'emp-top-100-orgs',
        title: 'Eng ko‘p 3 toifa xodimga ega Top-100 tashkilotlar',
        icon: Users,
        url: '/reports/top-100-organizations',
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

/** Address of a reports section; the sidebar lists one per group */
export const reportGroupUrl = (groupId: string) => `/reports/groups/${groupId}`

/** A report still being built has no page yet */
export const isReportReady = (item: ReportItem) => item.url !== '#'

/**
 * The groups a role is shown. Both the overview grid and the reports menu read
 * this, so a report cannot appear in one and be missing from the other.
 */
export const filterReportGroups = (role: UserRoles, isSupervisor: boolean): ReportGroup[] => {
  let groups = REPORTS_GROUPS

  if (role !== UserRoles.CHAIRMAN && role !== UserRoles.ADMIN) {
    groups = groups.filter((group) => group.id !== 'employees')
  }

  // Answered by the KPI service for the chairman and the roles that may execute a department's KPI
  if (![UserRoles.CHAIRMAN, UserRoles.HEAD, UserRoles.MANAGER].includes(role) && !isSupervisor) {
    groups = groups.filter((group) => group.id !== 'kpi')
  }

  // Kadastr pasportlari hisobotini backend rais, hudud boshlig‘i va bo‘lim boshlig‘iga ochadi.
  if (role !== UserRoles.CHAIRMAN && role !== UserRoles.REGIONAL && role !== UserRoles.HEAD) {
    groups = groups.filter((group) => group.id !== 'cadastre-passports')
  }

  return groups
}

export const useReportGroups = () => {
  const role = useCurrentRole()
  const { user } = useAuth()
  // Supervisors sign in as REGIONAL with this flag; they may be a KPI department's executor.
  const isSupervisor = !!user?.isSupervisor

  return useMemo(() => filterReportGroups(role, isSupervisor), [role, isSupervisor])
}
