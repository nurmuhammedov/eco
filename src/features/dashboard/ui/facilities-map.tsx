import { ComponentProps, useCallback, useMemo, useRef, useState } from 'react'
import { Map as YMap, ObjectManager, YMaps } from '@pbe/react-yandex-maps'
import { useData } from '@/shared/hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'
import borders from '@/shared/assets/uz-borders.json'
import { FacilityLocation } from '../model/facility-location'
import { FacilityPanel } from './facility-panel'
import { RISK_FILTERS, RiskKey, facilityIconOptions, riskKeyOf } from '../model/map-icons'
import { UNKNOWN_REGION, buildRegionStats } from '../model/region-stats'
import { MapFilters } from './map-filters'
import { RegionStatsPanel } from './region-stats-panel'
import { useRegionSelectQueries } from '@/shared/api/dictionaries'

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

const boundsOf = (points: [number, number][]) =>
  points.reduce(
    ([[south, west], [north, east]], [lat, lng]) => [
      [Math.min(south, lat), Math.min(west, lng)],
      [Math.max(north, lat), Math.max(east, lng)],
    ],
    [
      [90, 180],
      [-90, -180],
    ]
  )

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char)

/**
 * A single point has no extent, and fitting to it zooms all the way in; the
 * padding gives a lone facility a neighbourhood to sit in.
 */
const padBounds = ([[south, west], [north, east]]: number[][]) => {
  const pad = 0.05

  return [
    [south - pad, west - pad],
    [north + pad, east + pad],
  ]
}

/**
 * The right-hand rail covers the corner Yandex puts its controls in. Floating
 * them left hands the whole arrangement back to the API instead of pinning each
 * one to a pixel that a different map size would get wrong.
 */
const moveControlsLeft = (map: any) => {
  for (const name of ['fullscreenControl', 'trafficControl', 'typeSelector', 'rulerControl']) {
    map.controls.get(name)?.options.set({ float: 'left', position: null })
  }
}

export const FacilitiesMap = () => {
  const { data, isLoading } = useData<FacilityLocation[]>('/hf/locations')

  // Everything is shown until a level is switched off, so the map opens the
  // same way it always did.
  const [activeRisks, setActiveRisks] = useState<RiskKey[]>(() => RISK_FILTERS.map((item) => item.key))
  const [regionId, setRegionId] = useState('')
  const { data: regions, isLoading: regionsLoading } = useRegionSelectQueries()

  // A cluster the map cannot pull apart opens as a list; a single pin skips
  // straight to the detail. Both live in the same panel.
  const [groupIds, setGroupIds] = useState<string[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const mapRef = useRef<any>(null)
  const managerRef = useRef<any>(null)

  const bindMap = useCallback((instance: any) => {
    if (!instance || mapRef.current === instance) return
    mapRef.current = instance
    moveControlsLeft(instance)
  }, [])

  const byId = useMemo(() => new Map((Array.isArray(data) ? data : []).map((item) => [item.id, item])), [data])

  // A facility without usable coordinates never reaches the map, so it is left
  // out of the counts too - a legend that promises more than it draws is worse
  // than no legend.
  const placed = useMemo(
    () =>
      (Array.isArray(data) ? data : []).flatMap((facility) => {
        const coords = parseCoords(facility.location)

        return coords ? [{ facility, coords }] : []
      }),
    [data]
  )

  const regionStats = useMemo(
    () =>
      buildRegionStats(
        placed.map(({ facility }) => facility),
        (regions ?? []) as { id: number; name: string }[]
      ),
    [placed, regions]
  )

  const inRegion = useMemo(() => {
    if (!regionId) return placed

    const known = new Set(regionStats.filter((stat) => stat.id !== UNKNOWN_REGION).map((stat) => stat.id))

    return placed.filter(({ facility }) =>
      regionId === UNKNOWN_REGION ? !known.has(String(facility.regionId)) : String(facility.regionId) === regionId
    )
  }, [placed, regionId, regionStats])

  /**
   * Counted before the risk filter is applied, so a level switched off still
   * says how much it is hiding; counted after the region one, so the numbers
   * describe what the map is showing.
   */
  const counts = useMemo(() => {
    const totals: Record<RiskKey, number> = { HIGH: 0, MEDIUM: 0, LOW: 0, NONE: 0 }

    for (const { facility } of inRegion) totals[riskKeyOf(facility)] += 1

    return totals
  }, [inRegion])

  /**
   * Six thousand placemarks as React children lock the tab - clustering does
   * not help, because every one is still a mounted component. ObjectManager
   * takes the whole set as plain data and does its own clustering inside the
   * map, so nothing but the map itself is rendered by React.
   */
  const features = useMemo(
    () =>
      inRegion
        .filter(({ facility }) => activeRisks.includes(riskKeyOf(facility)))
        .map(({ facility, coords }) => ({
          type: 'Feature',
          id: facility.id,
          geometry: { type: 'Point', coordinates: coords },
          properties: { hintContent: escapeHtml(facility.name?.trim() ?? '') },
          options: facilityIconOptions(facility),
        })),
    [inRegion, activeRisks]
  )

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
        .setBounds(
          boundsOf(
            objects.map((object: { geometry: { coordinates: [number, number] } }) => object.geometry.coordinates)
          ),
          { checkZoomRange: true, zoomMargin: 64, duration: 300 }
        )
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

  // The panel is opened from a marker; hiding that marker has to close it, or
  // the card outlives what it describes.
  const applyFilter = (change: () => void) => {
    closePanel()
    change()
  }

  /**
   * Picking a region does more than filter: the map travels there, which is the
   * part that makes the rail worth clicking. Clearing it returns to the country
   * view rather than leaving the camera in the last region.
   */
  const selectRegion = (id: string) => {
    applyFilter(() => setRegionId(id))

    const points = id
      ? placed.filter(({ facility }) => String(facility.regionId) === id).map(({ coords }) => coords)
      : []

    mapRef.current?.setBounds(points.length > 0 ? padBounds(boundsOf(points)) : COUNTRY_BOUNDS, {
      checkZoomRange: true,
      duration: 400,
    })
  }

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

      {placed.length === 0 ? (
        <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
          Koordinatasi ko‘rsatilgan obyekt topilmadi
        </div>
      ) : (
        <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-xl border border-neutral-200">
          <YMaps query={MAP_QUERY}>
            <YMap
              instanceRef={bindMap}
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
                /**
                 * The pie layout paints the ring from the colours its own
                 * objects carry, so a circle standing for a thousand facilities
                 * shows at a glance how much of it is high risk - without
                 * opening anything. Without the balloon addon a cluster balloon
                 * has nothing to render, and clicking one opened a white box.
                 */
                clusters={{
                  clusterIconLayout: 'default#pieChart',
                  clusterIconPieChartRadius: 22,
                  clusterIconPieChartCoreRadius: 14,
                  clusterIconPieChartStrokeWidth: 2,
                  hasBalloon: false,
                }}
                modules={['objectManager.addon.objectsHint']}
              />
            </YMap>
          </YMaps>

          {features.length === 0 && (
            <p
              role="status"
              className="pointer-events-none absolute inset-x-4 top-1/2 z-10 mx-auto w-fit -translate-y-1/2 rounded-lg bg-white/95 px-4 py-2 text-sm text-neutral-600 shadow-sm backdrop-blur-sm md:right-[21rem]"
            >
              Tanlangan filtrga mos obyekt topilmadi
            </p>
          )}

          <MapFilters
            counts={counts}
            active={activeRisks}
            onToggle={(key) =>
              applyFilter(() =>
                setActiveRisks((current) =>
                  current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
                )
              )
            }
            onReset={() => applyFilter(() => setActiveRisks(RISK_FILTERS.map((item) => item.key)))}
          />

          <RegionStatsPanel
            stats={regionStats}
            selected={regionId}
            onSelect={selectRegion}
            isLoading={regionsLoading}
          />

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
