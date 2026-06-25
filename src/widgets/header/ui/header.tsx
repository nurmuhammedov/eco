import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Separator } from '@/shared/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCustomSearchParams } from '@/shared/hooks'
import UserDropdown from '@/widgets/header/ui/user-dropdown'
import { format, getMonth, getQuarter, subDays, subMonths, subQuarters } from 'date-fns'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { InquiryNotification } from './inquiry-notification'
import DatePicker from '@/shared/components/ui/datepicker'

const MONTHS = [
  { id: 'JANUARY', name: 'Yanvar' },
  { id: 'FEBRUARY', name: 'Fevral' },
  { id: 'MARCH', name: 'Mart' },
  { id: 'APRIL', name: 'Aprel' },
  { id: 'MAY', name: 'May' },
  { id: 'JUNE', name: 'Iyun' },
  { id: 'JULY', name: 'Iyul' },
  { id: 'AUGUST', name: 'Avgust' },
  { id: 'SEPTEMBER', name: 'Sentabr' },
  { id: 'OCTOBER', name: 'Oktabr' },
  { id: 'NOVEMBER', name: 'Noyabr' },
  { id: 'DECEMBER', name: 'Dekabr' },
]

export function Header() {
  const { pathname = '' } = useLocation()
  const { paramsObject, addParams } = useCustomSearchParams()

  const isRiskAnalysisMonthly = pathname.startsWith('/risk-analysis/monthly') || pathname === '/risk-analysis'
  const isRiskAnalysisDaily = pathname.startsWith('/risk-analysis/daily')

  const dateBasisQuarter = subQuarters(new Date(), 1)
  const defaultQuarter = getQuarter(dateBasisQuarter).toString()

  const dateBasisMonth = subMonths(new Date(), 1)
  const defaultYear = pathname?.startsWith('/inspections') ? undefined : dateBasisMonth.getFullYear().toString()
  const defaultMonth = pathname?.startsWith('/inspections') ? undefined : MONTHS[getMonth(dateBasisMonth)].id

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

  const showYearFilter = ['/inspections', '/preventions'].includes(pathname) || isRiskAnalysisMonthly
  const showMonthFilter = isRiskAnalysisMonthly || pathname === '/inspections'
  const showDailyCalendar = isRiskAnalysisDaily

  const title = useMemo(() => {
    const PATH_TITLES = [
      { path: '/dashboard', title: 'Bosh sahifa' },
      { path: '/register', title: 'Reyestrlar' },
      { path: '/applications', title: 'Arizalar' },
      { path: '/preventions', title: 'Profilaktika' },
      { path: '/risk-analysis', title: 'Xavfni tahlil qilish' },
      { path: '/inspections', title: 'Tekshiruvlar' },
      { path: '/expertise-organizations', title: 'Ekspert tashkilotlar' },
      { path: '/accreditations', title: 'Ekspertiza xulosalari' },
      { path: '/declarations', title: 'Deklaratsiya' },
      { path: '/attestations', title: 'Attestatsiya' },
      { path: '/reports', title: 'Hisobotlar' },
      { path: '/permits', title: 'Ruxsat etuvchi hujjatlar' },
      { path: '/inquiries', title: 'Murojaatlar' },
      { path: '/accidents', title: 'Baxtsiz hodisalar va avariyalar' },
      { path: '/territories', title: 'Hududlar' },
      { path: '/department', title: 'Bo‘limlar' },
      { path: '/staffs', title: 'Xodimlar' },
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
      { path: '/cadastre-passport', title: 'TXYZ Kadastr' },
    ]

    const match = PATH_TITLES.find((item) => pathname.startsWith(item.path))
    return match ? match.title : ''
  }, [pathname])

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {title && <h1 className="text-foreground line-clamp-2 text-base leading-tight font-medium">{title}</h1>}
      </div>

      <div className="ml-auto flex items-center gap-4">
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
        <InquiryNotification />
        <UserDropdown />
      </div>
    </header>
  )
}
