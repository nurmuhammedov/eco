/**
 * Turns the source region GeoJSON into the shape the Yandex map wants.
 *
 * Three things change. Coordinates are swapped to [lat, lng] - the Yandex API
 * reads them that way round, and feeding it GeoJSON order silently places the
 * country somewhere north of Norway. Rings are simplified, because six thousand
 * vertices is far more than a country outline needs at the zooms this map uses.
 * MultiPolygon is split into one feature per part, which is all ObjectManager
 * understands.
 *
 * Run with: node scripts/build-uz-borders.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(here, '../src/shared/assets/uz-regions.json')
const TARGET = resolve(here, '../src/shared/assets/uz-borders.json')

/**
 * Douglas-Peucker tolerance in degrees. At 0.002 the largest deviation is about
 * 1.5 screen pixels at zoom 10, past which the outline is mostly off-screen
 * anyway - it halves the vertex count for no visible difference.
 */
const TOLERANCE = 0.002

/** Four decimals is roughly 11 metres, well under one pixel at any zoom used here. */
const PRECISION = 4

const perpendicular = (point, start, end) => {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const lengthSq = dx * dx + dy * dy
  if (!lengthSq) return Math.hypot(point[0] - start[0], point[1] - start[1])

  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSq))

  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy))
}

const simplify = (points, tolerance) => {
  if (points.length < 3) return points

  let furthest = 0
  let distance = 0
  for (let i = 1; i < points.length - 1; i++) {
    const current = perpendicular(points[i], points[0], points[points.length - 1])
    if (current > distance) {
      distance = current
      furthest = i
    }
  }

  if (distance <= tolerance) return [points[0], points[points.length - 1]]

  const left = simplify(points.slice(0, furthest + 1), tolerance)
  const right = simplify(points.slice(furthest), tolerance)

  return left.slice(0, -1).concat(right)
}

const toYandexRing = (ring) =>
  simplify(ring, TOLERANCE).map(([lng, lat]) => [+lat.toFixed(PRECISION), +lng.toFixed(PRECISION)])

const source = JSON.parse(readFileSync(SOURCE, 'utf8'))

const features = source.features.flatMap((feature, index) => {
  const { type, coordinates } = feature.geometry
  const parts = type === 'Polygon' ? [coordinates] : coordinates

  return parts.map((rings, part) => ({
    type: 'Feature',
    id: `${feature.properties.id ?? index}-${part}`,
    geometry: { type: 'Polygon', coordinates: rings.map(toYandexRing) },
  }))
})

writeFileSync(TARGET, JSON.stringify({ type: 'FeatureCollection', features }))

const vertices = features.reduce(
  (total, feature) => total + feature.geometry.coordinates.reduce((sum, ring) => sum + ring.length, 0),
  0
)
console.log(`${features.length} features, ${vertices} vertices -> ${TARGET}`)
