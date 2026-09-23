import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Separator } from '@/shared/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCustomSearchParams } from '@/shared/hooks'
import UserDropdown from '@/widgets/header/ui/user-dropdown'
import { format, getQuarter, subDays, subQuarters } from 'date-fns'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { DelegatedTasksNotification } from './delegated-tasks-notification'
import { NotificationsMenu } from './notifications-menu'
import DatePicker from '@/shared/components/ui/datepicker'

import {
  MONTHS,
  getDefaultYearAndMonthForInspections,
  getDefaultYearAndMonthForRiskAnalysis,
} from '@/shared/utils/date'

export function Header() {
  const { pathname = '' } = useLocation()
  const { paramsObject, addParams } = useCustomSearchParams()

  const isRiskAnalysisMonthly = pathname.startsWith('/risk-analysis/monthly') || pathname === '/risk-analysis'
  const isRiskAnalysisDaily = pathname.startsWith('/risk-analysis/daily')

  const dateBasisQuarter = subQuarters(new Date(), 1)
  const defaultQuarter = getQuarter(dateBasisQuarter).toString()

  const defaultYear = pathname?.startsWith('/inspections')
    ? getDefaultYearAndMonthForInspections().year
    : getDefaultYearAndMonthForRiskAnalysis().year

  const defaultMonth = pathname?.startsWith('/inspections')
    ? getDefaultYearAndMonthForInspections().month
    : getDefaultYearAndMonthForRiskAnalysis().month

  const dateBasisDay = subDays(new Date(), 1)
  const defaultDate = format(dateBasisDay, 'yyyy-MM-dd')

  const selectedYear = paramsObject.year?.toString() || defaultYear
  const selectedMonth = paramsObject.month?.toString() || defaultMonth
  const selectedDateStr = paramsObject.date?.toString() || defaultDate
  const selectedDate = selectedDateStr ? new Date(selectedDateStr) : undefined

  const yearOptions = useMemo(() => {
    const startYear = 2025
    const endYear = new Date().getFullYear()
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString()).reverse()
  }, [])

  const handleYearChange = (year: string) => {
    const isPrevention = pathname === '/preventions'

    addParams(
      {
        year,
        quarter: isPrevention ? undefined : defaultQuarter,
      },
      'page'
    )
  }

  const handleMonthChange = (month: string) => {
    addParams({ month }, 'page')
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      addParams({ date: format(date, 'yyyy-MM-dd') }, 'page')
    }
  }

  const showYearFilter =
    ['/inspections/risk-based', '/inspections/other', '/preventions'].includes(pathname) || isRiskAnalysisMonthly
  const showMonthFilter = isRiskAnalysisMonthly || ['/inspections/risk-based', '/inspections/other'].includes(pathname)
  const showDailyCalendar = isRiskAnalysisDaily

  const title = useMemo(() => {
    const PATH_TITLES = [
      { path: '/inspections/risk-based', title: 'Xavf tahlili asosidagi tekshiruvlar' },
      { path: '/inspections/other', title: 'Boshqa turdagi tekshiruvlar' },
      { path: '/inspections/info', title: 'Tekshiruv ma’lumotlari' },
      { path: '/inspections', title: 'Tekshiruvlar' },
      { path: '/risk-analysis/monthly', title: 'Oylik xavf tahlili' },
      { path: '/risk-analysis/daily', title: 'Kunlik xavf tahlili' },
      { path: '/risk-analysis', title: 'Xavfni tahlil qilish' },
      { path: '/kpi/departments', title: 'Boshqarma va bo‘limlar' },
      { path: '/kpi/my-tasks', title: 'Mening KPIlarim' },
      { path: '/kpi/tasks', title: 'KPI vazifalar' },
      { path: '/kpi/report', title: 'KPI hisoboti' },
      { path: '/reports/kpi-departments', title: 'Bo‘limlarning KPI ko‘rsatkichi' },
      { path: '/attestation-calendars/', title: 'Imtihon ishtirokchilari' },
      { path: '/attestation-calendars', title: 'Imtihonlar' },
      { path: '/attestation-queue', title: 'Arizalar navbati' },
      { path: '/attestation-questions', title: 'Imtihon savollari' },
      { path: '/attestation-applications', title: 'Attestatsiya arizalari' },
      { path: '/attestations', title: 'Attestatsiya' },
      { path: '/dashboard', title: 'Bosh sahifa' },
      { path: '/register', title: 'Reyestrlar' },
      { path: '/applications', title: 'Arizalar' },
      { path: '/preventions', title: 'Profilaktika' },
      { path: '/expertise-organizations', title: 'Ekspert tashkilotlar' },
      { path: '/organizations', title: 'Tashkilotlar' },
      { path: '/accreditations', title: 'Ekspertiza xulosalari' },
      { path: '/declarations', title: 'Deklaratsiya' },
      { path: '/reports', title: 'Hisobotlar' },
      { path: '/permits', title: 'Ruxsat etuvchi hujjatlar' },
      { path: '/inquiries', title: 'Murojaatlar' },
      { path: '/accidents', title: 'Baxtsiz hodisalar va Avariyalar' },
      { path: '/news', title: 'Xabarnoma' },
      { path: '/territories', title: 'Hududlar' },
      { path: '/departments', title: 'Bo‘limlar' },
      { path: '/employees', title: 'Xodimlar' },
      { path: '/decree-signers', title: 'Imzolovchi shaxslar' },
      { path: '/hazardous-facilities', title: 'Xavfli obyektlar' },
      { path: '/equipments', title: 'Qurilma turlari' },
      { path: '/attraction-types', title: 'Attraksion tipi' },
      { path: '/inspection-surveys', title: 'Tekshiruv so‘rovnomalari' },
      { path: '/user-logs', title: 'Foydalanuvchi loglari' },
      { path: '/hybrid-mail', title: 'Gibrid pochta' },
      { path: '/metrics', title: 'Server ko‘rsatgichlari' },
      { path: '/elevators', title: 'Liftlar' },
      { path: '/expertise', title: 'Ekspertiza' },
      { path: '/archive', title: 'Arxiv' },
      { path: '/cadastre-passports', title: 'TXYUZ kadastr pasportlari' },
      { path: '/user-delegation', title: 'Vazifalarni yuklash' },
      { path: '/profile', title: 'Profil' },
    ]

    const match = PATH_TITLES.find((item) => pathname.startsWith(item.path))
    return match ? match.title : ''
  }, [pathname])

  /**
   * The bar wraps rather than overflows. On a phone the date filters pushed
   * the notifications and the account menu past the right edge, and the page
   * does not scroll sideways - so there was no way to reach them at all, and
   * no way to sign out. A second row costs nothing on a wide screen, where
   * everything still fits on one.
   */
  return (
    <header className="sticky top-0 z-10 flex min-h-16 shrink-0 flex-wrap items-center gap-2 border-b bg-white px-4 py-2 shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:min-h-12">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {title && <h1 className="text-foreground line-clamp-2 text-base leading-tight font-medium">{title}</h1>}
      </div>

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-4">
        {showDailyCalendar && (
          <div className="flex w-[200px] items-center">
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              disableStrategy="after"
              placeholder="Sanani tanlang"
              isForm={false}
            />
          </div>
        )}
        {showYearFilter && (
          <div className="flex items-center gap-x-2">
            <Select value={selectedYear} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Yil" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {showMonthFilter && (
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[130px]">
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
            )}
          </div>
        )}
        <DelegatedTasksNotification />
        <NotificationsMenu />
        <UserDropdown />
      </div>
    </header>
  )
}
