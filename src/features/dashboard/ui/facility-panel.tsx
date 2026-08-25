import { PointerEvent as ReactPointerEvent, ReactNode, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ChevronRight, X } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { FacilityLocation, RISK_STYLE, STATUS_STYLE, markerColor } from '../model/facility-location'

interface FacilityDetail {
  address: string | null
  regionName: string | null
  districtName: string | null
  registrationDate: string | null
  hazardousSubstance: string | null
  categoryName: string | null
  hfTypeName: string | null
  inspectorName: string | null
  managerCount: number | null
  engineerCount: number | null
  workerCount: number | null
}

const STATUS_VARIANT = {
  VALID: 'success',
  INVALID: 'warning',
  INACTIVE: 'error',
} as const

const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(0, max))

interface Placement {
  x: number
  y: number
  width: number
}

/**
 * Lets the panel be pushed aside when it covers the pin the user is reading
 * about. Position is kept in pixels against the map container and clamped to
 * it, so the panel cannot be dragged out of the layout.
 */
const useDraggable = () => {
  const ref = useRef<HTMLElement>(null)
  const [placement, setPlacement] = useState<Placement | null>(null)
  const origin = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null)

  const container = () => {
    const panel = ref.current
    const parent = panel?.offsetParent as HTMLElement | null

    return panel && parent ? { panel, parent } : null
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // The header carries the close and back buttons; a press on those is not a drag.
    if ((event.target as HTMLElement).closest('button')) return

    const box = container()
    if (!box) return

    const rect = box.panel.getBoundingClientRect()
    const bounds = box.parent.getBoundingClientRect()

    origin.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: rect.left - bounds.left,
      y: rect.top - bounds.top,
    }
    setPlacement({ x: rect.left - bounds.left, y: rect.top - bounds.top, width: rect.width })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = origin.current
    const box = container()
    if (!start || !box) return

    setPlacement({
      x: clamp(start.x + event.clientX - start.pointerX, box.parent.clientWidth - box.panel.offsetWidth),
      y: clamp(start.y + event.clientY - start.pointerY, box.parent.clientHeight - box.panel.offsetHeight),
      width: box.panel.offsetWidth,
    })
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    origin.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return {
    ref,
    style: placement
      ? { left: placement.x, top: placement.y, width: placement.width, right: 'auto', bottom: 'auto' }
      : undefined,
    handleProps: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  }
}

/**
 * Replaces the map's own balloon, whose content is an HTML string and cannot
 * carry the app's components, loading states or links. Sits clear of the map
 * controls in the corner, and can be dragged anywhere inside the map.
 */
const Shell = ({
  title,
  subtitle,
  accent,
  onBack,
  onClose,
  children,
}: {
  title: string
  subtitle?: ReactNode
  accent?: string
  onBack?: () => void
  onClose: () => void
  children: ReactNode
}) => {
  const { ref, style, handleProps } = useDraggable()

  return (
    <aside
      ref={ref}
      style={style}
      className="absolute right-4 bottom-4 left-4 z-10 flex max-h-[70%] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white/95 shadow-xl ring-1 ring-black/5 backdrop-blur-sm sm:top-16 sm:bottom-auto sm:left-auto sm:w-[360px]"
      aria-label="Obyekt ma’lumotlari"
    >
      {accent && <div className="h-1 w-full shrink-0" style={{ backgroundColor: accent }} />}

      <div
        {...handleProps}
        className="flex shrink-0 cursor-grab touch-none items-start gap-2 px-4 pt-3.5 pb-3 select-none active:cursor-grabbing"
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Orqaga</span>
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] leading-snug font-semibold text-neutral-900">{title}</h3>
          {subtitle}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="-mt-1 -mr-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <X className="size-4" />
          <span className="sr-only">Yopish</span>
        </button>
      </div>

      {children}
    </aside>
  )
}

const Row = ({ label, value }: { label: string; value?: string | number | null }) =>
  value ? (
    <div className="min-w-0">
      <dt className="text-[11px] tracking-wide text-neutral-500 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm break-words text-neutral-900">{value}</dd>
    </div>
  ) : null

const FacilityDetailView = ({
  facility,
  onBack,
  onClose,
}: {
  facility: FacilityLocation
  onBack?: () => void
  onClose: () => void
}) => {
  const { data: detail, isLoading } = useData<FacilityDetail>(`/hf/${facility.id}`, !!facility.id)

  const risk = facility.riskLevel ? RISK_STYLE[facility.riskLevel] : null
  const staff = [detail?.managerCount, detail?.engineerCount, detail?.workerCount]
  const staffTotal = staff.reduce<number>((total, count) => total + (count ?? 0), 0)

  return (
    <Shell
      title={facility.name?.trim()}
      subtitle={<p className="mt-1 font-mono text-xs text-neutral-500">{facility.registryNumber}</p>}
      accent={markerColor(facility)}
      onBack={onBack}
      onClose={onClose}
    >
      <div className="flex shrink-0 flex-wrap gap-1.5 px-4 pb-3">
        <Badge variant={STATUS_VARIANT[facility.status] ?? 'secondary'}>{STATUS_STYLE[facility.status]?.label}</Badge>
        {risk && (
          <Badge variant="outline" className="border-current/25" style={{ color: risk.color }}>
            {risk.label}
          </Badge>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-neutral-100 px-4 py-3.5">
        {isLoading ? (
          <div className="space-y-3">
            {[70, 90, 55, 80].map((width) => (
              <div key={width} className="space-y-1.5">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-3.5" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        ) : (
          <dl className="space-y-3">
            <Row label="Tashkilot" value={facility.legalName?.trim()} />
            <Row label="STIR" value={facility.legalTin} />
            <Row
              label="Manzil"
              value={[detail?.regionName, detail?.districtName, detail?.address].filter(Boolean).join(', ')}
            />
            <Row label="Ro‘yxatga olingan" value={detail?.registrationDate ? getDate(detail.registrationDate) : null} />
            <Row label="Xavfli modda" value={detail?.hazardousSubstance} />
            <Row label="Toifasi" value={detail?.categoryName} />
            <Row label="Inspektor" value={detail?.inspectorName} />
            <Row label="Xodimlar" value={staffTotal || null} />
          </dl>
        )}
      </div>

      <Link
        to={`/register/${facility.id}/hf`}
        className="text-primary flex shrink-0 items-center justify-center gap-1.5 border-t border-neutral-100 py-3 text-sm font-medium transition-colors hover:bg-neutral-50"
      >
        Batafsil ko‘rish
        <ArrowUpRight className="size-4" />
      </Link>
    </Shell>
  )
}

/**
 * Some facilities sit on the same spot, or close enough that no zoom level
 * separates them. Rather than a cluster that refuses to open, the panel lists
 * what is under the pin and lets one be picked.
 */
const FacilityListView = ({
  facilities,
  onSelect,
  onClose,
}: {
  facilities: FacilityLocation[]
  onSelect: (id: string) => void
  onClose: () => void
}) => (
  <Shell
    title="Shu joydagi obyektlar"
    subtitle={<p className="mt-1 text-xs text-neutral-500">{facilities.length} ta obyekt</p>}
    onClose={onClose}
  >
    <ul className="min-h-0 flex-1 divide-y divide-neutral-100 overflow-y-auto border-t border-neutral-100">
      {facilities.map((facility) => (
        <li key={facility.id}>
          <button
            type="button"
            onClick={() => onSelect(facility.id)}
            className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-2.5 text-left transition-colors hover:bg-neutral-50"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: markerColor(facility) }}
              aria-hidden
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-neutral-900">{facility.name?.trim()}</span>
              <span className="mt-0.5 block truncate font-mono text-[11px] text-neutral-500">
                {facility.registryNumber}
              </span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-neutral-400" />
          </button>
        </li>
      ))}
    </ul>
  </Shell>
)

interface FacilityPanelProps {
  facilities: FacilityLocation[]
  focused: FacilityLocation | null
  onSelect: (id: string) => void
  onBack: () => void
  onClose: () => void
}

export const FacilityPanel = ({ facilities, focused, onSelect, onBack, onClose }: FacilityPanelProps) => {
  if (focused) {
    return (
      <FacilityDetailView facility={focused} onBack={facilities.length > 1 ? onBack : undefined} onClose={onClose} />
    )
  }

  return <FacilityListView facilities={facilities} onSelect={onSelect} onClose={onClose} />
}
