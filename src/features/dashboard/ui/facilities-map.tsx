import { ComponentProps, useCallback, useMemo, useRef, useState } from 'react'
import { Map as YMap, ObjectManager, YMaps } from '@pbe/react-yandex-maps'
import { useData } from '@/shared/hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'
import borders from '@/shared/assets/uz-borders.json'
import { FacilityLocation, RISK_STYLE, STATUS_STYLE, markerColor } from '../model/facility-location'
import { FacilityPanel } from './facility-panel'

/**
 * The library's types predate uz_UZ, which the Yandex API itself accepts - the
 * cast is narrowed to this one value rather than silencing the whole element.
 */
const MAP_QUERY = { load: 'package.full', lang: 'uz_UZ' } as unknown as ComponentProps<typeof YMaps>['query']

/**
 * Fitting to the outline beats a hand-picked centre and zoom: the country fills
 * whatever the viewport happens to be, on a laptop and on a 5K screen alike.
 */
const COUNTRY_BOUNDS = (() => {
  const [[minLat, minLng], [maxLat, maxLng]] = borders.features
    .flatMap((feature) => feature.geometry.coordinates.flat())
    .reduce(
      ([[south, west], [north, east]], [lat, lng]) => [
        [Math.min(south, lat), Math.min(west, lng)],
        [Math.max(north, lat), Math.max(east, lng)],
      ],
      [
        [90, 180],
        [-90, -180],
      ]
    )

  // An exact fit puts the outline flush against the frame; a little slack keeps
  // edge markers and their hints inside the map.
  const padLat = (maxLat - minLat) * 0.04
  const padLng = (maxLng - minLng) * 0.04

  return [
    [minLat - padLat, minLng - padLng],
    [maxLat + padLat, maxLng + padLng],
  ]
})()

/**
 * The outline is drawn from the region file already in the repo rather than the
 * Yandex borders service, which needs a paid key. Transparent interactivity is
 * what keeps a polygon from swallowing the click meant for a marker sitting on
 * top of it.
 */
const BORDER_OPTIONS = {
  fillColor: '#2563eb14',
  strokeColor: '#2563ebbf',
  strokeWidth: 1.5,
  interactivityModel: 'default#transparent',
}

const MAP_CONTROLS = [
  'fullscreenControl',
  'geolocationControl',
  'rulerControl',
  'trafficControl',
  'typeSelector',
  'zoomControl',
]

const parseCoords = (raw: string): [number, number] | null => {
  const parts = raw?.split(',').map((part) => Number(part.trim()))
  if (!parts || parts.length < 2 || parts.some(Number.isNaN)) return null

  return [parts[0], parts[1]]
}

const boundsOf = (objects: { geometry: { coordinates: [number, number] } }[]) =>
  objects.reduce(
    ([[south, west], [north, east]], { geometry }) => [
      [Math.min(south, geometry.coordinates[0]), Math.min(west, geometry.coordinates[1])],
      [Math.max(north, geometry.coordinates[0]), Math.max(east, geometry.coordinates[1])],
    ],
    [
      [90, 180],
      [-90, -180],
    ]
  )

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char)

const LEGEND = [
  { color: RISK_STYLE.HIGH.color, label: RISK_STYLE.HIGH.label },
  { color: RISK_STYLE.MEDIUM.color, label: RISK_STYLE.MEDIUM.label },
  { color: RISK_STYLE.LOW.color, label: RISK_STYLE.LOW.label },
  { color: STATUS_STYLE.VALID.color, label: 'Tahlil qilinmagan' },
]

export const FacilitiesMap = () => {
  const { data, isLoading } = useData<FacilityLocation[]>('/hf/locations')
  // A cluster the map cannot pull apart opens as a list; a single pin skips
  // straight to the detail. Both live in the same panel.
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const mapRef = useRef<any>(null)
  const managerRef = useRef<any>(null)

  const byId = useMemo(() => new Map((Array.isArray(data) ? data : []).map((item) => [item.id, item])), [data])

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
          properties: { hintContent: escapeHtml(facility.name?.trim() ?? '') },
          options: { preset: 'islands#circleIcon', iconColor: markerColor(facility) },
        },
      ]
    })
  }, [data])

  // instanceRef fires again on every re-render; binding twice would open the
  // card twice per click.
  const bindManager = useCallback((instance: any) => {
    if (!instance || managerRef.current === instance) return
    managerRef.current = instance

    instance.objects.events.add('click', (event: any) => {
      const id = String(event.get('objectId'))
      setGroupIds([id])
      setFocusedId(id)
    })

    /**
     * The built-in cluster zoom fits its objects exactly, which parks them on
     * the frame edge half cut off. Same idea, with room to breathe - and when
     * the zoom cannot go any further, the objects are listed instead, so a
     * cluster of facilities sharing one address is never a dead end.
     */
    instance.clusters.events.add('click', (event: any) => {
      const cluster = instance.clusters.getById(event.get('objectId'))
      const map = mapRef.current
      if (!cluster || !map) return

      const objects = cluster.properties.geoObjects
      const before = map.getZoom()

      map
        .setBounds(boundsOf(objects), { checkZoomRange: true, zoomMargin: 64, duration: 300 })
        .then(() => {
          if (map.getZoom() !== before) return

          setGroupIds(objects.map((object: { id: string }) => String(object.id)))
          setFocusedId(null)
        })
        .catch(() => undefined)
    })
  }, [])

  const group = useMemo(
    () => groupIds.map((id) => byId.get(id)).filter((item): item is FacilityLocation => !!item),
    [groupIds, byId]
  )
  const focused = focusedId ? (byId.get(focusedId) ?? null) : null

  const closePanel = useCallback(() => {
    setGroupIds([])
    setFocusedId(null)
  }, [])

  if (isLoading) {
    return (
      <section aria-busy="true" className="h-full">
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
        <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
          Koordinatasi ko‘rsatilgan obyekt topilmadi
        </div>
      ) : (
        <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-neutral-200">
          <YMaps query={MAP_QUERY}>
            <YMap
              instanceRef={mapRef}
              // Yandex's default set minus searchControl - the address search
              // runs on the paid geocoder and only ever answers with an error.
              defaultState={{ bounds: COUNTRY_BOUNDS, controls: MAP_CONTROLS }}
              width="100%"
              height="100%"
              // Whole zoom levels round the fit down, leaving the country adrift
              // in a wide gap; fractional zoom lets it meet the edges.
              options={{ suppressMapOpenBlock: true, avoidFractionalZoom: false }}
            >
              <ObjectManager features={borders.features} objects={BORDER_OPTIONS} />
              <ObjectManager
                instanceRef={bindManager}
                features={features}
                clusterize
                options={{ clusterize: true, gridSize: 64 }}
                objects={{ preset: 'islands#circleIcon' }}
                // Without the balloon addon a cluster balloon has nothing to
                // render, and clicking one opened an empty white box.
                clusters={{ preset: 'islands#invertedDarkGreenClusterIcons', hasBalloon: false }}
                modules={['objectManager.addon.objectsHint']}
              />
            </YMap>
          </YMaps>

          <ul className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-x-4 gap-y-1.5 rounded-xl border border-neutral-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
            {LEGEND.map((item) => (
              <li key={item.label} className="flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </li>
            ))}
          </ul>

          {group.length > 0 && (
            <FacilityPanel
              facilities={group}
              focused={focused}
              onSelect={setFocusedId}
              onBack={() => setFocusedId(null)}
              onClose={closePanel}
            />
          )}
        </div>
      )}
    </section>
  )
}
