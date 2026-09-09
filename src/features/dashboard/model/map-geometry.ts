import { ComponentProps } from 'react'
import { YMaps } from '@pbe/react-yandex-maps'
import borders from '@/shared/assets/uz-borders.json'

/**
 * The library's types predate uz_UZ, which the Yandex API itself accepts - the
 * cast is narrowed to this one value rather than silencing the whole element.
 */
export const MAP_QUERY = { load: 'package.full', lang: 'uz_UZ' } as unknown as ComponentProps<typeof YMaps>['query']

/**
 * Fitting to the outline beats a hand-picked centre and zoom: the country fills
 * whatever the viewport happens to be, on a laptop and on a 5K screen alike.
 */
export const COUNTRY_BOUNDS = (() => {
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
export const BORDER_OPTIONS = {
  fillColor: '#2563eb14',
  strokeColor: '#2563ebbf',
  strokeWidth: 1.5,
  interactivityModel: 'default#transparent',
}

export const parseCoords = (raw: string): [number, number] | null => {
  const parts = raw?.split(',').map((part) => Number(part.trim()))
  if (!parts || parts.length < 2 || parts.some(Number.isNaN)) return null

  return [parts[0], parts[1]]
}

export const boundsOf = (points: [number, number][]) =>
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

/**
 * A single point has no extent, and fitting to it zooms all the way in; the
 * padding gives a lone facility a neighbourhood to sit in.
 */
export const padBounds = ([[south, west], [north, east]]: number[][]) => {
  const pad = 0.05

  return [
    [south - pad, west - pad],
    [north + pad, east + pad],
  ]
}

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char] ?? char)

export { borders }
