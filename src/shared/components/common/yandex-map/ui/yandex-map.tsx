import React, { useCallback, useEffect, useRef } from 'react'
import { MAP_DEFAULTS } from '../model/yandex-map-config'
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import type { Coordinate, YandexMapProps } from '../model/yandex-map-types'

const YandexMap: React.FC<YandexMapProps> = ({
  onMapClick,
  coords = [],
  zoom = MAP_DEFAULTS.zoom,
  width = MAP_DEFAULTS.width,
  height = MAP_DEFAULTS.height,
  center = MAP_DEFAULTS.center,
}) => {
  const mapRef = useRef<ymaps.Map | null>(null)

  const handleMapClick = useCallback(
    (e: ymaps.IEvent) => {
      const coords = e.get('coords') as Coordinate

      let currentZoom = zoom
      if (mapRef.current) {
        currentZoom = mapRef.current.getZoom()
      }

      onMapClick?.([coords], currentZoom)
    },
    [onMapClick, zoom]
  )

  const handleApiLoad = (ymaps: any) => {
    ymaps.borders.load('001', { lang: 'uz', quality: 1 }).then((geojson: any) => {
      const regions = geojson.features.filter((feature: any) => feature.properties.iso3166 === 'UZ')

      if (regions.length > 0) {
        const collection = new ymaps.GeoObjectCollection(null, {
          strokeColor: '#3b82f6',
          strokeWidth: 2,
          fillColor: 'rgba(59,130,246,0.02)',
          interactivityModel: 'default#transparent',
        })
        collection.add(new ymaps.GeoObject(regions[0]))
        if (mapRef.current) {
          mapRef.current.geoObjects.add(collection)
        }
      }
    })
  }

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current
        .setCenter(center, zoom, {
          duration: 300,
        })
        .catch((err) => console.error(err))
    }
  }, [center, zoom])

  return (
    // @ts-ignore
    <YMaps query={{ load: 'package.full', lang: 'uz_UZ' }}>
      <Map
        width={width}
        height={height}
        onClick={handleMapClick}
        defaultState={{
          center,
          zoom,
          controls: ['zoomControl', 'typeSelector'],
          type: 'yandex#map',
        }}
        instanceRef={(ref) => (mapRef.current = ref)}
        onLoad={handleApiLoad}
      >
        {coords.map((coordinate, index) => (
          <Placemark key={index} geometry={coordinate} options={{ preset: 'islands#blueDotIcon' }} />
        ))}
      </Map>
    </YMaps>
  )
}

export default React.memo(YandexMap)
