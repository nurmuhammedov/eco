import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useCustomSearchParams } from '@/shared/hooks'
import UserDropdown from '@/widgets/header/ui/user-dropdown'
import { getQuarter } from 'date-fns'
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

  const currentYear = new Date().getFullYear().toString()
  const currentQuarter = getQuarter(new Date()).toString()

  const selectedYear = paramsObject.year?.toString() || currentYear
  const selectedQuarter = paramsObject.quarter?.toString() || currentQuarter

  const yearOptions = useMemo(() => {
    const startYear = 2025
    const endYear = new Date().getFullYear()
    return Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString())
  }, [])

  const handleYearChange = (year: string) => {
    // Agar sahifa 'preventions' bo'lsa, quarter parametrini yubormaymiz
    const isPrevention = pathname === '/preventions'

    addParams(
      {
        year,
        quarter: isPrevention ? undefined : currentQuarter,
      },
      'page'
    )
  }

  const handleQuarterChange = (quarter: string) => {
    addParams({ quarter }, 'page')
  }

  const showYearFilter = ['/risk-analysis', '/inspections', '/preventions'].includes(pathname)
  const showQuarterFilter = showYearFilter && pathname !== '/preventions'

  return (
    <header className="3xl:px-6 3xl:py-5 sticky top-0 z-10 flex w-full items-center justify-between border-b border-neutral-200 bg-white px-4 py-4">
      <div className="flex items-center gap-x-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-2xl font-semibold">
          {pathname === '/register' && 'Reyestrlar'}
          {pathname === '/applications' && 'Arizalar'}
          {pathname === '/permits' && 'Ruxsatnomalar'}
          {pathname === '/expertise' && 'Ekspertiza'}
          {pathname === '/risk-analysis' && 'Xavfni tahlil qilish'}
          {pathname === '/accreditations' && 'Ekspertiza xulosalari'}
          {pathname === '/expertise-organizations' && 'Ekspertiza tashkilotlari'}
          {pathname === '/inspections' && 'Tekshiruvlar'}
          {pathname === '/preventions' && 'Profilaktika'}
          {pathname === '/inquiries' && 'Murojaatlar'}
        </h1>
      </div>

      <div className="flex items-center gap-x-4">
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
