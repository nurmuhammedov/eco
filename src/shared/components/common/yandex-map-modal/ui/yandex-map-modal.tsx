import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { z } from 'zod'
import { getMapContentSize } from '../lib'
import { Button } from '@/shared/components/ui/button'
import { Coordinate, YandexMap } from '@/shared/components/common/yandex-map'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

const UZBEKISTAN_CENTER: [number, number] = [41.3775, 64.5853]
const DEFAULT_COUNTRY_ZOOM = 6
const SELECTED_POINT_ZOOM = 17

const coordinateSchema = z.object({
  lat: z.coerce
    .number({ invalid_type_error: 'Raqam bo‘lishi kerak', required_error: 'Majburiy maydon!' })
    .min(37, 'Joylashuv O‘zbekiston Respublikasi hududan tashqarida')
    .max(46, 'Joylashuv O‘zbekiston Respublikasi hududan tashqarida')
    .transform((val) => (val ? val : 0)),
  lng: z.coerce
    .number({ invalid_type_error: 'Raqam bo‘lishi kerak', required_error: 'Majburiy maydon!' })
    .min(56, 'Joylashuv O‘zbekiston Respublikasi hududan tashqarida')
    .max(73, 'Joylashuv O‘zbekiston Respublikasi hududan tashqarida')
    .transform((val) => (val ? val : 0)),
})

interface YandexMapModalProps {
  label?: string
  initialCoords?: number[] | null
  onConfirm: (coords: string) => void
}

const YandexMapModal: React.FC<YandexMapModalProps> = ({ label = 'Xaritadan belgilash', onConfirm, initialCoords }) => {
  const idealMapHeight = getMapContentSize()
  const [open, setOpen] = useState(false)

  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  const [errors, setErrors] = useState<{ lat?: string; lng?: string }>({})
  const [isValid, setIsValid] = useState(false)

  const [mapCenter, setMapCenter] = useState<[number, number]>(UZBEKISTAN_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_COUNTRY_ZOOM)
  const [mapCoords, setMapCoords] = useState<Coordinate[]>([])

  useEffect(() => {
    if (initialCoords && initialCoords.length === 2) {
      const [initLat, initLng] = initialCoords
      setLat(String(initLat))
      setLng(String(initLng))
      setMapCenter([initLat, initLng])
      setMapCoords([[initLat, initLng]])
      setMapZoom(SELECTED_POINT_ZOOM)
      setIsValid(true)
      setErrors({})
    } else {
      setLat('')
      setLng('')
      setMapCenter(UZBEKISTAN_CENTER)
      setMapCoords([])
      setMapZoom(DEFAULT_COUNTRY_ZOOM)
      setIsValid(false)
      setErrors({})
    }
  }, [initialCoords, open])

  const handleCheckLocation = useCallback(() => {
    const result = coordinateSchema.safeParse({ lat, lng })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        lat: fieldErrors.lat?.[0],
        lng: fieldErrors.lng?.[0],
      })
      setIsValid(false)
    } else {
      setErrors({})
      setIsValid(true)
      const newLat = result.data.lat
      const newLng = result.data.lng
      setMapCenter([newLat, newLng])
      setMapCoords([[newLat, newLng]])
      setMapZoom(SELECTED_POINT_ZOOM)
    }
  }, [lat, lng])

  const handleMapClick = useCallback((coords: Coordinate[]) => {
    if (coords.length > 0) {
      const [newLat, newLng] = coords[0]

      setLat(newLat.toFixed(6))
      setLng(newLng.toFixed(6))
      setMapCoords([[newLat, newLng]])
      const result = coordinateSchema.safeParse({ lat: newLat, lng: newLng })

      if (result.success) {
        setErrors({})
        setIsValid(true)
      } else {
        const fieldErrors = result.error.flatten().fieldErrors
        setErrors({
          lat: fieldErrors.lat?.[0],
          lng: fieldErrors.lng?.[0],
        })
        setIsValid(false)
      }
    }
  }, [])

  const handleConfirm = useCallback(() => {
    const result = coordinateSchema.safeParse({ lat, lng })
    if (result.success) {
      onConfirm(`${result.data.lat}, ${result.data.lng}`)
      setOpen(false)
    } else {
      handleCheckLocation()
    }
  }, [lat, lng, onConfirm, handleCheckLocation])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn('w-full justify-between', {
            'text-neutral-350': !initialCoords,
          })}
        >
          {initialCoords ? (
            initialCoords.join(', ')
          ) : (
            <Fragment>
              {label} <MapPinned className="ml-2 h-4 w-4" />
            </Fragment>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[95vh] w-[98vw] max-w-[98vw] flex-col p-6">
        <DialogHeader className="mb-4 shrink-0">
          <DialogTitle>Joylashuvni belgilang</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-2">
          <div className="grid shrink-0 grid-cols-1 items-start gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div className="grid gap-2">
              <Label htmlFor="lat">Kenglik</Label>
              <Input
                id="lat"
                type="number"
                placeholder="41.311081"
                value={lat}
                onChange={(e) => {
                  setLat(e.target.value)
                  setIsValid(false)
                }}
                className={cn(errors.lat ? 'border-red-500' : '')}
              />
              {errors.lat && <span className="text-xs text-red-500">{errors.lat}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lng">Uzunlik</Label>
              <Input
                id="lng"
                type="number"
                placeholder="69.240562"
                value={lng}
                onChange={(e) => {
                  setLng(e.target.value)
                  setIsValid(false)
                }}
                className={cn(errors.lng ? 'border-red-500' : '')}
              />
              {errors.lng && <span className="text-xs text-red-500">{errors.lng}</span>}
            </div>

            <div className="pt-8 md:pt-6">
              <Button type="button" onClick={handleCheckLocation} variant="default">
                Joyni belgilash
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'relative min-h-[300px] w-full shrink overflow-hidden rounded-md border',
              "[&_[class*='copyright']]:hidden"
            )}
            style={{ height: idealMapHeight }}
          >
            <YandexMap
              width="100%"
              height="100%"
              onMapClick={handleMapClick}
              center={mapCenter}
              zoom={mapZoom}
              coords={mapCoords}
            />
          </div>
        </div>

        <DialogFooter className="mt-4 shrink-0">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Bekor qilish
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} type="button" disabled={!isValid}>
            Saqlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default React.memo(YandexMapModal)
