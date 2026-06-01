import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MAP_DEFAULTS } from '../model/yandex-map-config'
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import type { Coordinate, YandexMapProps } from '../model/yandex-map-types'
import { MapPin } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

const YandexMap: React.FC<YandexMapProps> = ({
  onMapClick,
  coords = [],
  zoom = MAP_DEFAULTS.zoom,
  width = MAP_DEFAULTS.width,
  height = MAP_DEFAULTS.height,
  center = MAP_DEFAULTS.center,
}) => {
  const mapRef = useRef<ymaps.Map | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const normalizedCoords = React.useMemo(() => {
    if (!coords || !Array.isArray(coords)) return []
    return coords
      .map((c: any) => {
        if (typeof c === 'string') {
          const parts = c.split(',').map((v) => Number(v.trim()))
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return parts as Coordinate
        }
        if (Array.isArray(c) && c.length >= 2) {
          return [Number(c[0]), Number(c[1])] as Coordinate
        }
        return c as Coordinate
      })
      .filter((c) => Array.isArray(c) && c.length >= 2 && !isNaN(c[0]) && !isNaN(c[1]))
  }, [coords])

  const normalizedCenter = React.useMemo(() => {
    if (typeof center === 'string') {
      const parts = (center as string).split(',').map((v) => Number(v.trim()))
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return parts as Coordinate
    }
    if (Array.isArray(center) && center.length >= 2) {
      return [Number(center[0]), Number(center[1])] as Coordinate
    }
    return MAP_DEFAULTS.center
  }, [center])

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

  const handleGetCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newCoords: Coordinate = [latitude, longitude]

          if (mapRef.current) {
            mapRef.current.setCenter(newCoords, 16, { duration: 300 })
          }

          if (onMapClick) {
            onMapClick([newCoords], 16)
          }
          setIsLocating(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Lokatsiyani aniqlash uchun ruxsat berilmagan yoki xatolik yuz berdi.')
          setIsLocating(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      alert('Sizning qurilmangizda geolokatsiya xizmati mavjud emas.')
    }
  }

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
        .setCenter(normalizedCenter, zoom, {
          duration: 300,
        })
        .catch((err) => console.error(err))
    }
  }, [normalizedCenter, zoom])

  return (
    <div className="flex w-full flex-col gap-3" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <div className="relative w-full flex-1 overflow-hidden rounded-md border" style={{ width }}>
        {/* @ts-ignore */}
        <YMaps query={{ load: 'package.full', lang: 'uz_UZ' }}>
          <Map
            width="100%"
            height="100%"
            onClick={handleMapClick}
            defaultState={{
              center: normalizedCenter,
              zoom,
              controls: ['zoomControl', 'typeSelector'],
              type: 'yandex#map',
            }}
            instanceRef={(ref) => (mapRef.current = ref)}
            onLoad={handleApiLoad}
          >
            {normalizedCoords.map((coordinate, index) => (
              <Placemark key={index} geometry={coordinate} options={{ preset: 'islands#blueDotIcon' }} />
            ))}
          </Map>
        </YMaps>

        {onMapClick && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="absolute right-4 bottom-6 z-10 bg-white shadow-md hover:bg-slate-100"
          >
            <MapPin className={`mr-2 h-4 w-4 ${isLocating ? 'animate-bounce text-blue-500' : ''}`} />
            {isLocating ? 'Aniqlanmoqda...' : 'Mening joyim'}
          </Button>
        )}
      </div>

      {normalizedCoords && normalizedCoords.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="font-medium text-slate-800">Tanlangan manzil:</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Kenglik:</span>
            <strong className="font-semibold text-slate-900">{normalizedCoords[0][0].toFixed(6)}</strong>
          </div>
          <div className="hidden h-4 w-px bg-slate-300 sm:block"></div>
          <div className="flex items-center gap-2">
            <span>Uzunlik:</span>
            <strong className="font-semibold text-slate-900">{normalizedCoords[0][1].toFixed(6)}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(YandexMap)
