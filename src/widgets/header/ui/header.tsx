import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Separator } from '@/shared/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCustomSearchParams } from '@/shared/hooks'
import UserDropdown from '@/widgets/header/ui/user-dropdown'
import { getQuarter, subQuarters } from 'date-fns'
import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'

const QUARTERS = [
  { id: '1', name: '1-chorak' },
  { id: '2', name: '2-chorak' },
  { id: '3', name: '3-chorak' },
  { id: '4', name: '4-chorak' },
]

export function Header() {
  const { pathname = '' } = useLocation()
  const { paramsObject, addParams } = useCustomSearchParams()

  const isRiskAnalysis = pathname === '/risk-analysis'
  const dateBasis = isRiskAnalysis ? subQuarters(new Date(), 1) : new Date()

  const defaultYear = dateBasis.getFullYear().toString()
  const defaultQuarter = getQuarter(dateBasis).toString()

  const selectedYear = paramsObject.year?.toString() || defaultYear
  const selectedQuarter = paramsObject.quarter?.toString() || defaultQuarter

  const yearOptions = useMemo(() => {
    const startYear = 2025
    const endYear = new Date().getFullYear()
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString())
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

  const handleQuarterChange = (quarter: string) => {
    addParams({ quarter }, 'page')
  }

  const showYearFilter = ['/risk-analysis', '/inspections', '/preventions'].includes(pathname)
  const showQuarterFilter = showYearFilter && pathname !== '/preventions'

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
      { path: '/cadastre', title: 'Arxiv' },
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

            {showQuarterFilter && (
              <Select value={selectedQuarter} onValueChange={handleQuarterChange}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Chorak" />
                </SelectTrigger>
                <SelectContent>
                  {QUARTERS.map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
        <UserDropdown />
      </div>
    </header>
  )
}
