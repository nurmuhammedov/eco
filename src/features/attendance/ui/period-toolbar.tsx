import type { ReactNode } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { MONTHS } from '@/shared/constants/months'
import { useAttendanceAccess, useAttendanceDivisions } from '../model/use-attendance'

/** Every division at once */
export const ALL_DIVISIONS = 'ALL'

interface PeriodToolbarProps {
  year: number
  month: number
  division: string
  onChange: (patch: { year?: number; month?: number; division?: string }) => void
  /** The holidays are kept by year only */
  hideMonth?: boolean
  hideDivision?: boolean
  children?: ReactNode
}

/**
 * The month (and the division) every tab reads. A regional head is shown their
 * own division only: the server narrows the reports to it anyway.
 */
export const PeriodToolbar = ({
  year,
  month,
  division,
  onChange,
  hideMonth,
  hideDivision,
  children,
}: PeriodToolbarProps) => {
  const { isRegional } = useAttendanceAccess()
  const { data: divisions = [] } = useAttendanceDivisions()
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 4 }, (_, index) => currentYear - index)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={String(year)} onValueChange={(value) => onChange({ year: Number(value) })}>
        <SelectTrigger className="w-[100px]" aria-label="Yil">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {years.map((item) => (
            <SelectItem key={item} value={String(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!hideMonth && (
        <Select value={String(month)} onValueChange={(value) => onChange({ month: Number(value) })}>
          <SelectTrigger className="w-[130px]" aria-label="Oy">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((item, index) => (
              <SelectItem key={item.value} value={String(index + 1)}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {!hideDivision &&
        (isRegional ? (
          <span className="rounded-md border bg-neutral-50 px-3 py-2 text-sm">
            {divisions[0]?.name ?? 'O‘z bo‘linmasi'}
          </span>
        ) : (
          <Select
            value={division || ALL_DIVISIONS}
            onValueChange={(value) => onChange({ division: value === ALL_DIVISIONS ? '' : value })}
          >
            <SelectTrigger className="w-[280px]" aria-label="Bo‘linma">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_DIVISIONS}>Barcha bo‘linmalar</SelectItem>
              {divisions.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

      {children && <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}
