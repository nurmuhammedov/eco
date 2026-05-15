import React, { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { UzbekistanMap } from '@/features/dashboard/ui/uzbekistan-map'
import { useDashboardStats } from '@/features/dashboard/model/use-dashboard-stats'
import { useRiskAnalysisStats } from '@/features/dashboard/model/use-risk-analysis-stats'
import { cn } from '@/shared/lib/utils'
import { getRegionIdByName } from '@/features/dashboard/model/constants'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import Icon from '@/shared/components/common/icon'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Loader2 } from 'lucide-react'

/* ──────── Bo'limlar ──────── */
const CATEGORIES = [
  { id: 'hf', label: 'XICHOlar' },
  { id: 'equipment', label: 'Qurilmalar' },
  { id: 'irs', label: 'INMlar' },
  { id: 'xray', label: 'Rentgenlar' },
  { id: 'risk', label: 'Xavf tahlili' },
  { id: 'inspection', label: 'Tekshiruvlar' },
  { id: 'inquiry', label: 'Murojaatlar' },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

const SUBTITLES: Record<CategoryId, string> = {
  hf: 'Xavfli ishlab chiqarish obyektlari',
  equipment: 'Texnik qurilmalar',
  irs: 'Ionlashtiruvchi nurlanish manbalari',
  xray: 'Rentgen qurilmalari',
  risk: 'Xavf tahlili natijalari',
  inspection: 'Davlat nazorati tekshiruvlari',
  inquiry: 'Kelib tushgan murojaatlar',
}

/* ──────── O'zbekcha sana formatlash ──────── */
const UZ_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]
const UZ_WEEKDAYS = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']

const formatUzDate = (d: Date) => {
  const day = d.getDate()
  const month = UZ_MONTHS[d.getMonth()]
  const year = d.getFullYear()
  const weekday = UZ_WEEKDAYS[d.getDay()]
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1)
  return `${day}-${month} ${year}, ${capitalizedWeekday}`
}

const formatUzTime = (d: Date) => {
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  const s = String(d.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

/* ──────── Default chorak va yil (bitta chorak orqaga) ──────── */
const getDefaultQuarter = () => {
  const now = new Date()
  const currentQ = Math.ceil((now.getMonth() + 1) / 3)
  const currentY = now.getFullYear()
  if (currentQ === 1) return { type: 4, year: currentY - 1 }
  return { type: currentQ - 1, year: currentY }
}

/* ──────── Skeleton loader ──────── */
const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded-lg bg-slate-200/60', className)} />
)

/* ──────── Sahifa yuklanish ekrani (skeleton) ──────── */
const PageLoader: React.FC = () => (
  <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-50 select-none">
    {/* Header skeleton */}
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 lg:px-10 lg:py-4">
      <div className="flex items-center gap-3 lg:gap-4">
        <Skeleton className="h-10 w-10 rounded-full lg:h-12 lg:w-12" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-64 lg:h-6 lg:w-80" />
          <Skeleton className="h-3 w-44 lg:h-4 lg:w-56" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Skeleton className="h-7 w-28 lg:h-8 lg:w-32" />
        <Skeleton className="h-3 w-40 lg:w-48" />
      </div>
    </header>

    {/* Nav tabs skeleton */}
    <nav className="flex items-center justify-center gap-2 border-b border-slate-100 bg-white px-4 py-2.5 lg:gap-3 lg:px-6">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-lg lg:h-9 lg:w-24" />
      ))}
    </nav>

    {/* Content skeleton */}
    <main className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:gap-5 lg:p-6">
      {/* Map skeleton */}
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="absolute top-4 left-5 z-10 flex flex-col gap-2 lg:top-6 lg:left-8">
          <Skeleton className="h-6 w-48 lg:h-8 lg:w-56" />
          <Skeleton className="h-3 w-40 lg:w-52" />
        </div>
        <div className="absolute top-4 right-5 z-10 lg:top-6 lg:right-8">
          <Skeleton className="h-6 w-24 rounded-lg lg:h-7 lg:w-28" />
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <Skeleton className="h-[75%] w-[70%] rounded-xl" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="flex shrink-0 flex-col gap-4 sm:h-36 sm:flex-row sm:gap-5 lg:h-40">
        <Skeleton className="h-32 rounded-2xl sm:h-full sm:w-56 lg:w-72" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 lg:p-6"
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-20 lg:h-10 lg:w-24" />
            <Skeleton className="h-1 w-full" />
          </div>
        ))}
      </div>
    </main>
  </div>
)

/* ──────── Raqamli animatsiya komponenti ──────── */
const AnimatedNumber: React.FC<{
  value: number
  className?: string
  style?: React.CSSProperties
  isLoading?: boolean
}> = ({ value, className, style, isLoading }) => {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (value === 0) {
      setDisplayed(0)
      return
    }
    let raf: number
    const duration = 1000
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayed(Math.round(value * eased))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [value])

  if (isLoading) {
    return <Skeleton className="h-9 w-20 lg:h-12 lg:w-28" />
  }

  return (
    <span className={className} style={style}>
      {displayed.toLocaleString()}
    </span>
  )
}

/* ──────── Progress bar ──────── */
const ProgressBar: React.FC<{ percent: number; color: string; isLoading?: boolean }> = ({
  percent,
  color,
  isLoading,
}) => {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = requestAnimationFrame(() => setWidth(percent))
    return () => cancelAnimationFrame(t)
  }, [percent])

  if (isLoading) {
    return <Skeleton className="h-1 w-full" />
  }

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-out"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  )
}

/* ──────── Sahifa ──────── */
export const InteractiveServicePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('hf')
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [time, setTime] = useState(new Date())
  const [transitionKey, setTransitionKey] = useState(0)
  const [pageReady, setPageReady] = useState(false)

  // Default chorak va yil
  const defaultQuarter = useMemo(() => getDefaultQuarter(), [])
  const [filterYear, setFilterYear] = useState(defaultQuarter.year)
  const [filterQuarter, setFilterQuarter] = useState(defaultQuarter.type)

  // Sahifa tayyor bo'lganda loader yashirish
  useEffect(() => {
    const timer = setTimeout(() => setPageReady(true), 600)
    return () => clearTimeout(timer)
  }, [])

  // Soat
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Kategoriya o'zgarganda animatsiya
  useEffect(() => {
    setTransitionKey((k) => k + 1)
  }, [activeCategory])

  // Xarita bosilganda
  const handleRegionClick = useCallback((name: string | null) => {
    if (!name) {
      setActiveRegion(null)
      return
    }
    setActiveRegion((prev) => (prev === name ? null : name))
  }, [])

  const regionIdForApi = activeRegion ? getRegionIdByName(activeRegion)?.toString() : undefined

  // Ma'lumotlar
  const stats = useDashboardStats(regionIdForApi, activeCategory)

  /*
   * XICHOlar tiplari bo'yicha (hfTypeId parametri orqali)
   * 1-tip: hfTypeId = 1 (name "1") + hfTypeId = 5 (name "3.1")
   * 2-tip: hfTypeId = 2 (name "2") + hfTypeId = 6 (name "3.2")
   * 3-tip: hfTypeId = 8 (name "3.4") + hfTypeId = 9 (name "3.5")
   *       + hfTypeId = 7 (name "3.3") + hfTypeId = 10 (name "3")
   */
  const hfCommon = { page: 1, size: 1, active: true }

  // 1-tip tarkibiy qismlari
  const { totalElements: hfT1_id1 = 0, isLoading: l1 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 1 },
    activeCategory === 'hf'
  )
  const { totalElements: hfT1_id5 = 0, isLoading: l2 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 5 },
    activeCategory === 'hf'
  )

  // 2-tip tarkibiy qismlari
  const { totalElements: hfT2_id2 = 0, isLoading: l3 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 2 },
    activeCategory === 'hf'
  )
  const { totalElements: hfT2_id6 = 0, isLoading: l4 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 6 },
    activeCategory === 'hf'
  )

  // 3-tip tarkibiy qismlari
  const { totalElements: hfT3_id10 = 0, isLoading: l5 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 10 },
    activeCategory === 'hf'
  )
  const { totalElements: hfT3_id7 = 0, isLoading: l6 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 7 },
    activeCategory === 'hf'
  )
  const { totalElements: hfT3_id8 = 0, isLoading: l7 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 8 },
    activeCategory === 'hf'
  )
  const { totalElements: hfT3_id9 = 0, isLoading: l8 } = usePaginatedData(
    '/hf',
    { ...hfCommon, hfTypeId: 9 },
    activeCategory === 'hf'
  )

  const hfType1 = (hfT1_id1 ?? 0) + (hfT1_id5 ?? 0)
  const hfType2 = (hfT2_id2 ?? 0) + (hfT2_id6 ?? 0)
  const hfType3 = (hfT3_id10 ?? 0) + (hfT3_id7 ?? 0) + (hfT3_id8 ?? 0) + (hfT3_id9 ?? 0)
  const hfLoading = l1 || l2 || l3 || l4 || l5 || l6 || l7 || l8

  // Xavf tahlili
  const riskStats = useRiskAnalysisStats({
    year: filterYear,
    quarter: filterQuarter,
    regionId: regionIdForApi,
    enabled: activeCategory === 'risk',
  })
  const riskTotal = riskStats.highRisk + riskStats.mediumRisk + riskStats.lowRisk
  const riskLoading = false // useRiskAnalysisStats internally doesn't expose loading right now

  // Tekshiruvlar (year va chorak majburiy)
  const { totalElements: inspRisk = 0, isLoading: lInsp1 } = usePaginatedData(
    '/inspections',
    {
      page: 1,
      size: 1,
      year: filterYear,
      quarter: filterQuarter,
      type: 'RISK_BASED',
    },
    activeCategory === 'inspection'
  )
  const { totalElements: inspOther = 0, isLoading: lInsp2 } = usePaginatedData(
    '/inspections/other',
    {
      page: 1,
      size: 1,
      year: filterYear,
      quarter: filterQuarter,
      type: 'OTHER',
    },
    activeCategory === 'inspection'
  )
  const inspectionTotal = inspRisk + inspOther
  const inspLoading = lInsp1 || lInsp2

  // Murojaatlar
  const inqParams = { page: 1, size: 10 }
  const { totalElements: inqHf = 0, isLoading: lInq1 } = usePaginatedData(
    '/inquiries',
    { ...inqParams, belongType: 'HF' },
    activeCategory === 'inquiry'
  )
  const { totalElements: inqEq = 0, isLoading: lInq2 } = usePaginatedData(
    '/inquiries',
    { ...inqParams, belongType: 'EQUIPMENT' },
    activeCategory === 'inquiry'
  )
  const { totalElements: inqIrs = 0, isLoading: lInq3 } = usePaginatedData(
    '/inquiries',
    { ...inqParams, belongType: 'IRS' },
    activeCategory === 'inquiry'
  )
  const { totalElements: inqXray = 0, isLoading: lInq4 } = usePaginatedData(
    '/inquiries',
    { ...inqParams, belongType: 'XRAY' },
    activeCategory === 'inquiry'
  )
  const inquiryTotal = inqHf + inqEq + inqIrs + inqXray
  const inqLoading = lInq1 || lInq2 || lInq3 || lInq4

  // Yuklanish holati
  const isDataLoading = useMemo(() => {
    switch (activeCategory) {
      case 'hf':
        return hfLoading
      case 'risk':
        return riskLoading
      case 'inspection':
        return inspLoading
      case 'inquiry':
        return inqLoading
      default:
        return false
    }
  }, [activeCategory, hfLoading, riskLoading, inspLoading, inqLoading])

  // Statistikalar
  const currentStats = useMemo(() => {
    switch (activeCategory) {
      case 'hf':
        return {
          totalLabel: 'Amaldagi XICHOlar',
          total: stats.hf.active,
          items: [
            { label: '1-tip', value: hfType1, color: '#0B626B' },
            { label: '2-tip', value: hfType2, color: '#2563EB' },
            { label: '3-tip', value: hfType3, color: '#7C3AED' },
          ],
        }
      case 'equipment':
        return {
          totalLabel: 'Amaldagi qurilmalar',
          total: stats.equipment.active,
          items: [
            { label: 'Muddati o\u2019tgan', value: stats.equipment.expired, color: '#D97706' },
            { label: 'Muddati kiritilmaganlar', value: stats.equipment.noDate, color: '#64748B' },
            { label: 'Jami', value: stats.equipment.total, color: '#0D9488' },
          ],
        }
      case 'irs':
        return {
          totalLabel: 'Amaldagi INMlar',
          total: stats.irs.active,
          items: [
            { label: 'Yaroqli', value: stats.irs.active, color: '#0D9488' },
            { label: 'Yaroqsiz', value: stats.irs.inactive, color: '#E11D48' },
            { label: 'Umumiy', value: stats.irs.total, color: '#2563EB' },
          ],
        }
      case 'xray':
        return {
          totalLabel: 'Amaldagi rentgenlar',
          total: stats.xray.active,
          items: [
            { label: 'Muddati o\u2019tgan', value: stats.xray.expired, color: '#D97706' },
            { label: 'Muddati kiritilmaganlar', value: stats.xray.noDate, color: '#64748B' },
            { label: 'Jami', value: stats.xray.total, color: '#0D9488' },
          ],
        }
      case 'risk':
        return {
          totalLabel: 'Xavf tahlili natijasi',
          total: riskTotal,
          items: [
            { label: 'Xavfi past', value: riskStats.lowRisk, color: '#0D9488' },
            { label: 'Xavfi o\u2018rta', value: riskStats.mediumRisk, color: '#D97706' },
            { label: 'Xavfi yuqori', value: riskStats.highRisk, color: '#E11D48' },
          ],
        }
      case 'inspection':
        return {
          totalLabel: 'Tekshiruvlar',
          total: inspectionTotal,
          items: [
            { label: 'Xavf tahlili asosida', value: inspRisk, color: '#0B626B' },
            { label: 'Boshqa tekshiruvlar', value: inspOther, color: '#2563EB' },
            { label: 'Jami', value: inspectionTotal, color: '#475569' },
          ],
        }
      case 'inquiry':
        return {
          totalLabel: 'Murojaatlar',
          total: inquiryTotal,
          items: [
            { label: 'XICHOlar', value: inqHf, color: '#0B626B' },
            { label: 'Qurilmalar', value: inqEq, color: '#2563EB' },
            { label: 'INMlar', value: inqIrs, color: '#D97706' },
            { label: 'Rentgenlar', value: inqXray, color: '#64748B' },
          ],
        }
      default:
        return { totalLabel: '', total: 0, items: [] }
    }
  }, [activeCategory, stats, hfType1, hfType2, hfType3, riskTotal, inspectionTotal, inquiryTotal])

  const activeCategoryLabel = CATEGORIES.find((c) => c.id === activeCategory)?.label ?? ''

  // Sahifa yuklangunga qadar loader
  if (!pageReady) {
    return <PageLoader />
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-slate-50 select-none">
      {/* Animatsiya uslublari */}
      <style>{`
        @keyframes is-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes is-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes is-scale-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .is-anim-fade-up {
          animation: is-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .is-anim-fade-in {
          animation: is-fade-in 0.6s ease both;
        }
        .is-anim-scale-in {
          animation: is-scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      {/* ── Sarlavha ── */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 lg:px-10 lg:py-4">
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Logo */}
          <div className="relative h-10 w-10 min-w-10 lg:h-12 lg:w-12 lg:min-w-12">
            <Icon name="logo" className="size-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-700 lg:text-xl">
              Sanoat radiatsiya va yadro xavfsizligi qo&#x2018;mitasi ekotizimi
            </h1>
            <p key={`subtitle-${transitionKey}`} className="is-anim-fade-in mt-0.5 text-xs text-slate-400 lg:text-sm">
              {SUBTITLES[activeCategory]}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <span className="text-2xl tracking-tight text-slate-600 tabular-nums lg:text-3xl">{formatUzTime(time)}</span>
          <span className="text-[10px] text-slate-400 lg:text-xs">{formatUzDate(time)}</span>
        </div>
      </header>

      {/* ── Kategoriya tablari ── */}
      <nav className="flex items-center justify-center gap-1 overflow-x-auto border-b border-slate-100 bg-white px-4 py-2 lg:gap-2 lg:px-6 lg:py-2.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 text-xs transition-all duration-300 lg:px-5 lg:py-2 lg:text-sm',
              activeCategory === cat.id
                ? 'bg-[#0B626B] text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-600'
            )}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* ── Asosiy qism ── */}
      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-4 lg:gap-5 lg:p-6">
        {/* Xarita */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Hudud nomi */}
          <div
            key={`region-label-${activeRegion}-${transitionKey}`}
            className="is-anim-fade-up absolute top-4 left-5 z-20 lg:top-6 lg:left-8"
          >
            <h2 className="text-lg font-semibold text-slate-700 lg:text-2xl">
              {activeRegion || 'Respublika bo‘yicha'}
            </h2>
            <p className="mt-0.5 text-[10px] text-slate-400 lg:mt-1 lg:text-xs">
              Batafsil ma&#x2018;lumot uchun hududni tanlang
            </p>
          </div>

          {/* Faol bo'lim badge & Filters */}
          <div
            key={`cat-badge-${transitionKey}`}
            className="absolute top-4 right-5 z-20 flex items-center gap-2 lg:top-6 lg:right-8"
          >
            {['risk', 'inspection'].includes(activeCategory) && (
              <div className="is-anim-scale-in flex items-center gap-2">
                <Select value={filterYear.toString()} onValueChange={(val) => setFilterYear(Number(val))}>
                  <SelectTrigger className="h-8 w-[80px] border-slate-200 bg-white !text-xs text-slate-600 focus:ring-0 focus:ring-offset-0 lg:h-9 lg:w-[100px] lg:!text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterQuarter.toString()} onValueChange={(val) => setFilterQuarter(Number(val))}>
                  <SelectTrigger className="h-8 w-[100px] border-slate-200 bg-white !text-xs text-slate-600 focus:ring-0 focus:ring-offset-0 lg:h-9 lg:w-[120px] lg:!text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1-chorak</SelectItem>
                    <SelectItem value="2">2-chorak</SelectItem>
                    <SelectItem value="3">3-chorak</SelectItem>
                    <SelectItem value="4">4-chorak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="is-anim-scale-in flex items-center gap-1.5 rounded-lg border border-[#0B626B]/10 bg-[#0B626B]/5 px-3 py-1 lg:gap-2 lg:px-4 lg:py-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0B626B]" />
              <span className="text-[10px] text-[#0B626B] lg:text-xs">{activeCategoryLabel}</span>
            </div>
          </div>

          {/* Xarita */}
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#0B626B]/40" />
              </div>
            }
          >
            <div className="h-[90%] w-[85%]">
              <UzbekistanMap
                activeRegionId={activeRegion}
                onRegionClick={handleRegionClick}
                className="h-full w-full"
              />
            </div>
          </Suspense>

          {/* Bekor qilish */}
          {activeRegion && (
            <button
              onClick={() => setActiveRegion(null)}
              className="is-anim-scale-in absolute right-5 bottom-4 z-20 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[10px] text-slate-500 shadow-sm transition-colors hover:bg-slate-50 lg:right-8 lg:bottom-5 lg:px-4 lg:py-1.5 lg:text-xs"
            >
              Barchasini ko&#x2018;rsatish
            </button>
          )}
        </div>

        {/* ── Statistika ── */}
        <div
          key={`stats-row-${transitionKey}`}
          className="flex shrink-0 flex-col gap-4 sm:h-36 sm:flex-row sm:gap-5 lg:h-40"
        >
          {/* JAMI — Amaldagilar */}
          <div className="is-anim-fade-up relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0B626B] p-5 sm:w-56 lg:w-72 lg:p-6">
            <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-white/5 lg:h-28 lg:w-28" />
            <span className="text-[10px] tracking-[0.15em] text-white/50 uppercase lg:text-[11px] lg:tracking-[0.2em]">
              Jami
            </span>
            <AnimatedNumber
              value={currentStats.total}
              isLoading={isDataLoading}
              className="text-4xl tracking-tight text-white tabular-nums lg:text-5xl"
            />
            <span className="text-[9px] tracking-wider text-white/40 lg:text-[10px]">{currentStats.totalLabel}</span>
          </div>

          {/* Sub-kartochkalar */}
          {currentStats.items.map((item, idx) => {
            const pct = currentStats.total > 0 ? Math.min(100, (item.value / currentStats.total) * 100) : 0
            return (
              <div
                key={idx}
                className="is-anim-fade-up flex flex-1 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 lg:p-6"
                style={{ animationDelay: `${(idx + 1) * 80}ms` }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] tracking-wider text-slate-400 uppercase lg:text-[11px]">
                    {item.label}
                  </span>
                </div>
                <AnimatedNumber
                  value={item.value}
                  isLoading={isDataLoading}
                  className="text-3xl tracking-tight tabular-nums lg:text-4xl"
                  style={{ color: item.color }}
                />
                <ProgressBar percent={pct} color={item.color} isLoading={isDataLoading} />
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
