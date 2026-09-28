import type { Coordinate } from './yandex-map-types'

/** A point stored as "lat,lng" text, or nothing when the text is not one */
export const parseCoordinate = (location?: string | null): Coordinate | undefined => {
  const [lat, lng] = (location ?? '').split(',').map((part) => Number(part.trim()))

  return location && Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : undefined
}
