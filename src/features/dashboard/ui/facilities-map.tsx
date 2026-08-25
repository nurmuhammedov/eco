import { ComponentProps, useMemo } from 'react'
import { Map, ObjectManager, YMaps } from '@pbe/react-yandex-maps'
import { useData } from '@/shared/hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
type HfStatus = 'VALID' | 'INVALID' | 'INACTIVE'

interface FacilityLocation {
  id: string
  name: string
  legalTin: number
  legalName: string
  location: string
  registryNumber: string
  status: HfStatus
  /** Null until a daily risk analysis exists for the facility. */
  riskLevel: RiskLevel | null
}

/**
 * Colour carries the risk level, matching the cards on the same page so the two
 * read as one dataset. A facility with no analysis for the day is grey rather
 * than green - absent is not the same as safe.
 */
const RISK_STYLE: Record<string, { color: string; label: string }> = {
  LOW: { color: '#10b981', label: 'Xavfi past' },
  MEDIUM: { color: '#f59e0b', label: 'Xavfi o‘rta' },
  HIGH: { color: '#f43f5e', label: 'Xavfi yuqori' },
}

/** Falls back to the registry status while a facility has no analysis yet. */
const STATUS_STYLE: Record<HfStatus, string> = {
  VALID: '#0b626b',
  INVALID: '#94a3b8',
  INACTIVE: '#cbd5e1',
}

const markerColor = (facility: FacilityLocation) =>
  (facility.riskLevel && RISK_STYLE[facility.riskLevel]?.color) || STATUS_STYLE[facility.status] || '#94a3b8'

const STATUS_LABELS: Record<HfStatus, string> = {
  VALID: 'Amaldagi',
  INVALID: 'Amalda emas',
  INACTIVE: 'Reyestrdan chiqarilgan',
}

/**
 * The library's types predate uz_UZ, which the Yandex API itself accepts - the
 * cast is narrowed to this one value rather than silencing the whole element.
 */
const MAP_QUERY = { load: 'package.full', lang: 'uz_UZ' } as unknown as ComponentProps<typeof YMaps>['query']

/** Uzbekistan, wide enough to hold every region at once. */
const COUNTRY_CENTER = [41.75, 64.0]
const COUNTRY_ZOOM = 6

const parseCoords = (raw: string): [number, number] | null => {
  const parts = raw?.split(',').map((part) => Number(part.trim()))
  if (!parts || parts.length < 2 || parts.some(Number.isNaN)) return null

  return [parts[0], parts[1]]
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char)

const buildBalloon = (facility: FacilityLocation) => {
  const risk = facility.riskLevel ? RISK_STYLE[facility.riskLevel] : null
  const row = (label: string, value?: string | number | null) =>
    value ? `<div style="margin-top:4px"><b>${label}:</b> ${escapeHtml(String(value))}</div>` : ''

  return [
    `<div style="max-width:280px;font-size:13px;line-height:1.45">`,
    `<div style="font-weight:600;margin-bottom:2px">${escapeHtml(facility.name ?? '')}</div>`,
    row('Reyestr raqami', facility.registryNumber),
    row('Tashkilot', facility.legalName),
    row('STIR', facility.legalTin),
    row('Holati', STATUS_LABELS[facility.status]),
    risk ? `<div style="margin-top:6px;color:${risk.color};font-weight:600">${risk.label}</div>` : '',
    `</div>`,
  ].join('')
}

export const FacilitiesMap = () => {
  const { data, isLoading } = useData<FacilityLocation[]>('/hf/locations')

  /**
   * Six thousand placemarks as React children lock the tab - clustering does
   * not help, because every one is still a mounted component. ObjectManager
   * takes the whole set as plain data and does its own clustering inside the
   * map, so nothing but the map itself is rendered by React.
   */
  const features = useMemo(() => {
    const list = Array.isArray(data) ? data : []

    return list.flatMap((facility) => {
      const coords = parseCoords(facility.location)
      if (!coords) return []

      return [
        {
          type: 'Feature',
          id: facility.id,
          geometry: { type: 'Point', coordinates: coords },
          properties: {
            hintContent: facility.name,
            balloonContentHeader: escapeHtml(facility.name ?? ''),
            balloonContentBody: buildBalloon(facility),
          },
          options: { preset: 'islands#circleIcon', iconColor: markerColor(facility) },
        },
      ]
    })
  }, [data])

  if (isLoading) {
    return (
      <section aria-busy="true">
        <p role="status" className="sr-only">
          Obyektlar xaritasi yuklanmoqda
        </p>
        <Skeleton className="h-full min-h-[420px] w-full rounded-xl" />
      </section>
    )
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <h2 className="sr-only">Xavfli ishlab chiqarish obyektlari xaritasi</h2>

      {features.length === 0 ? (
        <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
          Koordinatasi ko‘rsatilgan obyekt topilmadi
        </div>
      ) : (
        <div className="min-h-[420px] flex-1 overflow-hidden rounded-xl border border-slate-200">
          <YMaps query={MAP_QUERY}>
            <Map
              defaultState={{ center: COUNTRY_CENTER, zoom: COUNTRY_ZOOM }}
              width="100%"
              height="100%"
              options={{ suppressMapOpenBlock: true }}
            >
              <ObjectManager
                features={features}
                clusterize
                options={{ clusterize: true, gridSize: 64 }}
                objects={{ openBalloonOnClick: true, preset: 'islands#circleIcon' }}
                clusters={{ preset: 'islands#invertedDarkGreenClusterIcons' }}
                modules={['objectManager.addon.objectsBalloon', 'objectManager.addon.objectsHint']}
              />
            </Map>
          </YMaps>
        </div>
      )}
    </section>
  )
}
