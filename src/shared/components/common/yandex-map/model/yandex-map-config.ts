import type { ComponentProps } from 'react'
import type { YMaps } from '@pbe/react-yandex-maps'
import type { Coordinate } from './yandex-map-types'

export const MAP_DEFAULTS: { zoom: number; width: string; height: number; center: Coordinate } = {
  zoom: 10,
  width: '100%',
  height: 400,
  center: [41.311081, 69.240562],
}

/**
 * The library's types predate uz_UZ, which the Yandex API itself accepts - the
 * cast is narrowed to this one value rather than silencing the whole element.
 */
export const MAP_QUERY = { load: 'package.full', lang: 'uz_UZ' } as unknown as ComponentProps<typeof YMaps>['query']
