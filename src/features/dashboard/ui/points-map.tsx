import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Map as YMap, ObjectManager, YMaps } from '@pbe/react-yandex-maps'
import { MapPoint } from '../model/map-layers'
import { pointIconOptions } from '../model/map-icons'
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

interface PointsMapProps {
  points: MapPoint[]
  /** Fits the camera to one region's points; null returns to the whole country. */
  focusRegionId?: number | null
}

const MAP_CONTROLS = ['zoomControl']

/**
 * The display-only half of the facilities map: the same markers and clustering
 * without the panels, filters or detail cards, for a screen nobody clicks.
 */
export const PointsMap = ({ points, focusRegionId = null }: PointsMapProps) => {
  const mapRef = useRef<any>(null)

  const placed = useMemo(
    () =>
      points.flatMap((point) => {
        const coords = parseCoords(point.location)

        return coords ? [{ point, coords }] : []
      }),
    [points]
  )

  const visible = useMemo(
    () => (focusRegionId === null ? placed : placed.filter(({ point }) => point.regionId === focusRegionId)),
    [placed, focusRegionId]
  )

  const features = useMemo(
    () =>
      visible.map(({ point, coords }) => ({
        type: 'Feature',
        id: point.id,
        geometry: { type: 'Point', coordinates: coords },
        properties: { hintContent: escapeHtml(point.name?.trim() ?? '') },
        options: pointIconOptions(point),
      })),
    [visible]
  )

  const bindMap = useCallback((instance: any) => {
    if (!instance || mapRef.current === instance) return
    mapRef.current = instance
  }, [])

  // Filtering alone leaves the camera on the whole country with a handful of
  // pins lost in it, so the map travels to whatever is left.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const coords = visible.map(({ coords: point }) => point)

    map.setBounds(coords.length > 0 ? padBounds(boundsOf(coords)) : COUNTRY_BOUNDS, {
      checkZoomRange: true,
      duration: 400,
    })
  }, [visible])

  return (
    <YMaps query={MAP_QUERY}>
      <YMap
        instanceRef={bindMap}
        defaultState={{ bounds: COUNTRY_BOUNDS, controls: MAP_CONTROLS }}
        width="100%"
        height="100%"
        // Whole zoom levels round the fit down, leaving the country adrift in a
        // wide gap; fractional zoom lets it meet the edges.
        options={{ suppressMapOpenBlock: true, avoidFractionalZoom: false }}
      >
        <ObjectManager features={borders.features} objects={BORDER_OPTIONS} />
        <ObjectManager
          features={features}
          clusterize
          options={{ clusterize: true, gridSize: 64 }}
          /**
           * The pie layout paints the ring from the colours its own objects
           * carry, so one circle standing for a thousand facilities still shows
           * how much of it is high risk.
           */
          clusters={{
            clusterIconLayout: 'default#pieChart',
            clusterIconPieChartRadius: 24,
            clusterIconPieChartCoreRadius: 15,
            clusterIconPieChartStrokeWidth: 2,
            hasBalloon: false,
          }}
          modules={['objectManager.addon.objectsHint']}
        />
      </YMap>
    </YMaps>
  )
}
