import { useMemo } from 'react'
import uzGeoData from '@/features/dashboard/ui/uz.json'
import { cn } from '@/shared/lib/utils.ts'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip.tsx'

interface GeoJSONFeature {
  type: 'Feature'
  properties: {
    name?: string
    [key: string]: any
  }
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: any[]
  }
}

interface GeoJSON {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

interface RegionData {
  id?: number
  name?: string
  value?: number
}

interface UzbekistanMapProps {
  data?: RegionData[]
  onRegionClick?: (regionId: string | null) => void
  className?: string // Container className
  activeRegionId?: string | null
}

const BOUNDS = {
  minLon: 56.0,
  maxLon: 73.2,
  minLat: 37.2,
  maxLat: 45.6,
}

const VIEW_BOX_WIDTH = 800
const VIEW_BOX_HEIGHT = 500

const project = (lon: number, lat: number) => {
  const xPct = (lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)
  const yPct = (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)
  const x = xPct * VIEW_BOX_WIDTH
  const y = VIEW_BOX_HEIGHT - yPct * VIEW_BOX_HEIGHT
  return [x, y]
}

const createPath = (feature: GeoJSONFeature): string => {
  const { type, coordinates } = feature.geometry
  let path = ''

  const processRing = (ring: number[][]) => {
    let ringPath = ''
    ring.forEach((coord, i) => {
      const [x, y] = project(coord[0], coord[1])
      ringPath += i === 0 ? `M${x},${y}` : `L${x},${y}`
    })
    ringPath += 'Z '
    return ringPath
  }

  if (type === 'Polygon') {
    coordinates.forEach((ring: number[][]) => {
      path += processRing(ring)
    })
  } else if (type === 'MultiPolygon') {
    coordinates.forEach((polygon: number[][][]) => {
      polygon.forEach((ring: number[][]) => {
        path += processRing(ring)
      })
    })
  }

  return path
}

const REGION_NAMES: Record<string, string> = {
  'Tashkent City': 'Toshkent shahri',
  Tashkent: 'Toshkent viloyati',
  Andijan: 'Andijon viloyati',
  Bukhara: 'Buxoro viloyati',
  Bukhoro: 'Buxoro viloyati',
  Fergana: 'Farg‘ona viloyati',
  Ferghana: 'Farg‘ona viloyati',
  Jizzakh: 'Jizzax viloyati',
  Khorezm: 'Xorazm viloyati',
  Namangan: 'Namangan viloyati',
  Navoi: 'Navoiy viloyati',
  Kashkadarya: 'Qashqadaryo viloyati',
  'Republic of Karakalpakstan': 'Qoraqalpog‘iston Respublikasi',
  Karakalpakstan: 'Qoraqalpog‘iston Respublikasi',
  Samarkand: 'Samarqand viloyati',
  Syrdarya: 'Sirdaryo viloyati',
  Surkhandarya: 'Surxondaryo viloyati',
  Toshkent: 'Toshkent viloyati',
  'Toshkent shahri': 'Toshkent shahri',
  Andijon: 'Andijon viloyati',
  Buxoro: 'Buxoro viloyati',
  "Farg'ona": 'Farg‘ona viloyati',
  Jizzax: 'Jizzax viloyati',
  Xorazm: 'Xorazm viloyati',
  Navoiy: 'Navoiy viloyati',
  Qashqadaryo: 'Qashqadaryo viloyati',
  "Qoraqalpog'iston": 'Qoraqalpog‘iston Respublikasi',
  Samarqand: 'Samarqand viloyati',
  Sirdaryo: 'Sirdaryo viloyati',
  Surxondaryo: 'Surxondaryo viloyati',
}

export const UzbekistanMap = ({ onRegionClick, className, activeRegionId }: UzbekistanMapProps) => {
  const geoData = uzGeoData as unknown as GeoJSON

  const featuresWithPaths = useMemo(() => {
    return geoData.features.map((feature, idx) => ({
      ...feature,
      id: idx,
      path: createPath(feature),
    }))
  }, [geoData])

  return (
    // Map coloring: Clean style without bg/border, active uses Primary Teal
    <div
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden p-12', className)}
      onClick={() => onRegionClick?.(null)}
    >
      <svg
        viewBox={`0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`}
        className="h-full max-h-full w-full max-w-full drop-shadow-sm"
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {featuresWithPaths.map((feature, idx) => {
            let originalName = feature.properties.name || ''
            if (originalName === 'Tashkent' && idx === 13) {
              originalName = 'Tashkent City'
            }

            const regionName = REGION_NAMES[originalName] || originalName

            const isActive = activeRegionId === regionName

            return (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <path
                      d={feature.path}
                      className={cn(
                        'cursor-pointer stroke-white transition-colors duration-200 ease-in-out',
                        isActive
                          ? 'z-10 fill-[#0B626B] drop-shadow-md'
                          : !activeRegionId
                            ? 'fill-[#0B626B]/70 hover:fill-[#0B626B]'
                            : 'fill-slate-200 hover:fill-[#0B626B]'
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onRegionClick?.(regionName)
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{regionName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
