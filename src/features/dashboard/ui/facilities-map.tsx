import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Map as YMap, ObjectManager, YMaps } from '@pbe/react-yandex-maps'
import { useData } from '@/shared/hooks'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  BORDER_OPTIONS,
  COUNTRY_BOUNDS,
  MAP_QUERY,
  borders,
  boundsOf,
  escapeHtml,
  padBounds,
  parseCoords,
} from '../model/map-geometry'
import { FacilityLocation } from '../model/facility-location'
import { FacilityPanel } from './facility-panel'
import { pointIconOptions } from '../model/map-icons'
import {
  EquipmentLocation,
  MapLayerKey,
  MapPoint,
  bucketOf,
  isArchived,
  layerOf,
  toEquipmentPoint,
  toHfPoint,
} from '../model/map-layers'
import { UNKNOWN_REGION, buildRegionStats } from '../model/region-stats'
import { MapFilters } from './map-filters'
import { MapLayerSwitch } from './map-layer-switch'
import { RegionStatsPanel } from './region-stats-panel'
import { useRegionSelectQueries } from '@/shared/api/dictionaries'

const MAP_CONTROLS = [
  'fullscreenControl',
  'geolocationControl',
  'rulerControl',
  'trafficControl',
  'typeSelector',
  'zoomControl',
]

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

const asArray = <T,>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : [])

export const FacilitiesMap = () => {
  const [layerKey, setLayerKey] = useState<MapLayerKey>('HF')
  const layer = layerOf(layerKey)

  /**
   * Only the selected registry is fetched, but a query that has been switched
   * off keeps what it already loaded - so returning to a layer is instant and
   * its total stays on the switch.
   */
  const hf = useData<FacilityLocation[]>('/hf/locations', layerKey === 'HF')
  const cranes = useData<EquipmentLocation[]>('/equipments/cranes/locations', layerKey === 'CRANE')
  const attractions = useData<EquipmentLocation[]>('/equipments/attractions/locations', layerKey === 'ATTRACTION')

  const byLayer = useMemo(
    () => ({
      HF: asArray(hf.data).map(toHfPoint),
      CRANE: asArray(cranes.data).map(toEquipmentPoint('CRANE')),
      ATTRACTION: asArray(attractions.data).map(toEquipmentPoint('ATTRACTION')),
    }),
    [hf.data, cranes.data, attractions.data]
  )

  const data = byLayer[layerKey]
  const isLoading = { HF: hf.isLoading, CRANE: cranes.isLoading, ATTRACTION: attractions.isLoading }[layerKey]

  // The switch advertises the live registry, matching what the map draws on
  // arrival rather than the archive it hides.
  const layerCounts = useMemo(
    () =>
      Object.fromEntries(
        (Object.keys(byLayer) as MapLayerKey[]).map((key) => [
          key,
          byLayer[key].filter((point) => !isArchived(point)).length || undefined,
        ])
      ) as Partial<Record<MapLayerKey, number>>,
    [byLayer]
  )

  // Everything is shown until a level is switched off, so the map opens the
  // same way it always did.
  const [activeBuckets, setActiveBuckets] = useState<string[]>(() => layer.legend.map((item) => item.key))
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

  const byId = useMemo(() => new Map(data.map((item) => [item.id, item])), [data])

  // A point without usable coordinates never reaches the map, so it is left out
  // of the counts too - a legend that promises more than it draws is worse than
  // no legend.
  const mapped = useMemo(
    () =>
      data.flatMap((point) => {
        const coords = parseCoords(point.location)

        return coords ? [{ point, coords }] : []
      }),
    [data]
  )

  // The archive belongs to the archive module; the map only ever draws what is
  // still on the register.
  const placed = useMemo(() => mapped.filter(({ point }) => !isArchived(point)), [mapped])

  const regionStats = useMemo(
    () =>
      buildRegionStats(
        placed.map(({ point }) => point),
        (regions ?? []) as { id: number; name: string }[]
      ),
    [placed, regions]
  )

  const inRegion = useMemo(() => {
    if (!regionId) return placed

    const known = new Set(regionStats.filter((stat) => stat.id !== UNKNOWN_REGION).map((stat) => stat.id))

    return placed.filter(({ point }) =>
      regionId === UNKNOWN_REGION ? !known.has(String(point.regionId)) : String(point.regionId) === regionId
    )
  }, [placed, regionId, regionStats])

  /**
   * Counted before the legend filter is applied, so a level switched off still
   * says how much it is hiding; counted after the region one, so the numbers
   * describe what the map is showing.
   */
  const counts = useMemo(() => {
    const totals: Record<string, number> = {}

    for (const { point } of inRegion) {
      const bucket = bucketOf(point)
      totals[bucket] = (totals[bucket] ?? 0) + 1
    }

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
        .filter(({ point }) => activeBuckets.includes(bucketOf(point)))
        .map(({ point, coords }) => ({
          type: 'Feature',
          id: point.id,
          geometry: { type: 'Point', coordinates: coords },
          properties: { hintContent: escapeHtml(point.name?.trim() ?? '') },
          options: pointIconOptions(point),
        })),
    [inRegion, activeBuckets]
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
    () => groupIds.map((id) => byId.get(id)).filter((item): item is MapPoint => !!item),
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

  // Each registry carries its own legend, so the buckets held from the previous
  // one would hide everything.
  useEffect(() => {
    setActiveBuckets(layer.legend.map((item) => item.key))
    setRegionId('')
    closePanel()
  }, [layer, closePanel])

  /**
   * Picking a region does more than filter: the map travels there, which is the
   * part that makes the rail worth clicking. Clearing it returns to the country
   * view rather than leaving the camera in the last region.
   */
  const selectRegion = (id: string) => {
    applyFilter(() => setRegionId(id))

    const points = id ? placed.filter(({ point }) => String(point.regionId) === id).map(({ coords }) => coords) : []

    mapRef.current?.setBounds(points.length > 0 ? padBounds(boundsOf(points)) : COUNTRY_BOUNDS, {
      checkZoomRange: true,
      duration: 400,
    })
  }

  return (
    <section className="flex h-full min-h-0 flex-col">
      <h2 className="sr-only">{layer.heading}</h2>

      {isLoading ? (
        <div aria-busy="true" className="h-full">
          <p role="status" className="sr-only">
            Obyektlar xaritasi yuklanmoqda
          </p>
          <Skeleton className="h-full min-h-[420px] w-full rounded-xl" />
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
              {placed.length === 0 ? layer.empty : 'Tanlangan filtrga mos obyekt topilmadi'}
            </p>
          )}

          {/* One panel rather than two: the top-left corner belongs to Yandex's
              own controls, and a second floating card there covered them. */}
          <div className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white/95 shadow-sm backdrop-blur-sm md:max-w-[calc(100%-22rem)]">
            <MapLayerSwitch active={layerKey} counts={layerCounts} onSelect={setLayerKey} />

            <MapFilters
              legend={layer.legend}
              counts={counts}
              active={activeBuckets}
              onToggle={(key) =>
                applyFilter(() =>
                  setActiveBuckets((current) =>
                    current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
                  )
                )
              }
              onReset={() => applyFilter(() => setActiveBuckets(layer.legend.map((item) => item.key)))}
            />
          </div>

          <RegionStatsPanel
            stats={regionStats}
            legend={layer.legend}
            selected={regionId}
            onSelect={selectRegion}
            isLoading={regionsLoading}
          />

          {group.length > 0 && (
            <FacilityPanel
              points={group}
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
