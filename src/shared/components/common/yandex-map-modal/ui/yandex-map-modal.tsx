import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { z } from 'zod'
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
const REGION_ZOOM = 12

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
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)

  const [mapCenter, setMapCenter] = useState<[number, number]>(UZBEKISTAN_CENTER)
  const [mapZoom, setMapZoom] = useState(DEFAULT_COUNTRY_ZOOM)
  const [mapCoords, setMapCoords] = useState<Coordinate[]>([])

  useEffect(() => {
    if (initialCoords && initialCoords.length === 2) {
      const [initLat, initLng] = initialCoords
      setInputValue(`${initLat}, ${initLng}`)
      setMapCenter([initLat, initLng])
      setMapCoords([[initLat, initLng]])
      setMapZoom(SELECTED_POINT_ZOOM)
      setIsValid(true)
      setError(null)
    } else {
      setInputValue('')
      setMapCenter(UZBEKISTAN_CENTER)
      setMapCoords([])
      setMapZoom(DEFAULT_COUNTRY_ZOOM)
      setIsValid(false)
      setError(null)
    }
  }, [initialCoords, open])

  const validateInput = (value: string): { isValid: boolean; lat?: number; lng?: number; error?: string } => {
    // Check for correct format: "lat, lng" (comma)
    if (!value.includes(',')) {
      return { isValid: false, error: 'Koordinatalar orasida vergul bo‘lishi kerak (masalan: 41.311081, 69.240562)' }
    }

    const parts = value.split(',')
    if (parts.length !== 2) {
      return { isValid: false, error: 'Noto‘g‘ri format' }
    }

    const latStr = parts[0].trim()
    const lngStr = parts[1].trim()

    const result = coordinateSchema.safeParse({ lat: latStr, lng: lngStr })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const errorMessage = fieldErrors.lat?.[0] || fieldErrors.lng?.[0] || 'Noto‘g‘ri koordinatalar'
      return { isValid: false, error: errorMessage }
    }

    return { isValid: true, lat: result.data.lat, lng: result.data.lng }
  }

  const handleCheckLocation = useCallback(() => {
    const validation = validateInput(inputValue)

    if (!validation.isValid) {
      setError(validation.error || 'Xatolik')
      setIsValid(false)
    } else {
      setError(null)
      setIsValid(true)
      if (validation.lat !== undefined && validation.lng !== undefined) {
        setMapCenter([validation.lat, validation.lng])
        setMapCoords([[validation.lat, validation.lng]])
        setMapZoom(SELECTED_POINT_ZOOM)
      }
    }
  }, [inputValue])

  const handleMapClick = useCallback((coords: Coordinate[], currentMapZoom: number) => {
    if (coords.length > 0) {
      const [newLat, newLng] = coords[0]
      const formattedInput = `${newLat.toFixed(6)}, ${newLng.toFixed(6)}`

      setInputValue(formattedInput)
      setMapCoords([[newLat, newLng]])
      setMapCenter([newLat, newLng])

      if (currentMapZoom < REGION_ZOOM) {
        setMapZoom(REGION_ZOOM)
      } else {
        setMapZoom(currentMapZoom)
      }

      const result = coordinateSchema.safeParse({ lat: newLat, lng: newLng })

      if (result.success) {
        setError(null)
        setIsValid(true)
      } else {
        const fieldErrors = result.error.flatten().fieldErrors
        setError(fieldErrors.lat?.[0] || fieldErrors.lng?.[0] || 'Xatolik')
        setIsValid(false)
      }
    }
  }, [])

  const handleConfirm = useCallback(() => {
    const validation = validateInput(inputValue)
    if (validation.isValid) {
      // Return normalized string "lat, lng"
      onConfirm(`${validation.lat}, ${validation.lng}`)
      setOpen(false)
    } else {
      handleCheckLocation()
    }
  }, [inputValue, onConfirm, handleCheckLocation])

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

      <DialogContent className="flex max-h-[95vh] w-full max-w-5xl flex-col p-6">
        <DialogHeader className="mb-4 shrink-0">
          <DialogTitle>Joylashuvni belgilang</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-2">
          <div className="grid shrink-0 grid-cols-1 items-start gap-4 md:grid-cols-[1fr_auto]">
            <div className="grid gap-2">
              <Label htmlFor="coords">Koordinatalar</Label>
              <Input
                id="coords"
                value={inputValue}
                placeholder="41.311081, 69.240562"
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setIsValid(false) // Re-validate on change or just reset valid state
                  // Real-time validation could be annoying, so waiting for 'Joyni belgilash' or blur is better usually,
                  // but let's clear error on type to avoid stale error
                  if (error) setError(null)
                }}
                className={cn(error ? 'border-red-500' : '')}
              />
              {error && <span className="text-xs text-red-500">{error}</span>}
            </div>

            <div className="pt-8 md:pt-6">
              <Button type="button" onClick={handleCheckLocation} variant="default">
                Joyni belgilash
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'relative h-[50vh] w-full shrink overflow-hidden rounded-md border md:h-[60vh]',
              "[&_[class*='copyright']]:hidden"
            )}
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
