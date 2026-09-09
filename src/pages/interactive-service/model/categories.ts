import {
  ClipboardCheck,
  Cog,
  Construction,
  Factory,
  FerrisWheel,
  Gauge,
  LucideIcon,
  MessageSquare,
  Radiation,
  ScanLine,
} from 'lucide-react'
import {
  MONTHS,
  getDefaultYearAndMonthForInspections,
  getDefaultYearAndMonthForRiskAnalysis,
} from '@/shared/utils/date'

export type CategoryId =
  | 'hf'
  | 'equipment'
  | 'crane'
  | 'attraction'
  | 'irs'
  | 'xray'
  | 'risk'
  | 'inspection'
  | 'inquiry'

interface Category {
  id: CategoryId
  label: string
  subtitle: string
  icon: LucideIcon
  /** Set where a single request also yields the per-region breakdown the map shades. */
  locationEndpoint?: string
  /** Shown only for the categories the period filter actually reaches. */
  periodFiltered?: boolean
}

export const CATEGORIES: Category[] = [
  {
    id: 'hf',
    label: 'XICHOlar',
    subtitle: 'Xavfli ishlab chiqarish obyektlari',
    icon: Factory,
    locationEndpoint: '/hf/locations',
  },
  {
    id: 'crane',
    label: 'Kranlar',
    subtitle: 'Ro‘yxatga olingan kranlar',
    icon: Construction,
    locationEndpoint: '/equipments/cranes/locations',
  },
  {
    id: 'attraction',
    label: 'Attraksionlar',
    subtitle: 'Ro‘yxatga olingan attraksionlar',
    icon: FerrisWheel,
    locationEndpoint: '/equipments/attractions/locations',
  },
  {
    id: 'equipment',
    label: 'Qurilmalar',
    subtitle: 'Barcha texnik qurilmalar — kran va attraksionlar bilan birga',
    icon: Cog,
  },
  { id: 'irs', label: 'INMlar', subtitle: 'Ionlashtiruvchi nurlanish manbalari', icon: Radiation },
  { id: 'xray', label: 'Rentgenlar', subtitle: 'Rentgen qurilmalari', icon: ScanLine },
  { id: 'risk', label: 'Xavf tahlili', subtitle: 'Xavf tahlili natijalari', icon: Gauge, periodFiltered: true },
  {
    id: 'inspection',
    label: 'Tekshiruvlar',
    subtitle: 'O‘tkazilgan tekshiruvlar',
    icon: ClipboardCheck,
    periodFiltered: true,
  },
  { id: 'inquiry', label: 'Murojaatlar', subtitle: 'Kelib tushgan murojaatlar', icon: MessageSquare },
]

export { MONTHS }

export const categoryOf = (id: CategoryId) => CATEGORIES.find((item) => item.id === id) ?? CATEGORIES[0]

/**
 * Each section reads its period from the same helper the rest of the app uses:
 * risk analysis closes a quarter behind, inspections open on the current one.
 */
export const defaultPeriodFor = (id: CategoryId) =>
  id === 'inspection' ? getDefaultYearAndMonthForInspections() : getDefaultYearAndMonthForRiskAnalysis()

export const AVAILABLE_YEARS = (() => {
  const current = new Date().getFullYear()

  return Array.from({ length: Math.max(1, current - 2025 + 1) }, (_, index) => 2025 + index)
})()
